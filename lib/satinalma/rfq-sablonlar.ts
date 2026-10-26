// RFQ (teklif talebi) e-posta şablonları. Gönderen bir ton/şablon seçebilir;
// metin yine serbestçe düzenlenebilir. Değerler talep + kalemlerden gelir.

import type { Talep, TalepKalem } from "@/lib/types/satinalma";

/** Okunabilir talep referansı — Gmail thread kimliğinin yerine geçmez. */
export function talepReferans(talep: Talep): string {
  return `EGEM-RFQ-${talep.talepNo ?? talep.id.slice(0, 8)}`;
}

export function varsayilanKonu(talep: Talep): string {
  return `Teklif Talebi — ${talep.baslik} [${talepReferans(talep)}]`;
}

function kalemSatiri(k: TalepKalem): string {
  const kod = [k.marka, k.model, k.siparisKodu].filter(Boolean).join(" ");
  const parcalar = [
    `${k.sira}. ${k.ad}`,
    kod ? `(${kod})` : "",
    k.adet != null ? `${k.adet} ${k.birim ?? ""}`.trim() : "",
    k.urunDurumu === "yeni" ? "yalnızca sıfır/orijinal" : "",
    k.kapsam === "parca" ? "yalnızca parça" : k.kapsam === "komple" ? "komple montaj" : "",
    k.alternatifKabul ? "muadil kabul edilir" : "",
  ].filter(Boolean);
  return `• ${parcalar.join(" · ")}`;
}

function malzemeListesi(talep: Talep, kalemler: TalepKalem[]): string {
  if (kalemler.length > 0) return kalemler.map(kalemSatiri).join("\n");
  return [`• ${talep.baslik}`, [talep.marka, talep.model].filter(Boolean).join(" "), talep.adet != null ? `${talep.adet} ${talep.birim ?? ""}`.trim() : ""].filter(Boolean).join(" · ");
}

export interface SablonBaglam {
  talep: Talep;
  imza: string;
  kalemler: TalepKalem[];
  tedAd?: string;
}

export type SablonAnahtar = "standart" | "kisa" | "detayli" | "samimi";

export const SABLONLAR: { anahtar: SablonAnahtar; ad: string; aciklama: string }[] = [
  { anahtar: "standart", ad: "Standart (profesyonel)", aciklama: "Dengeli, nazik ve profesyonel" },
  { anahtar: "kisa", ad: "Kısa & Net", aciklama: "Kısa, doğrudan talep" },
  { anahtar: "detayli", ad: "Detaylı", aciklama: "Tüm koşullar + resmi PDF talebi" },
  { anahtar: "samimi", ad: "Samimi", aciklama: "Daha sıcak, günlük dil" },
];

function hitap(tedAd?: string): string {
  return tedAd ? `Sayın ${tedAd} Yetkilisi,` : "Sayın Yetkili,";
}

export function govdeUret(anahtar: SablonAnahtar, b: SablonBaglam): string {
  const ref = talepReferans(b.talep);
  const liste = malzemeListesi(b.talep, b.kalemler);
  const imza = b.imza;

  switch (anahtar) {
    case "kisa":
      return (
        `${hitap(b.tedAd)}\n\n` +
        `Aşağıdaki ürün(ler) için fiyat, termin ve KDV bilgisini içeren teklifinizi rica ederiz (Ref: ${ref}):\n\n` +
        `${liste}\n\n` +
        `İlginiz için teşekkür ederiz.\n\n` +
        imza
      );
    case "detayli":
      return (
        `${hitap(b.tedAd)}\n\n` +
        `Satın alma sürecimiz kapsamında aşağıdaki malzeme(ler) için resmi fiyat teklifinizi talep ediyoruz (Ref: ${ref}):\n\n` +
        `${liste}\n\n` +
        `Teklifinizde lütfen şu başlıkları belirtiniz:\n` +
        `• Kalem bazında birim ve toplam fiyat, para birimi\n` +
        `• KDV dahil/hariç ve oranı\n` +
        `• Nakliye bedeli ve kapsamı\n` +
        `• Stok durumu ve termin (teslim) süresi\n` +
        `• Ödeme koşulları (peşin/vadeli)\n` +
        `• Garanti süresi ve kapsamı\n` +
        `• Menşei ve teklifin geçerlilik süresi\n\n` +
        `Teklifi firma unvanımıza düzenlenmiş resmi PDF olarak iletmeniz bizim için uygundur.\n` +
        `Değerlendirmeniz için teşekkür eder, iyi çalışmalar dileriz.\n\n` +
        imza
      );
    case "samimi":
      return (
        `Merhaba,\n\n` +
        `Aşağıdaki ürün(ler)de bize yardımcı olabileceğinizi düşünüyoruz (Ref: ${ref}):\n\n` +
        `${liste}\n\n` +
        `Uygun fiyat, termin, KDV ve garanti bilgisiyle bir teklif paylaşabilirseniz çok memnun oluruz.\n\n` +
        `Şimdiden teşekkürler, kolay gelsin.\n\n` +
        imza
      );
    case "standart":
    default:
      return (
        `${hitap(b.tedAd)}\n\n` +
        `Aşağıdaki malzeme(ler) için firmanızdan fiyat teklifi almak istiyoruz (Ref: ${ref}):\n\n` +
        `${liste}\n\n` +
        `Teklifinizde aşağıdaki bilgilere yer vermenizi rica ederiz:\n` +
        `• Birim ve toplam fiyat, para birimi\n` +
        `• KDV durumu (dahil/hariç, oran)\n` +
        `• Tahmini termin / teslim süresi\n` +
        `• Nakliye ve garanti koşulları\n\n` +
        `Konuyla ilgilenip en kısa sürede dönüş sağlayacağınız için şimdiden teşekkür ederiz.\n\n` +
        imza
      );
  }
}
