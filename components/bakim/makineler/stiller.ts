// Makine ekranları için ortak etiket/renk yardımcıları.

import type { Kritiklik, BakimPeriyot, IsEmriDurum, MaddeDurum, MaddeTuru, OperatorDurum, OperatorKontrolDurum } from "@/lib/types/bakim";

export const KRITIKLIK_META: Record<Kritiklik, { etiket: string; sinif: string; nokta: string }> = {
  dusuk: {
    etiket: "Düşük",
    sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    nokta: "bg-slate-400",
  },
  orta: {
    etiket: "Orta",
    sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    nokta: "bg-amber-500",
  },
  yuksek: {
    etiket: "Yüksek",
    sinif: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
    nokta: "bg-orange-500",
  },
  kritik: {
    etiket: "Kritik",
    sinif: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    nokta: "bg-red-500",
  },
};

export const PERIYOT_ETIKET: Record<BakimPeriyot, string> = {
  haftalik: "Haftalık",
  aylik: "Aylık",
  "3aylik": "3 Aylık",
  "6aylik": "6 Aylık",
  yillik: "Yıllık",
  ozel: "Özel",
};

export const PERIYOT_META: Record<BakimPeriyot, { sinif: string; nokta: string }> = {
  haftalik: { sinif: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300", nokta: "bg-teal-500" },
  aylik: { sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", nokta: "bg-blue-500" },
  "3aylik": { sinif: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300", nokta: "bg-indigo-500" },
  "6aylik": { sinif: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300", nokta: "bg-violet-500" },
  yillik: { sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", nokta: "bg-amber-500" },
  ozel: { sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", nokta: "bg-slate-500" },
};

/** Uyum oranına göre renk sınıfı (metin + bar). */
export function uyumRenk(oran: number): { metin: string; bar: string } {
  if (oran >= 90) return { metin: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" };
  if (oran >= 80) return { metin: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" };
  return { metin: "text-red-600 dark:text-red-400", bar: "bg-red-500" };
}

export const IS_EMRI_DURUM_META: Record<IsEmriDurum, { etiket: string; sinif: string; nokta: string }> = {
  planlandi: { etiket: "Planlandı", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", nokta: "bg-blue-500" },
  devam: { etiket: "Devam Ediyor", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", nokta: "bg-amber-500" },
  tamamlandi: { etiket: "Tamamlandı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", nokta: "bg-emerald-500" },
  muhendisKontrol: { etiket: "Mühendis Kontrolünde", sinif: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300", nokta: "bg-violet-500" },
  onaylandi: { etiket: "Onaylandı", sinif: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300", nokta: "bg-teal-500" },
};

export const MADDE_DURUM_META: Record<MaddeDurum, { etiket: string; sinif: string; renk: string; ikon: string }> = {
  bekliyor: { etiket: "Bekliyor", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", renk: "text-slate-400", ikon: "solar:clock-circle-linear" },
  tamamlandi: { etiket: "Tamamlandı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", renk: "text-emerald-500", ikon: "solar:check-circle-bold" },
  bulguVar: { etiket: "Bulgu Var", sinif: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", renk: "text-red-500", ikon: "solar:danger-triangle-bold" },
  uygulanmadi: { etiket: "Uygulanmadı", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", renk: "text-amber-500", ikon: "solar:close-circle-bold" },
  uygulanamaz: { etiket: "Uygulanamaz", sinif: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400", renk: "text-slate-400", ikon: "solar:forbidden-circle-bold" },
};

export const MADDE_TURU_ETIKET: Record<MaddeTuru, string> = {
  temizlik: "Temizlik",
  gorsel: "Görsel Kontrol",
  ayar: "Ayar",
  seviye: "Ölçüm / Seviye",
  islem: "İşlem",
};

export const OPERATOR_DURUM_META: Record<OperatorDurum, { etiket: string; sinif: string; renk: string; ikon: string }> = {
  bekliyor: { etiket: "Bekliyor", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", renk: "text-slate-400", ikon: "solar:clock-circle-linear" },
  uygun: { etiket: "Uygun", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", renk: "text-emerald-500", ikon: "solar:check-circle-bold" },
  uygunsuzluk: { etiket: "Uygunsuzluk", sinif: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", renk: "text-red-500", ikon: "solar:danger-triangle-bold" },
};

export const OPERATOR_KONTROL_DURUM_META: Record<OperatorKontrolDurum, { etiket: string; sinif: string; nokta: string }> = {
  planlandi: { etiket: "Planlandı", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", nokta: "bg-blue-500" },
  devam: { etiket: "Devam Ediyor", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", nokta: "bg-amber-500" },
  tamamlandi: { etiket: "Tamamlandı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", nokta: "bg-emerald-500" },
};
