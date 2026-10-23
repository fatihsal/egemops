import { NextResponse } from "next/server";

import { supabaseSunucu } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { gmailAyarVar, gmailThreadMesajlari, gmailEkIndir, gmailTokenYenile } from "@/lib/satinalma/mail/gmail";
import { hesapGetir, hesapAccessGuncelle } from "@/lib/satinalma/mail/mail-hesabi";
import { pdfMetinCikar, teklifAiAyristir } from "@/lib/satinalma/teklif-ayristir";

export const runtime = "nodejs";
export const maxDuration = 60;

// Teslim edilemedi / otomatik bildirim mesajı mı?
function iadeMi(from: string, konu: string): boolean {
  const f = from.toLowerCase();
  const k = konu.toLowerCase();
  if (f.includes("mailer-daemon") || f.includes("postmaster") || f.includes("no-reply") || f.includes("noreply")) return true;
  return /undeliver|delivery status|delivery failure|failure notice|returned mail|teslim edilemedi|iletilemedi/.test(k);
}

// Gelen e-postalardaki teklifleri OTOMATIK toplar: RFQ thread'lerini okur,
// tedarikçi cevaplarındaki PDF/metni ayrıştırır, sa_teklifler'e yazar.
export async function POST(req: Request) {
  try {
    const sb = await supabaseSunucu();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ hata: "Oturum bulunamadı." }, { status: 401 });

    if (!gmailAyarVar()) return NextResponse.json({ hata: "Gmail yapılandırılmamış." }, { status: 503 });

    let govde: { talepId?: string };
    try { govde = await req.json(); } catch { return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 }); }
    const talepId = (govde.talepId ?? "").trim();
    if (!talepId) return NextResponse.json({ hata: "talepId gerekli." }, { status: 400 });

    const hesap = await hesapGetir(user.id);
    if (!hesap) return NextResponse.json({ hata: "Gmail bağlı değil." }, { status: 503 });
    if (hesap.scope && !hesap.scope.includes("gmail.readonly")) {
      return NextResponse.json({ hata: "Gmail okuma izni yok. Ayarlar'dan yeniden bağlanın.", yenidenBaglan: true }, { status: 403 });
    }

    // Token tazeleme
    let accessToken = hesap.accessToken;
    const suresiDoldu = hesap.expiry ? Date.now() >= new Date(hesap.expiry).getTime() - 60_000 : false;
    if (suresiDoldu && hesap.refreshToken) {
      const yeni = await gmailTokenYenile(hesap.refreshToken);
      accessToken = yeni.access_token;
      await hesapAccessGuncelle(user.id, yeni.access_token, new Date(Date.now() + yeni.expires_in * 1000).toISOString());
    }
    const bizimEposta = (hesap.eposta ?? "").toLowerCase();

    // Talep bağlamı (AI uygunluk değerlendirmesi için)
    const { data: talep } = await sb
      .from("sa_talepler")
      .select("baslik, marka, model, adet, birim, teknik_aciklama")
      .eq("id", talepId)
      .maybeSingle();
    const baglam = talep
      ? [talep.baslik, [talep.marka, talep.model].filter(Boolean).join(" "), talep.adet ? `${talep.adet} ${talep.birim ?? ""}` : "", talep.teknik_aciklama].filter(Boolean).join(" | ")
      : undefined;

    // Gönderilmiş RFQ'lar (thread'li)
    const { data: rfqlar } = await sb
      .from("sa_rfq")
      .select("id, tedarikci_id, thread_id")
      .eq("talep_id", talepId)
      .not("thread_id", "is", null)
      .is("deleted_at", null);
    if (!rfqlar || rfqlar.length === 0) {
      return NextResponse.json({ yeni: 0, not: "Henüz gönderilmiş (thread'li) RFQ yok." });
    }

    // Daha önce eklenen kaynaklar (tekrarı önle)
    const db = supabaseAdmin();
    const { data: mevcut } = await sb
      .from("sa_teklifler")
      .select("kaynak_mesaj_id, kaynak_ek_id")
      .eq("talep_id", talepId)
      .is("deleted_at", null);
    const eklenmis = new Set((mevcut ?? []).map((m) => `${m.kaynak_mesaj_id ?? ""}:${m.kaynak_ek_id ?? ""}`));

    // Her tedarikçinin mevcut teklif sayısı -> yeni teklif sürümü (revizyon)
    const { data: surumVerisi } = await sb
      .from("sa_teklifler")
      .select("tedarikci_id")
      .eq("talep_id", talepId)
      .is("deleted_at", null);
    const surumHarita = new Map<string, number>();
    for (const s of (surumVerisi ?? []) as { tedarikci_id: string | null }[]) {
      const k = s.tedarikci_id ?? "null";
      surumHarita.set(k, (surumHarita.get(k) ?? 0) + 1);
    }
    const siradakiSurum = (tedId: string | null) => {
      const k = tedId ?? "null";
      const s = (surumHarita.get(k) ?? 0) + 1;
      surumHarita.set(k, s);
      return s;
    };

    let yeni = 0;
    let yanitliThread = 0;
    let digerYanit = 0;

    for (const rfq of rfqlar) {
      let mesajlar;
      try {
        mesajlar = await gmailThreadMesajlari(accessToken, rfq.thread_id as string);
      } catch (e) {
        const m = e instanceof Error ? e.message : "";
        if (m.includes("403") || m.includes("insufficient")) {
          return NextResponse.json({ hata: "Gmail okuma izni reddedildi. Yeniden bağlanın.", yenidenBaglan: true }, { status: 403 });
        }
        continue;
      }

      const gelenler = mesajlar.filter((m) => !m.from.toLowerCase().includes(bizimEposta) && !iadeMi(m.from, m.konu));
      if (gelenler.length > 0) yanitliThread++;

      for (const msg of gelenler) {
        const pdfEkler = msg.ekler.filter((e) => e.mimeType === "application/pdf" || e.dosyaAd.toLowerCase().endsWith(".pdf"));

        // 1) PDF ekleri — yalnızca teklif/revize ya da fiyat içeren PDF kaydedilir.
        for (const ek of pdfEkler) {
          const anahtar = `${msg.id}:${ek.ekId}`;
          if (eklenmis.has(anahtar)) continue;
          try {
            const buf = await gmailEkIndir(accessToken, msg.id, ek.ekId);
            const metin = await pdfMetinCikar(buf);
            const a = await teklifAiAyristir(metin, baglam);
            if (!(a.tur === "teklif" || a.tur === "revize" || a.fiyat != null || a.okunamadi)) continue;
            await db.from("sa_teklifler").insert({
              talep_id: talepId, tedarikci_id: rfq.tedarikci_id, rfq_id: rfq.id, kaynak: "gmail",
              fiyat: a.fiyat, para_birimi: a.paraBirimi, kdv_dahil: a.kdvDahil, kdv_oran: a.kdvOran,
              termin_gun: a.terminGun, nakliye: a.nakliye, garanti_ay: a.garantiAy,
              teknik_uygun: a.teknikUygun, teknik_not: a.teknikNot, gecerlilik: a.gecerlilik, ai_ozet: a.ozet, okunamadi: a.okunamadi,
              surum: siradakiSurum(rfq.tedarikci_id), notlar: `${ek.dosyaAd} · ${msg.from}`, kaynak_mesaj_id: msg.id, kaynak_ek_id: ek.ekId,
            });
            eklenmis.add(anahtar);
            yeni++;
          } catch { /* tek ek hatası tüm işlemi durdurmasın */ }
        }

        // 2) PDF yoksa, gövde metni — yalnızca teklif/revize türündeyse kaydet.
        if (pdfEkler.length === 0 && msg.metin.length > 30) {
          const anahtar = `${msg.id}:body`;
          if (eklenmis.has(anahtar)) continue;
          try {
            const a = await teklifAiAyristir(msg.metin, baglam);
            if ((a.tur === "teklif" || a.tur === "revize") && (a.fiyat != null || a.ozet)) {
              await db.from("sa_teklifler").insert({
                talep_id: talepId, tedarikci_id: rfq.tedarikci_id, rfq_id: rfq.id, kaynak: "gmail",
                fiyat: a.fiyat, para_birimi: a.paraBirimi, kdv_dahil: a.kdvDahil, kdv_oran: a.kdvOran,
                termin_gun: a.terminGun, nakliye: a.nakliye, garanti_ay: a.garantiAy,
                teknik_uygun: a.teknikUygun, teknik_not: a.teknikNot, gecerlilik: a.gecerlilik, ai_ozet: a.ozet, okunamadi: false,
                surum: siradakiSurum(rfq.tedarikci_id), notlar: `E-posta gövdesi · ${msg.from}`, kaynak_mesaj_id: msg.id, kaynak_ek_id: "body",
              });
              eklenmis.add(anahtar);
              yeni++;
            } else if (a.tur === "stok_yok" || a.tur === "soru") {
              // Fiyat olmayan yanıtlar: teklif oluşturulmaz (brifing §8).
              digerYanit++;
            }
          } catch { /* yut */ }
        }
      }

      // Yanıt gelmişse RFQ'yu "yanıtlandı" yap
      if (gelenler.length > 0) {
        await db.from("sa_rfq").update({ durum: "yanitlandi" }).eq("id", rfq.id).eq("durum", "gonderildi");
      }
    }

    return NextResponse.json({ yeni, yanitliThread, digerYanit });
  } catch (e) {
    console.error("[teklif-topla] hata:", e);
    return NextResponse.json({ hata: e instanceof Error ? e.message : "Sunucu hatası." }, { status: 500 });
  }
}
