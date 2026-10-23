// Teklif ayrıştırma — PDF/metin'den yapısal teklif çıkarımı. SADECE SUNUCU.
// PDF metni pdf-parse ile çıkarılır; sayılar AI ile yapılandırılır. Değer
// UYDURULMAZ: metinde yoksa null bırakılır. Taranmış (metinsiz) PDF -> okunamadi.

import { PDFParse } from "pdf-parse";

// Gelen mesaj türü — her mail teklif değildir.
export type MesajTuru = "teklif" | "revize" | "stok_yok" | "soru" | "bilgi" | "diger";

export interface AyristirilmisTeklif {
  tur: MesajTuru;
  fiyat: number | null;
  paraBirimi: string | null;
  kdvDahil: boolean | null;
  kdvOran: number | null;
  terminGun: number | null;
  nakliye: string | null;
  garantiAy: number | null;
  teknikUygun: boolean | null;
  teknikNot: string | null;
  gecerlilik: string | null;
  ozet: string | null;
  okunamadi: boolean;
}

const BOS: AyristirilmisTeklif = {
  tur: "diger", fiyat: null, paraBirimi: null, kdvDahil: null, kdvOran: null, terminGun: null,
  nakliye: null, garantiAy: null, teknikUygun: null, teknikNot: null, gecerlilik: null, ozet: null, okunamadi: false,
};

export async function pdfMetinCikar(buf: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: new Uint8Array(buf) });
    const sonuc = await parser.getText();
    return (sonuc?.text ?? "").trim();
  } catch {
    return "";
  }
}

const SISTEM = `Sen teknik satın alma için gelen e-posta/teklif ayrıştırma asistanısın.
Önce mesajın TÜRÜNÜ belirle, sonra fiyat teklifi ise alanlarını çıkar.
Metinde AÇIKÇA yoksa null bırak; ASLA uydurma/tahmin etme.
tur değerleri: "teklif" (fiyat teklifi), "revize" (güncellenmiş/revize teklif),
"stok_yok" (ürün yok/tedarik edilemiyor), "soru" (bilgi istiyor/soru soruyor),
"bilgi" (genel bilgilendirme, fiyat yok), "diger".
Yalnızca şu şemada GEÇERLİ JSON döndür:
{
  "tur": "teklif"|"revize"|"stok_yok"|"soru"|"bilgi"|"diger",
  "fiyat": number|null,            // toplam veya birim fiyat (sayı, binlik ayırıcı olmadan)
  "paraBirimi": "TRY"|"USD"|"EUR"|null,
  "kdvDahil": boolean|null,        // fiyat KDV dahil mi
  "kdvOran": number|null,          // yüzde (ör. 20)
  "terminGun": number|null,        // teslim süresi gün cinsinden
  "nakliye": string|null,          // nakliye/teslim şartı (ör. "satıcıya ait", "FCA")
  "garantiAy": number|null,        // garanti ay cinsinden
  "teknikUygun": boolean|null,     // istenen malzemeye teknik olarak uygun mu (bağlam verildiyse)
  "teknikNot": string|null,        // kısa teknik değerlendirme/uyum notu
  "gecerlilik": string|null,       // teklif geçerlilik süresi/tarihi (ör. "15 gün", "31.12.2026")
  "ozet": string|null              // 1 cümle Türkçe özet
}
Tüm metinler Türkçe. Sadece JSON döndür.`;

export async function teklifAiAyristir(metin: string, baglam?: string): Promise<AyristirilmisTeklif> {
  const temiz = metin.trim();
  if (!temiz || temiz.length < 15) return { ...BOS, okunamadi: true };

  const anahtar = process.env.OPENAI_API_KEY;
  if (!anahtar) throw new Error("OPENAI_API_KEY yapılandırılmamış.");

  const kullaniciIcerik =
    (baglam ? `İstenen malzeme (bağlam):\n${baglam}\n\n` : "") +
    `Teklif metni:\n${temiz.slice(0, 12000)}`;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${anahtar}` },
    body: JSON.stringify({
      model: process.env.OPENAI_VISION_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: SISTEM },
        { role: "user", content: kullaniciIcerik },
      ],
      response_format: { type: "json_object" },
      max_tokens: 600,
      temperature: 0.1,
    }),
  });
  if (!r.ok) throw new Error(`AI ayrıştırma hatası (HTTP ${r.status})`);
  const d = await r.json();
  const icerik = d?.choices?.[0]?.message?.content;
  if (!icerik) return { ...BOS };
  try {
    const p = JSON.parse(icerik);
    const gecerliTur: MesajTuru[] = ["teklif", "revize", "stok_yok", "soru", "bilgi", "diger"];
    return {
      tur: gecerliTur.includes(p.tur) ? p.tur : "diger",
      fiyat: typeof p.fiyat === "number" ? p.fiyat : null,
      paraBirimi: p.paraBirimi ?? null,
      kdvDahil: typeof p.kdvDahil === "boolean" ? p.kdvDahil : null,
      kdvOran: typeof p.kdvOran === "number" ? p.kdvOran : null,
      terminGun: typeof p.terminGun === "number" ? p.terminGun : null,
      nakliye: p.nakliye ?? null,
      garantiAy: typeof p.garantiAy === "number" ? p.garantiAy : null,
      teknikUygun: typeof p.teknikUygun === "boolean" ? p.teknikUygun : null,
      teknikNot: p.teknikNot ?? null,
      gecerlilik: p.gecerlilik ?? null,
      ozet: p.ozet ?? null,
      okunamadi: false,
    };
  } catch {
    return { ...BOS };
  }
}
