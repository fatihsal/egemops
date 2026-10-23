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
  bakim: {
    dashboard: ["bakim", "dashboard"] as const,
    makineler: ["bakim", "makineler"] as const,
    makine: (id: string) => ["bakim", "makine", id] as const,
    planlar: ["bakim", "planlar"] as const,
    planSayfa: ["bakim", "plan-sayfa"] as const,
    plan: (id: string) => ["bakim", "plan", id] as const,
    makinePlanlar: (makineId: string) => ["bakim", "makine-planlar", makineId] as const,
    takvim: ["bakim", "takvim"] as const,
    isEmirleri: ["bakim", "is-emirleri"] as const,
    isEmriSayfa: ["bakim", "is-emri-sayfa"] as const,
    isEmri: (id: string) => ["bakim", "is-emri", id] as const,
    makineIsEmirleri: (makineId: string) => ["bakim", "makine-is-emirleri", makineId] as const,
    kayitlar: ["bakim", "kayitlar"] as const,
    sopListe: ["bakim", "sop"] as const,
    sopSayfa: ["bakim", "sop-sayfa"] as const,
    sop: (id: string) => ["bakim", "sop-detay", id] as const,
    bulgular: ["bakim", "bulgular"] as const,
    makineBulgular: (makineId: string) => ["bakim", "makine-bulgular", makineId] as const,
    operatorKontroller: ["bakim", "operator-kontroller"] as const,
    operatorKontrol: (id: string) => ["bakim", "operator-kontrol", id] as const,
    dokumanlar: ["bakim", "dokumanlar"] as const,
    raporlar: ["bakim", "raporlar"] as const,
  },
  satinalma: {
    talepler: ["satinalma", "talepler"] as const,
    talep: (id: string) => ["satinalma", "talep", id] as const,
    tedarikciler: ["satinalma", "tedarikciler"] as const,
    talepRfq: (talepId: string) => ["satinalma", "rfq", talepId] as const,
    talepTeklifler: (talepId: string) => ["satinalma", "teklifler", talepId] as const,
  },
} as const;
