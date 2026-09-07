// Enerji Projeleri — paylaşılan renk/etiket eşlemeleri (döngüsel importu önlemek
// için tek yerde toplandı).

import type { ProjeDurum, ProjeKaynak, ProjeRag } from "@/lib/types";

export const KAYNAK_RENK: Record<ProjeKaynak, string> = {
  elektrik: "#2563eb",
  dogalgaz: "#8b5cf6",
  akaryakit: "#f59e0b",
};

export const KAYNAK_ETIKET: Record<ProjeKaynak, string> = {
  elektrik: "Elektrik",
  dogalgaz: "Doğalgaz",
  akaryakit: "Akaryakıt",
};

export const KAYNAK_STIL: Record<ProjeKaynak, { ikon: string; sinif: string }> = {
  elektrik: { ikon: "solar:bolt-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  dogalgaz: { ikon: "solar:fire-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" },
  akaryakit: { ikon: "solar:gas-station-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" },
};

export const DURUM_META: Record<ProjeDurum, { etiket: string; sinif: string }> = {
  planlama: { etiket: "Planlama", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  muhendislik: { etiket: "Mühendislik", sinif: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
  satinAlma: { etiket: "Satın Alma / Hazırlık", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  uygulama: { etiket: "Uygulama", sinif: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300" },
  devreyeAlma: { etiket: "Devreye Alma", sinif: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" },
  tamamlandi: { etiket: "Tamamlandı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
};

// RAG (kırmızı/amber/yeşil) — proje sağlığı noktaları.
export const RAG_META: Record<ProjeRag, { etiket: string; nokta: string; metin: string }> = {
  yesil: { etiket: "İyi", nokta: "bg-emerald-500", metin: "text-emerald-600" },
  amber: { etiket: "Dikkat", nokta: "bg-amber-500", metin: "text-amber-600" },
  kirmizi: { etiket: "Risk", nokta: "bg-red-500", metin: "text-red-600" },
  yok: { etiket: "Henüz yok", nokta: "bg-muted-foreground/30", metin: "text-muted-foreground" },
};
