// TanStack Query anahtarları tek bir yerde toplanır ki tutarlı kalsın
// ve önbellek dönem bazında ayrışsın (her dönem ayrı önbellek).

import type { Donem } from "@/lib/donem";

function ek(d: Donem) {
  return [d.tur, d.baslangic, d.bitis] as const;
}

export const queryKeys = {
  enerji: {
    kpi: ["enerji", "kpi"] as const,
    turTuketim: (d: Donem) => ["enerji", "tur-tuketim", ...ek(d)] as const,
    kaynakDagilimi: (d: Donem) => ["enerji", "kaynak-dagilimi", ...ek(d)] as const,
    karbon: (d: Donem) => ["enerji", "karbon", ...ek(d)] as const,
    tuketimSerisi: (d: Donem) => ["enerji", "tuketim-serisi", ...ek(d)] as const,
    aylikMaliyet: ["enerji", "aylik-maliyet"] as const,
    yillikTep: ["enerji", "yillik-tep"] as const,
    kaynakDagilim: ["enerji", "kaynak-dagilim"] as const,
    gesPerformans: ["enerji", "ges-performans"] as const,
    sebekeGes: ["enerji", "sebeke-ges"] as const,
    yogunluk: ["enerji", "yogunluk"] as const,
    hedef: ["enerji", "hedef"] as const,
    firsat: ["enerji", "firsat"] as const,
    veriDurum: ["enerji", "veri-durum"] as const,
    guncellemeler: ["enerji", "guncellemeler"] as const,
  },
  kayitlar: {
    liste: ["kayitlar", "liste"] as const,
    ozet: ["kayitlar", "ozet"] as const,
    yillik: ["kayitlar", "yillik"] as const,
    kayit: (id: string) => ["kayitlar", "kayit", id] as const,
  },
  elektrikGes: {
    analiz: ["elektrik-ges", "analiz"] as const,
  },
  dogalgaz: {
    analiz: ["dogalgaz", "analiz"] as const,
  },
  akaryakit: {
    analiz: ["akaryakit", "analiz"] as const,
  },
  tep: {
    analiz: ["tep", "analiz"] as const,
  },
  performans: {
    analiz: ["performans", "analiz"] as const,
  },
  firsatlar: {
    analiz: ["firsatlar", "analiz"] as const,
  },
  projeler: {
    analiz: ["projeler", "analiz"] as const,
  },
  raporlar: {
    analiz: ["raporlar", "analiz"] as const,
  },
  yonetimOzeti: {
    analiz: ["yonetim-ozeti", "analiz"] as const,
  },
  belgeler: {
    analiz: ["belgeler", "analiz"] as const,
  },
  katsayilar: {
    analiz: ["katsayilar", "analiz"] as const,
  },
  kullanicilar: {
    analiz: ["kullanicilar", "analiz"] as const,
  },
} as const;
