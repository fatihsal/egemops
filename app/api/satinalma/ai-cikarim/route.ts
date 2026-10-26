import { NextResponse } from "next/server";

import { supabaseSunucu } from "@/lib/supabase/server";

// Görselden teknik ürün bilgisi çıkarımı — OpenAI vision (server-side).
// API anahtarı YALNIZCA backend'de (OPENAI_API_KEY). Anahtar yoksa dürüstçe
// 503 döner; sahte/uydurma çıktı üretilmez.

const VARSAYILAN_MODEL = "gpt-4o-mini";

const SISTEM_TALIMATI = `Sen teknik satın alma için bir ürün tanımlama asistanısın.
Verilen fotoğraftan endüstriyel/teknik malzemenin bilgilerini çıkar.
SADECE görselde görünen veya makul biçimde çıkarılabilen bilgileri yaz; EMİN DEĞİLSEN uydurma, ilgili alanı boş bırak ve "belirsizAlanlar" listesine ekle.
Ürün/sipariş kodunu TAM oku; son ekleri (ör. /TT) silme, seri numarasıyla karıştırma, kendiliğinden başka kodla değiştirme. Emin değilsen boş bırak ve belirsizAlanlar'a ekle.
Yanıtı yalnızca şu şemada GEÇERLİ JSON olarak ver:
{
  "marka": string,            // emin değilsen ""
  "model": string,            // emin değilsen ""
  "urunKodu": string,         // tam sipariş/ürün kodu (etiketteki haliyle); emin değilsen ""
  "kategori": string,         // ör. "Pnömatik silindir", "Rulman", "Sensör"
  "ozet": string,             // 1-2 cümle Türkçe açıklama
  "ozellikler": [ { "ad": string, "deger": string } ],  // görülebilen teknik özellikler
  "belirsizAlanlar": [ string ],  // emin olunamayan alan adları
  "guven": number             // 0..1 arası genel güven
}
Tüm metinler Türkçe olsun. Sadece JSON döndür.`;

export async function POST(req: Request) {
  try {
    // Oturum doğrula (yalnızca giriş yapmış kullanıcı).
    const sb = await supabaseSunucu();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ hata: "Oturum bulunamadı." }, { status: 401 });

    const anahtar = process.env.OPENAI_API_KEY;
    if (!anahtar) {
      return NextResponse.json(
        { hata: "OpenAI API anahtarı yapılandırılmamış. .env.local'e OPENAI_API_KEY ekleyip sunucuyu yeniden başlatın." },
        { status: 503 },
      );
    }

    let govde: { gorselUrl?: string };
    try {
      govde = await req.json();
    } catch {
      return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
    }
    const gorselUrl = (govde.gorselUrl ?? "").trim();
    if (!gorselUrl) return NextResponse.json({ hata: "Görsel URL'i gerekli." }, { status: 400 });

    const yanit = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${anahtar}` },
      body: JSON.stringify({
        model: process.env.OPENAI_VISION_MODEL || VARSAYILAN_MODEL,
        messages: [
          { role: "system", content: SISTEM_TALIMATI },
          {
            role: "user",
            content: [
              { type: "text", text: "Bu malzemenin teknik bilgilerini çıkar." },
              { type: "image_url", image_url: { url: gorselUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.2,
      }),
    });

    if (!yanit.ok) {
      const metin = await yanit.text();
      console.error("[ai-cikarim] OpenAI hatası:", yanit.status, metin);
      return NextResponse.json(
        { hata: `AI servisi yanıt vermedi (HTTP ${yanit.status}).` },
        { status: 502 },
      );
    }

    const sonuc = await yanit.json();
    const icerik: string | undefined = sonuc?.choices?.[0]?.message?.content;
    if (!icerik) return NextResponse.json({ hata: "AI boş yanıt döndürdü." }, { status: 502 });

    let cikarim: unknown;
    try {
      cikarim = JSON.parse(icerik);
    } catch {
      return NextResponse.json({ hata: "AI yanıtı çözümlenemedi." }, { status: 502 });
    }

    return NextResponse.json({ cikarim });
  } catch (e) {
    console.error("[ai-cikarim] beklenmeyen hata:", e);
    return NextResponse.json({ hata: e instanceof Error ? e.message : "Sunucu hatası." }, { status: 500 });
  }
}
