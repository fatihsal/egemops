// Belgeler — paylaşılan renk/etiket/ikon eşlemeleri.

import type { BelgeDurum, BelgeKategoriAnahtar } from "@/lib/types";

export const KATEGORI_META: Record<
  BelgeKategoriAnahtar,
  { etiket: string; ikon: string; sinif: string; nokta: string }
> = {
  yasal: { etiket: "Yasal & Mevzuat", ikon: "solar:scale-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", nokta: "#2563eb" },
  sertifika: { etiket: "Sertifikalar", ikon: "solar:verified-check-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", nokta: "#10b981" },
  sozlesme: { etiket: "Sözleşmeler", ikon: "solar:clipboard-check-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300", nokta: "#8b5cf6" },
  rapor: { etiket: "Etüt & Raporlar", ikon: "solar:chart-square-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300", nokta: "#14b8a6" },
  teknik: { etiket: "Teknik Dökümanlar", ikon: "solar:book-2-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300", nokta: "#f59e0b" },
  fatura: { etiket: "Faturalar", ikon: "solar:bill-list-bold-duotone", sinif: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300", nokta: "#06b6d4" },
};

export const DURUM_META: Record<BelgeDurum, { etiket: string; sinif: string }> = {
  gecerli: { etiket: "Geçerli", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  yaklasiyor: { etiket: "Süresi Yaklaşıyor", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  doldu: { etiket: "Süresi Doldu", sinif: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  taslak: { etiket: "Taslak", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
};

// Dosya biçimi rozeti + ikonu.
export const FORMAT_STIL: Record<string, { sinif: string; ikon: string }> = {
  PDF: { sinif: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300", ikon: "solar:file-text-bold-duotone" },
  Excel: { sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", ikon: "solar:file-bold-duotone" },
  Word: { sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", ikon: "solar:document-bold-duotone" },
  "Görsel": { sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300", ikon: "solar:gallery-bold-duotone" },
};
