// -----------------------------------------------------------------------------
// BAKIM — Dashboard (mock)
// -----------------------------------------------------------------------------

import type { BakimDashboardAnaliz, BakimDurum } from "@/lib/types/bakim";
import { gecikmeIle } from "@/lib/data/mock-utils";

const D = (s: BakimDurum) => s;

const PLAN: { makine: string; g: BakimDurum[] }[] = [
  { makine: "Lemanic-1", g: ["tamamlandi", "tamamlandi", "tamamlandi", "planYok", "planlandi", "planYok", "planYok"] },
  { makine: "Lemanic-2", g: ["planYok", "devam", "tamamlandi", "planYok", "planlandi", "gecikti", "planYok"] },
  { makine: "SP 104-ER", g: ["planlandi", "planYok", "tamamlandi", "planYok", "planYok", "planYok", "planYok"] },
  { makine: "Foilmaster", g: ["planYok", "tamamlandi", "planYok", "planYok", "gecikti", "planYok", "planYok"] },
  { makine: "Rotomec-1", g: ["planYok", "tamamlandi", "planYok", "gecikti", "planYok", "planYok", "planYok"] },
  { makine: "Rotomec-2", g: ["planYok", "devam", "planlandi", "planYok", "planYok", "planYok", "planYok"] },
  { makine: "Expertcut 106", g: ["tamamlandi", "planYok", "planlandi", "planYok", "planYok", "planYok", "planYok"] },
  { makine: "Spanthera 106", g: ["planYok", "planlandi", "planYok", "tamamlandi", "planYok", "planYok", "planYok"] },
  { makine: "KBA Exit Elevator", g: ["planYok", "planYok", "planlandi", "planYok", "planYok", "planYok", "planYok"] },
];

const TIP_RENK: Record<string, string> = {
  Haftalık: "#3b82f6",
  Aylık: "#14b8a6",
  "3 Aylık": "#f59e0b",
  "6 Aylık": "#8b5cf6",
  Yıllık: "#ef4444",
};

export function bakimDashboardGetir(): Promise<BakimDashboardAnaliz> {
  const gunEtiketleri = [
    { kisa: "Pzt", tarih: "6" },
    { kisa: "Sal", tarih: "7" },
    { kisa: "Çar", tarih: "8" },
    { kisa: "Per", tarih: "9" },
    { kisa: "Cum", tarih: "10" },
    { kisa: "Cmt", tarih: "11" },
    { kisa: "Paz", tarih: "12" },
  ];

  const veri: BakimDashboardAnaliz = {
    kpiler: [
      { anahtar: "planlanan", baslik: "Bu Hafta Planlanan", deger: "26", altMetin: "6 gün bazında", degisim: 12, ikon: "solar:calendar-add-bold-duotone", renk: "blue" },
      { anahtar: "tamamlanan", baslik: "Tamamlanan", deger: "21", altMetin: "Bu hafta", degisim: 81, ikon: "solar:check-circle-bold-duotone", renk: "emerald" },
      { anahtar: "acik", baslik: "Açık İş Emri", deger: "8", altMetin: "Devam eden", ikon: "solar:clipboard-list-bold-duotone", renk: "amber" },
      { anahtar: "geciken", baslik: "Geciken Bakım", deger: "5", altMetin: "Takip gerekiyor", degisim: -7, ikon: "solar:danger-triangle-bold-duotone", renk: "red" },
      { anahtar: "uyum", baslik: "Bakım Uyum Oranı", deger: "%91", altMetin: "Hedef: %90", ikon: "solar:check-read-bold-duotone", renk: "teal", ilerleme: 91 },
      { anahtar: "yaklasan", baslik: "7 Gün İçinde Yaklaşan", deger: "12", altMetin: "Planlı bakım", degisim: 48, ikon: "solar:calendar-bold-duotone", renk: "slate" },
    ],
    gunEtiketleri,
    haftalikPlan: PLAN.map((p, i) => ({ makineId: `mk-${i}`, makine: p.makine, gunler: p.g.map(D) })),
    yaklasan: [
      { id: "y1", tarih: "12 Ekim 2026", makine: "Foilmaster", bakim: "6 Aylık Yağlama ve Filtre Kontrolü", periyot: "6 Aylık", durum: "yaklasiyor" },
      { id: "y2", tarih: "15 Ekim 2026", makine: "Rotomec-2", bakim: "Pompa Kontrolü", periyot: "3 Aylık", durum: "planlandi" },
      { id: "y3", tarih: "18 Ekim 2026", makine: "Lemanic-1", bakim: "Haftalık Genel Kontrol", periyot: "Haftalık", durum: "planlandi" },
      { id: "y4", tarih: "22 Ekim 2026", makine: "SP 104-ER", bakim: "Elektrik Pano Kontrolü", periyot: "6 Aylık", durum: "planlandi" },
      { id: "y5", tarih: "25 Ekim 2026", makine: "Expertcut 106", bakim: "Zincir Yağlama", periyot: "3 Aylık", durum: "planlandi" },
    ],
    geciken: [
      { id: "g1", gun: 3, makine: "Lemanic-2", bakim: "Haftalık Genel Kontrol", planlanan: "06.10.2026" },
      { id: "g2", gun: 5, makine: "Rotomec-1", bakim: "6 Aylık Bakım", planlanan: "01.10.2026" },
      { id: "g3", gun: 7, makine: "Foilmaster", bakim: "Filtre Değişimi", planlanan: "29.09.2026" },
    ],
    uyumTrend: [
      { ay: "Oca", oran: 82 }, { ay: "Şub", oran: 85 }, { ay: "Mar", oran: 84 },
      { ay: "Nis", oran: 87 }, { ay: "May", oran: 89 }, { ay: "Haz", oran: 88 },
      { ay: "Tem", oran: 90 }, { ay: "Ağu", oran: 92 }, { ay: "Eyl", oran: 91 },
      { ay: "Eki", oran: 93 }, { ay: "Kas", oran: 90 }, { ay: "Ara", oran: 94 },
    ],
    tipDagilimi: [
      { tip: "Haftalık", adet: 38, renk: TIP_RENK["Haftalık"] },
      { tip: "Aylık", adet: 15, renk: TIP_RENK["Aylık"] },
      { tip: "3 Aylık", adet: 8, renk: TIP_RENK["3 Aylık"] },
      { tip: "6 Aylık", adet: 7, renk: TIP_RENK["6 Aylık"] },
      { tip: "Yıllık", adet: 5, renk: TIP_RENK["Yıllık"] },
    ],
    makineYuk: [
      { makine: "Lemanic-1", adet: 24 },
      { makine: "Lemanic-2", adet: 18 },
      { makine: "Foilmaster", adet: 15 },
      { makine: "Rotomec-1", adet: 12 },
      { makine: "SP 104-ER", adet: 10 },
    ],
  };
  return gecikmeIle(veri);
}
