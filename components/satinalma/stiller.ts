// Satın Alma — paylaşılan durum etiket/renk eşlemeleri.

import type { AiDurum, RfqDurum, TalepDurum, TeklifKaynak } from "@/lib/types/satinalma";

export const TALEP_DURUM_META: Record<TalepDurum, { etiket: string; sinif: string; nokta: string }> = {
  taslak: { etiket: "Taslak", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", nokta: "bg-slate-400" },
  kaynak_arama: { etiket: "Kaynak Araştırma", sinif: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300", nokta: "bg-violet-500" },
  rfq_gonderildi: { etiket: "Teklif Talebi Gönderildi", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", nokta: "bg-blue-500" },
  teklif_toplama: { etiket: "Teklif Toplama", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", nokta: "bg-amber-500" },
  karsilastirma: { etiket: "Karşılaştırma", sinif: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300", nokta: "bg-cyan-500" },
  tamamlandi: { etiket: "Tamamlandı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", nokta: "bg-emerald-500" },
  iptal: { etiket: "İptal", sinif: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", nokta: "bg-red-500" },
};

export const AI_DURUM_META: Record<AiDurum, { etiket: string; sinif: string }> = {
  beklemede: { etiket: "Doğrulama Bekliyor", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  dogrulandi: { etiket: "Doğrulandı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
};

export const RFQ_DURUM_META: Record<RfqDurum, { etiket: string; sinif: string }> = {
  taslak: { etiket: "Taslak", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  onay_bekliyor: { etiket: "Onay Bekliyor", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  gonderildi: { etiket: "Gönderildi", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  yanitlandi: { etiket: "Yanıtlandı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  iptal: { etiket: "İptal", sinif: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
};

export const TEKLIF_KAYNAK_META: Record<TeklifKaynak, { etiket: string; ikon: string }> = {
  gmail: { etiket: "Gmail", ikon: "logos:google-gmail" },
  manuel: { etiket: "Manuel", ikon: "solar:upload-minimalistic-bold" },
};

export const KATEGORILER: { anahtar: string; ad: string; sinif: string }[] = [
  { anahtar: "mekanik", ad: "Mekanik", sinif: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  { anahtar: "elektrik", ad: "Elektrik", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  { anahtar: "elektronik", ad: "Elektronik", sinif: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" },
  { anahtar: "otomasyon", ad: "Otomasyon", sinif: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300" },
  { anahtar: "hidrolik", ad: "Hidrolik", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  { anahtar: "pnomatik", ad: "Pnömatik", sinif: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  { anahtar: "rulman", ad: "Rulman & Aktarma", sinif: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  { anahtar: "kesici_takim", ad: "Kesici Takım", sinif: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
  { anahtar: "kaynak", ad: "Kaynak & Sarf", sinif: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  { anahtar: "hirdavat", ad: "Hırdavat", sinif: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300" },
  { anahtar: "genel", ad: "Genel", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
];

export const KATEGORI_META: Record<string, { ad: string; sinif: string }> = Object.fromEntries(
  KATEGORILER.map((k) => [k.anahtar, { ad: k.ad, sinif: k.sinif }]),
);

export function kategoriAd(anahtar: string): string {
  return KATEGORI_META[anahtar]?.ad ?? anahtar;
}

/** "15.03.2026" biçimi. */
export function tarihKisa(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}
