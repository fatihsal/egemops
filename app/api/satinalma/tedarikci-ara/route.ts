import { NextResponse } from "next/server";

import { supabaseSunucu } from "@/lib/supabase/server";
import { aramaSaglayici } from "@/lib/satinalma/arama/factory";

// Tedarikçi adayı arama — gerçek web arama API'si (server-side).
// Anahtar yoksa dürüstçe 503 döner; sonuç UYDURULMAZ. Her sonuç gerçek URL taşır.

export async function POST(req: Request) {
  try {
    const sb = await supabaseSunucu();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ hata: "Oturum bulunamadı." }, { status: 401 });

    const saglayici = aramaSaglayici();
    if (!saglayici) {
      return NextResponse.json(
        { hata: "Web arama anahtarı yapılandırılmamış. .env.local'e TAVILY_API_KEY veya SERPER_API_KEY ekleyin." },
        { status: 503 },
      );
    }

    let govde: { sorgu?: string };
    try {
      govde = await req.json();
    } catch {
      return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
    }
    const sorgu = (govde.sorgu ?? "").trim();
    if (!sorgu) return NextResponse.json({ hata: "Arama sorgusu gerekli." }, { status: 400 });

    // İlk hedef Türkiye: sorguya ülke bağlamı ekle, sonra .tr alan adlarını öne al.
    const sorguTR = /t[üu]rkiye|turkey/i.test(sorgu) ? sorgu : `${sorgu} Türkiye tedarikçi distribütör`;
    const sonuclar = await saglayici.ara(sorguTR, 10);
    const trMi = (h: string) => /\.tr$/i.test(h);
    const sirali = [...sonuclar].sort((a, b) => (trMi(b.alanAdi) ? 1 : 0) - (trMi(a.alanAdi) ? 1 : 0));
    return NextResponse.json({ saglayici: saglayici.ad, sonuclar: sirali });
  } catch (e) {
    console.error("[tedarikci-ara] hata:", e);
    return NextResponse.json({ hata: e instanceof Error ? e.message : "Arama başarısız." }, { status: 502 });
  }
}
