import { NextResponse } from "next/server";

import { supabaseSunucu } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { gmailAyarVar, gmailProvider, gmailTokenYenile } from "@/lib/satinalma/mail/gmail";
import { hesapGetir, hesapAccessGuncelle } from "@/lib/satinalma/mail/mail-hesabi";
import { rfqIcerikHash } from "@/lib/satinalma/rfq-hash";

// RFQ gönderimi — GERÇEK e-posta. Kullanıcı onayı UI'da alınır; burada
// alıcının İZİNLİ TEST ALICILARI arasında olması zorunlu kılınır.
function izinliAlicilar(): string[] {
  return (process.env.SATINALMA_IZINLI_ALICILAR || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
}

export async function POST(req: Request) {
  try {
    const sb = await supabaseSunucu();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ hata: "Oturum bulunamadı." }, { status: 401 });

    if (!gmailAyarVar()) {
      return NextResponse.json({ hata: "Gmail yapılandırılmamış (.env.local eksik)." }, { status: 503 });
    }

    let govde: { rfqId?: string; onayHash?: string };
    try {
      govde = await req.json();
    } catch {
      return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
    }
    const rfqId = (govde.rfqId ?? "").trim();
    if (!rfqId) return NextResponse.json({ hata: "rfqId gerekli." }, { status: 400 });
    const onayHash = (govde.onayHash ?? "").trim();
    if (!onayHash) return NextResponse.json({ hata: "Onay gerekli." }, { status: 400 });

    // RFQ'yu getir
    const { data: rfq, error: rfqHata } = await sb
      .from("sa_rfq")
      .select("id, konu, govde, alici_eposta, durum")
      .eq("id", rfqId)
      .is("deleted_at", null)
      .maybeSingle();
    if (rfqHata) return NextResponse.json({ hata: rfqHata.message }, { status: 500 });
    if (!rfq) return NextResponse.json({ hata: "RFQ bulunamadı." }, { status: 404 });

    // Onay içeriğe bağlı: onaylanan içerik ile DB'deki içerik aynı olmalı.
    const guncelHash = rfqIcerikHash(rfq.alici_eposta, rfq.konu, rfq.govde);
    if (onayHash !== guncelHash) {
      return NextResponse.json({ hata: "RFQ içeriği onaydan sonra değişmiş. Lütfen önizleyip yeniden onaylayın." }, { status: 409 });
    }

    if (rfq.durum === "gonderildi" || rfq.durum === "yanitlandi") {
      return NextResponse.json({ hata: "Bu RFQ zaten gönderilmiş." }, { status: 409 });
    }

    const alici = (rfq.alici_eposta ?? "").trim();
    if (!alici) return NextResponse.json({ hata: "Alıcı e-posta adresi boş." }, { status: 400 });

    // GÜVENLİK: SATINALMA_IZINLI_ALICILAR doluysa yalnızca o adreslere gönderilir
    // (test kalkanı). Boşsa kısıt yoktur (canlı) — her gönderim UI'da kullanıcı
    // onayından geçer. Gerçek tedarikçilere göndermek için listeyi boşaltın.
    const izinli = izinliAlicilar();
    if (izinli.length > 0 && !izinli.includes(alici.toLowerCase())) {
      return NextResponse.json(
        { hata: `"${alici}" izinli test alıcıları arasında değil. Gerçek tedarikçilere göndermek için .env.local'deki SATINALMA_IZINLI_ALICILAR'ı boşaltın ya da bu adresi ekleyin.` },
        { status: 403 },
      );
    }

    // Gmail hesabı + gerekiyorsa token yenileme
    let hesap;
    try {
      hesap = await hesapGetir(user.id);
    } catch (e) {
      return NextResponse.json({ hata: e instanceof Error ? e.message : "Token çözülemedi." }, { status: 500 });
    }
    if (!hesap) return NextResponse.json({ hata: "Gmail bağlı değil. Ayarlar'dan bağlayın." }, { status: 503 });

    let accessToken = hesap.accessToken;
    const suresiDoldu = hesap.expiry ? Date.now() >= new Date(hesap.expiry).getTime() - 60_000 : false;
    if (suresiDoldu && hesap.refreshToken) {
      try {
        const yeni = await gmailTokenYenile(hesap.refreshToken);
        accessToken = yeni.access_token;
        await hesapAccessGuncelle(user.id, yeni.access_token, new Date(Date.now() + yeni.expires_in * 1000).toISOString());
      } catch (e) {
        return NextResponse.json({ hata: "Gmail oturumu yenilenemedi, yeniden bağlanın." + (e instanceof Error ? ` (${e.message})` : "") }, { status: 401 });
      }
    }

    // Gönder
    const db = supabaseAdmin();
    try {
      const { messageId, threadId } = await gmailProvider(accessToken).gonder({
        alici,
        konu: rfq.konu ?? "(konu yok)",
        govde: rfq.govde ?? "",
      });
      await db.from("sa_rfq").update({ durum: "gonderildi", provider: "gmail", message_id: messageId, thread_id: threadId ?? null, onaylayan: user.id, gonderildi_at: new Date().toISOString() }).eq("id", rfqId);
      await db.from("sa_mail_log").insert({ rfq_id: rfqId, provider: "gmail", message_id: messageId, durum: "gonderildi" });
      return NextResponse.json({ ok: true, messageId });
    } catch (e) {
      const mesaj = e instanceof Error ? e.message : "Gönderim hatası.";
      await db.from("sa_mail_log").insert({ rfq_id: rfqId, provider: "gmail", durum: "hata", hata: mesaj });
      return NextResponse.json({ hata: mesaj }, { status: 502 });
    }
  } catch (e) {
    console.error("[rfq-gonder] hata:", e);
    return NextResponse.json({ hata: e instanceof Error ? e.message : "Sunucu hatası." }, { status: 500 });
  }
}
