// Enerji Fırsatları — paylaşılan renk/etiket eşlemeleri (döngüsel importu önlemek
// için tek yerde toplandı).

import type { FirsatDurum, FirsatKaynak, FirsatOncelik } from "@/lib/types";

export const KAYNAK_RENK: Record<FirsatKaynak, string> = {
  elektrik: "#2563eb",
  dogalgaz: "#8b5cf6",
  akaryakit: "#f59e0b",
};

export const KAYNAK_ETIKET: Record<FirsatKaynak, string> = {
  elektrik: "Elektrik",
  dogalgaz: "Doğalgaz",
  akaryakit: "Akaryakıt",
};

export const ONCELIK: Record<FirsatOncelik, { etiket: string; sinif: string }> = {
  yuksek: { etiket: "Yüksek", sinif: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300" },
  orta: { etiket: "Orta", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  dusuk: { etiket: "Düşük", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
};

export const DURUM_META: Record<FirsatDurum, { etiket: string; sinif: string }> = {
  fizibilite: { etiket: "Fizibilite", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  teklif: { etiket: "Teklif / Planlama", sinif: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
  onaylandi: { etiket: "Onaylandı", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  uygulama: { etiket: "Uygulama", sinif: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300" },
  tamamlandi: { etiket: "Tamamlandı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
};
