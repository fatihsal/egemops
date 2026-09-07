// Durum kodları ile görünen etiket ve renk eşleştirmesi.
// StatusBadge bileşeni bu haritayı kullanır; yeni durum eklemek için tek yer.

import type { DurumKodu } from "@/lib/types";

export interface DurumTanimi {
  etiket: string;
  // Tailwind sınıfları — badge varyantı yerine anlamlı renkler için.
  sinif: string;
}

export const DURUM_TANIMLARI: Record<DurumKodu, DurumTanimi> = {
  calisiyor: {
    etiket: "Çalışıyor",
    sinif:
      "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  arizali: {
    etiket: "Arızalı",
    sinif:
      "border-transparent bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  },
  bekliyor: {
    etiket: "Bekliyor",
    sinif:
      "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  bakimda: {
    etiket: "Bakımda",
    sinif:
      "border-transparent bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  },
};
