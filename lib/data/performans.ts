// -----------------------------------------------------------------------------
// VERİ KATMANI — Enerji Performansı (mock)
// -----------------------------------------------------------------------------
// Yalnızca frontend gösterimi için sahte veri. Backend bağlandığında SADECE bu
// dosyadaki fonksiyonların içi değişir; imzalar sabit kaldıkça ekranlar etkilenmez.

import type {
  KaynakPerformans,
  PerformansAnaliz,
  PerformansAylik,
  PerformansHedef,
  PerformansKpi,
  PerformansProje,
  PerformansWaterfall,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";

// Aylık EnPI (TEP/ton), üretim (ton) ve toplam enerji (TEP).
interface Baz {
  ay: string;
  kisa: string;
  uretim: number;
  toplamTep: number;
  bazEnPI: number;
  hedefEnPI: number;
  gercekEnPI: number;
}

const BAZ: Baz[] = [
  { ay: "Ocak", kisa: "Oca", uretim: 2650, toplamTep: 558, bazEnPI: 0.32, hedefEnPI: 0.288, gercekEnPI: 0.31 },
  { ay: "Şubat", kisa: "Şub", uretim: 2780, toplamTep: 565, bazEnPI: 0.318, hedefEnPI: 0.286, gercekEnPI: 0.304 },
  { ay: "Mart", kisa: "Mar", uretim: 2910, toplamTep: 572, bazEnPI: 0.316, hedefEnPI: 0.284, gercekEnPI: 0.292 },
  { ay: "Nisan", kisa: "Nis", uretim: 3040, toplamTep: 580, bazEnPI: 0.312, hedefEnPI: 0.281, gercekEnPI: 0.283 },
  { ay: "Mayıs", kisa: "May", uretim: 3120, toplamTep: 585, bazEnPI: 0.308, hedefEnPI: 0.277, gercekEnPI: 0.276 },
  { ay: "Haziran", kisa: "Haz", uretim: 3180, toplamTep: 588, bazEnPI: 0.306, hedefEnPI: 0.275, gercekEnPI: 0.272 },
  { ay: "Temmuz", kisa: "Tem", uretim: 3220, toplamTep: 592, bazEnPI: 0.304, hedefEnPI: 0.273, gercekEnPI: 0.268 },
  { ay: "Ağustos", kisa: "Ağu", uretim: 3180, toplamTep: 585, bazEnPI: 0.302, hedefEnPI: 0.272, gercekEnPI: 0.266 },
  { ay: "Eylül", kisa: "Eyl", uretim: 3050, toplamTep: 570, bazEnPI: 0.3, hedefEnPI: 0.27, gercekEnPI: 0.264 },
  { ay: "Ekim", kisa: "Eki", uretim: 2980, toplamTep: 560, bazEnPI: 0.298, hedefEnPI: 0.268, gercekEnPI: 0.262 },
  { ay: "Kasım", kisa: "Kas", uretim: 2850, toplamTep: 545, bazEnPI: 0.297, hedefEnPI: 0.267, gercekEnPI: 0.261 },
  { ay: "Aralık", kisa: "Ara", uretim: 2900, toplamTep: 550, bazEnPI: 0.296, hedefEnPI: 0.266, gercekEnPI: 0.26 },
];

function aylikUret(): PerformansAylik[] {
  return BAZ.map((b) => {
    const sapma = Math.round((b.gercekEnPI - b.hedefEnPI) * 1000) / 1000;
    const performans = sapma > 0.01 ? "takip" : sapma >= 0 ? "hedefte" : "iyi";
    return {
      ay: b.ay,
      kisa: b.kisa,
      donem: `${b.ay} 2026`,
      uretim: b.uretim,
      toplamTep: b.toplamTep,
      bazEnPI: b.bazEnPI,
      hedefEnPI: b.hedefEnPI,
      gercekEnPI: b.gercekEnPI,
      sapma,
      performans,
    };
  });
}

const KPILER: PerformansKpi[] = [
  { anahtar: "mevcut", baslik: "Mevcut Enerji Yoğunluğu", deger: "0,285", birim: "TEP/ton", degisimYuzde: -6.3, altMetin: "baz yıla göre" },
  { anahtar: "bazYil", baslik: "Baz Yıl Performansı", deger: "0,304", birim: "TEP/ton", altMetin: "Baz Yıl: 2024" },
  { anahtar: "hedef", baslik: "Enerji Hedefi", deger: "0,274", birim: "TEP/ton", altMetin: "2026 hedefi: -%10" },
  { anahtar: "kalan", baslik: "Hedefe Kalan", deger: "0,011", birim: "TEP/ton", altMetin: "%4,0 kaldı", amber: true },
  { anahtar: "iyilesme", baslik: "Gerçekleşen İyileşme", deger: "%6,3", progress: 63 },
  { anahtar: "tasarruf", baslik: "Tasarruf / Kazanç", deger: "38,4", birim: "TEP", altMetin: "Baz performansa göre" },
];

const KAYNAKLAR: KaynakPerformans[] = [
  { anahtar: "elektrik", etiket: "Elektrik Performansı", deger: "218", birim: "kWh/ton", bazDeger: "231 kWh/ton", iyilesme: -5.6 },
  { anahtar: "dogalgaz", etiket: "Doğalgaz Performansı", deger: "18,4", birim: "Sm³/ton", bazDeger: "20,1 Sm³/ton", iyilesme: -8.5 },
];

const PROJELER: PerformansProje[] = [
  { baslik: "Kompresör Optimizer", durum: "Devam Ediyor" },
  { baslik: "Reküperatör", durum: "Fizibilite" },
  { baslik: "EAE LED Dönüşümü", durum: "Teklif" },
];

const WATERFALL: PerformansWaterfall[] = [
  { etiket: "Beklenen", tur: "baz", deger: 610 },
  { etiket: "Elektrik", tur: "azalis", deger: -18 },
  { etiket: "Doğalgaz", tur: "azalis", deger: -11 },
  { etiket: "Akaryakıt", tur: "artis", deger: 3 },
  { etiket: "Gerçekleşen", tur: "sonuc", deger: 584 },
];

const HEDEFLER: PerformansHedef[] = [
  { gosterge: "Toplam TEP/ton", baz: "0,304", hedef: "0,274", gercek: "0,285", durum: "takip" },
  { gosterge: "Elektrik kWh/ton", baz: "231", hedef: "219", gercek: "218", durum: "hedefte" },
  { gosterge: "Doğalgaz Sm³/ton", baz: "20,1", hedef: "18,7", gercek: "18,4", durum: "hedefte" },
];

/** Ekranın tüm mock verisini tek çağrıda döndürür. */
export function performansAnaliziGetir(): Promise<PerformansAnaliz> {
  return gecikmeIle({
    kpiler: KPILER,
    aylik: aylikUret(),
    radial: { oran: 63, hedefIyilesme: 10, gerceklesen: 6.3, hedefeKalan: "0,011" },
    beklenen: {
      beklenen: 610,
      gerceklesen: 584,
      kazanc: 26,
      beklenenTrend: [88, 86, 90, 87, 91, 89, 92],
      gerceklesenTrend: [84, 83, 85, 82, 86, 84, 87],
      kazancTrend: [4, 3, 5, 5, 5, 5, 5],
    },
    kaynaklar: KAYNAKLAR,
    projeler: PROJELER,
    bazYil: { bazYil: 2024, bazEnPI: "0,304", guncelEnPI: "0,285", iyilesme: -6.3 },
    waterfall: WATERFALL,
    hedefler: HEDEFLER,
  });
}
