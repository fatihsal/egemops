// Makine ekranları için ortak etiket/renk yardımcıları.

import type { Kritiklik, BakimPeriyot } from "@/lib/types/bakim";

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

/** Uyum oranına göre renk sınıfı (metin + bar). */
export function uyumRenk(oran: number): { metin: string; bar: string } {
  if (oran >= 90) return { metin: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" };
  if (oran >= 80) return { metin: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" };
  return { metin: "text-red-600 dark:text-red-400", bar: "bg-red-500" };
}
