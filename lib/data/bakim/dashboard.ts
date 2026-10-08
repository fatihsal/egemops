// -----------------------------------------------------------------------------
// BAKIM — Dashboard (mock) — ay takvimi merkezli genel bakış
// -----------------------------------------------------------------------------

import type { BakimDashboardAnaliz, FormHucre, TakvimTip } from "@/lib/types/bakim";
import { gecikmeIle } from "@/lib/data/mock-utils";

const T: FormHucre = "tamamlandi";
const E: FormHucre = "eksik";
const U: FormHucre = "uygulanmadi";

const olay = (gun: number, kod: string, tip: TakvimTip) => ({ gun, kod, tip });

export function bakimDashboardGetir(): Promise<BakimDashboardAnaliz> {
  const veri: BakimDashboardAnaliz = {
    kpiler: [
      { anahtar: "makine", baslik: "Toplam Makine", deger: "18", ikon: "solar:buildings-3-bold-duotone", renk: "blue" },
      { anahtar: "yaklasan", baslik: "Yaklaşan Periyodik Bakım", deger: "7", ikon: "solar:calendar-mark-bold-duotone", renk: "blue" },
      { anahtar: "planlama", baslik: "Planlama Bekliyor", deger: "3", ikon: "solar:clipboard-list-bold-duotone", renk: "amber" },
      { anahtar: "ertelenen", baslik: "Ertelenen Bakım", deger: "2", ikon: "solar:clock-circle-bold-duotone", renk: "red" },
      { anahtar: "tamamlanma", baslik: "Tamamlanma Oranı", deger: "%92", ikon: "solar:check-circle-bold-duotone", renk: "emerald", bilgi: true },
      { anahtar: "formUyum", baslik: "Haftalık Form Uyum Oranı", deger: "%94", ikon: "solar:document-text-bold-duotone", renk: "blue", bilgi: true },
    ],
    takvim: {
      yil: 2026,
      ay: 9, // Ekim (0-tabanlı)
      olaylar: [
        olay(1, "LM-01", "haftalikForm"),
        olay(3, "PK-02", "3aylik"),
        olay(6, "HT-05", "haftalikForm"),
        olay(8, "PK-07", "6aylik"),
        olay(10, "FM-03", "haftalikForm"),
        olay(12, "LM-04", "3aylik"),
        olay(15, "HA-02", "haftalikForm"),
        olay(17, "PK-11", "12aylik"),
        olay(20, "LM-01", "haftalikForm"),
        olay(22, "PK-08", "planlamaBekliyor"),
        olay(24, "FM-05", "3aylik"),
        olay(27, "PK-10", "haftalikForm"),
        olay(29, "YA-01", "tarihOnerildi"),
      ],
    },
    buAyPlanlanan: {
      toplam: 22,
      dilimler: [
        { etiket: "Haftalık Form", adet: 12, renk: "#3b82f6" },
        { etiket: "3 Aylık Bakım", adet: 5, renk: "#10b981" },
        { etiket: "6 Aylık Bakım", adet: 3, renk: "#f97316" },
        { etiket: "12 Aylık Bakım", adet: 2, renk: "#a855f7" },
      ],
    },
    periyodikDagilim: {
      toplam: 78,
      dilimler: [
        { etiket: "3 Aylık", adet: 34, renk: "#10b981" },
        { etiket: "6 Aylık", adet: 24, renk: "#f97316" },
        { etiket: "12 Aylık", adet: 20, renk: "#a855f7" },
      ],
    },
    buAyTamamlanan: { yuzde: 92, tamamlanan: 20, planlanan: 22 },
    planlamaDurumu: [
      { etiket: "Onaylandı", adet: 9, renk: "#10b981" },
      { etiket: "Cevap Bekliyor", adet: 3, renk: "#eab308" },
      { etiket: "Üretim Uyum Değil", adet: 2, renk: "#ef4444" },
      { etiket: "Tarih Önerildi", adet: 4, renk: "#f43f5e" },
    ],
    formTakip: {
      haftalar: ["4 Ağu", "11 Ağu", "18 Ağu", "25 Ağu", "1 Eyl", "8 Eyl", "15 Eyl", "22 Eyl"],
      satirlar: [
        { makine: "Lemanic-1", haftalar: [T, T, T, T, T, T, T, T] },
        { makine: "Lemanic-2", haftalar: [T, T, E, T, T, T, T, T] },
        { makine: "Rotomec-1", haftalar: [T, E, T, T, E, T, T, T] },
        { makine: "Rotomec-2", haftalar: [E, T, T, E, T, T, E, T] },
        { makine: "SP 104-ER", haftalar: [T, T, T, E, T, T, T, T] },
        { makine: "Foilmaster", haftalar: [T, T, E, T, T, U, T, T] },
        { makine: "Expertcut 106", haftalar: [T, E, T, T, T, T, E, T] },
        { makine: "Spanthera 106", haftalar: [T, T, T, T, E, T, T, T] },
      ],
    },
    formOran: [
      { hafta: "4 Ağu", oran: 88 },
      { hafta: "11 Ağu", oran: 92 },
      { hafta: "18 Ağu", oran: 85 },
      { hafta: "25 Ağu", oran: 96 },
      { hafta: "1 Eyl", oran: 90 },
      { hafta: "8 Eyl", oran: 94 },
      { hafta: "15 Eyl", oran: 92 },
      { hafta: "22 Eyl", oran: 94 },
    ],
    yaklasanPeriyodik: [
      { tarih: "03.10.2026", makine: "Spanthera 106-LER", bakimTuru: "3 Aylık", durum: "Cevap Bekliyor", durumTipi: "cevapBekliyor" },
      { tarih: "08.10.2026", makine: "Expertcut 106-PER", bakimTuru: "6 Aylık", durum: "Cevap Bekliyor", durumTipi: "cevapBekliyor" },
      { tarih: "12.10.2026", makine: "Foilmaster", bakimTuru: "3 Aylık", durum: "Tarih Önerildi", durumTipi: "tarihOnerildi" },
      { tarih: "20.10.2026", makine: "SP 104-ER", bakimTuru: "12 Aylık", durum: "Üretim Uyum Değil", durumTipi: "uretimUyumDegil" },
    ],
    sonTamamlanan: [
      { tarih: "28.09.2026", makine: "Lemanic-1", bakimTuru: "3 Aylık", aciklama: "Kayış kontrolü" },
      { tarih: "26.09.2026", makine: "Rotomec-2", bakimTuru: "6 Aylık", aciklama: "Yağ değişimi" },
      { tarih: "24.09.2026", makine: "SP 104-ER", bakimTuru: "3 Aylık", aciklama: "Filtre temizliği" },
      { tarih: "22.09.2026", makine: "Foilmaster", bakimTuru: "12 Aylık", aciklama: "Genel kontrol" },
      { tarih: "20.09.2026", makine: "Expertcut 106-PER", bakimTuru: "3 Aylık", aciklama: "Sensör temizliği" },
      { tarih: "18.09.2026", makine: "Lemanic-2", bakimTuru: "3 Aylık", aciklama: "Yağlama" },
      { tarih: "16.09.2026", makine: "Spanthera 106-LER", bakimTuru: "6 Aylık", aciklama: "Pnömatik kontrol" },
      { tarih: "14.09.2026", makine: "Rotomec-1", bakimTuru: "3 Aylık", aciklama: "Elektrik panosu kontrolü" },
    ],
  };
  return gecikmeIle(veri);
}
