// Raporlar — paylaşılan renk/etiket/ikon eşlemeleri.

import type { RaporDurum, RaporKategoriAnahtar } from "@/lib/types";

export const KATEGORI_META: Record<
  RaporKategoriAnahtar,
  { etiket: string; ikon: string; sinif: string; nokta: string }
> = {
  tuketim: { etiket: "Tüketim", ikon: "solar:document-text-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", nokta: "#2563eb" },
  performans: { etiket: "Performans", ikon: "solar:graph-up-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", nokta: "#10b981" },
  maliyet: { etiket: "Maliyet", ikon: "solar:tag-price-bold-duotone", sinif: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300", nokta: "#f97316" },
  tep: { etiket: "TEP", ikon: "solar:pie-chart-2-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300", nokta: "#8b5cf6" },
  karsilastirma: { etiket: "Karşılaştırma", ikon: "solar:scale-bold-duotone", sinif: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300", nokta: "#06b6d4" },
  ozel: { etiket: "Özel", ikon: "solar:star-bold-duotone", sinif: "bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-300", nokta: "#ec4899" },
};

export const DURUM_META: Record<RaporDurum, { etiket: string; sinif: string }> = {
  aktif: { etiket: "Aktif", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  taslak: { etiket: "Taslak", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  arsivlendi: { etiket: "Arşivlendi", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  hata: { etiket: "Hata", sinif: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
};

// Format rozeti — PDF kırmızımsı, Excel yeşilimsi.
export const FORMAT_STIL: Record<string, string> = {
  PDF: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300",
  Excel: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
};
