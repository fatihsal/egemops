// -----------------------------------------------------------------------------
// BAKIM — Dashboard (mock)
// -----------------------------------------------------------------------------

import type { BakimDashboardAnaliz, UyumHucre } from "@/lib/types/bakim";
import { gecikmeIle } from "@/lib/data/mock-utils";

const Y: UyumHucre = "yesil";
const A: UyumHucre = "amber";
const K: UyumHucre = "kirmizi";

export function bakimDashboardGetir(): Promise<BakimDashboardAnaliz> {
  const veri: BakimDashboardAnaliz = {
    kpiler: [
      { anahtar: "makine", baslik: "Toplam Makine", deger: "13", altMetin: "Önceki döneme göre", degisim: 0, ikon: "solar:settings-bold-duotone", renk: "blue" },
      { anahtar: "planli", baslik: "Planlı Bakımlar", deger: "142", altMetin: "Önceki döneme göre", degisim: 12, ikon: "solar:clipboard-list-bold-duotone", renk: "blue" },
      { anahtar: "tamamlama", baslik: "Bakım Tamamlama Oranı", deger: "%92", altMetin: "Önceki döneme göre", degisim: 4, ikon: "solar:shield-check-bold-duotone", renk: "emerald", ilerleme: 92 },
      { anahtar: "buHafta", baslik: "Bu Hafta Tamamlanan", deger: "24", altMetin: "Geçen haftaya göre", degisim: 20, ikon: "solar:chart-2-bold-duotone", renk: "blue" },
      { anahtar: "onayBekleyen", baslik: "Onay Bekleyen Kayıtlar", deger: "6", altMetin: "Geçen haftaya göre", degisim: -40, ikon: "solar:clock-circle-bold-duotone", renk: "red" },
      { anahtar: "formUyum", baslik: "Haftalık Form Uyumu", deger: "%94", altMetin: "Önceki döneme göre", degisim: 6, ikon: "solar:document-text-bold-duotone", renk: "emerald", ilerleme: 94 },
    ],
    formDagilimi: [
      { makine: "Lemanic-1", adet: 12 },
      { makine: "Lemanic-2", adet: 11 },
      { makine: "Rotomec-1", adet: 9 },
      { makine: "SP 104-ER", adet: 8 },
      { makine: "Foilmaster", adet: 7 },
      { makine: "Expertfoil", adet: 6 },
      { makine: "Rotomec-2", adet: 5 },
    ],
    planDurumu: {
      toplam: 142,
      dilimler: [
        { etiket: "Tamamlandı", adet: 131, yuzde: 92, renk: "#10b981" },
        { etiket: "Devam Ediyor", adet: 5, yuzde: 4, renk: "#3b82f6" },
        { etiket: "Gecikti", adet: 4, yuzde: 3, renk: "#f97316" },
        { etiket: "Onay Bekliyor", adet: 2, yuzde: 1, renk: "#eab308" },
      ],
    },
    tamamlamaTrend: [
      { ay: "May", oran: 84 },
      { ay: "Haz", oran: 86 },
      { ay: "Tem", oran: 88 },
      { ay: "Ağu", oran: 89 },
      { ay: "Eyl", oran: 91 },
      { ay: "Eki", oran: 92 },
    ],
    yaklasan: [
      { id: "y1", gun: "09", ayKisa: "Eki", makine: "Lemanic-1", bakim: "Haftalık Bakım", kalanGun: 1 },
      { id: "y2", gun: "10", ayKisa: "Eki", makine: "Spanthera 106-LER", bakim: "Baskı Bakımı", kalanGun: 2 },
      { id: "y3", gun: "12", ayKisa: "Eki", makine: "Lemanic-2", bakim: "Aylık Genel Bakım", kalanGun: 4 },
      { id: "y4", gun: "15", ayKisa: "Eki", makine: "Foilmaster", bakim: "Yaldız Ünitesi Bakımı", kalanGun: 7 },
      { id: "y5", gun: "16", ayKisa: "Eki", makine: "Rotomec-1", bakim: "Aylık Genel Bakım", kalanGun: 8 },
    ],
    sonKayitlar: [
      { tarih: "07.10.2026", makine: "Focusight Shark 500", bakimTuru: "Kalibrasyon", formNo: "F-2026-0014", onaylayan: "Müh. Serkan D.", durum: "Onaylandı" },
      { tarih: "06.10.2026", makine: "Lemanic-1", bakimTuru: "Haftalık Bakım", formNo: "F-2026-0013", onaylayan: "Ahmet K.", durum: "Onaylandı" },
      { tarih: "02.10.2026", makine: "SP 104-ER", bakimTuru: "Aylık Bakım", formNo: "F-2026-0012", onaylayan: "Mehmet Y.", durum: "Onaylandı" },
      { tarih: "29.09.2026", makine: "Rotomec-1", bakimTuru: "Haftalık Bakım", formNo: "F-2026-0011", onaylayan: "Ahmet K.", durum: "Onaylandı" },
      { tarih: "28.09.2026", makine: "Spanthera 106-LER", bakimTuru: "Aylık Bakım", formNo: "F-2026-0010", onaylayan: "Mehmet Y.", durum: "Onaylandı" },
    ],
    sopKullanim: { kullanildi: 136, kismen: 4, kullanilmadi: 2, yuzde: 96 },
    teknisyenYuk: [
      { ad: "Mehmet Y.", yuzde: 100 },
      { ad: "Ahmet K.", yuzde: 80 },
      { ad: "Ali K.", yuzde: 60 },
      { ad: "Hasan D.", yuzde: 40 },
    ],
    uyumHaritasi: {
      haftalar: [
        { kisa: "H1", tarih: "11-17 Ağu" },
        { kisa: "H2", tarih: "18-24 Ağu" },
        { kisa: "H3", tarih: "25-31 Ağu" },
        { kisa: "H4", tarih: "1-7 Eyl" },
        { kisa: "H5", tarih: "8-14 Eyl" },
        { kisa: "H6", tarih: "15-21 Eyl" },
        { kisa: "H7", tarih: "22-28 Eyl" },
        { kisa: "H8", tarih: "29 Eyl-5 Eki" },
      ],
      satirlar: [
        { makine: "Lemanic-1", haftalar: [Y, Y, Y, Y, Y, Y, Y, Y], genelUyum: 96 },
        { makine: "Lemanic-2", haftalar: [Y, Y, A, Y, Y, Y, Y, Y], genelUyum: 93 },
        { makine: "Rotomec-1", haftalar: [A, Y, K, Y, A, Y, Y, Y], genelUyum: 88 },
        { makine: "SP 104-ER", haftalar: [Y, A, Y, Y, A, Y, Y, Y], genelUyum: 91 },
        { makine: "Foilmaster", haftalar: [Y, Y, Y, A, Y, Y, Y, Y], genelUyum: 95 },
        { makine: "Expertfoil", haftalar: [A, A, Y, A, Y, A, Y, Y], genelUyum: 89 },
        { makine: "Rotomec-2", haftalar: [A, K, Y, A, Y, K, A, Y], genelUyum: 87 },
        { makine: "Spanthera 106-LER", haftalar: [Y, Y, Y, Y, A, Y, Y, Y], genelUyum: 94 },
      ],
    },
  };
  return gecikmeIle(veri);
}
