// -----------------------------------------------------------------------------
// VERİ KATMANI — TEP Analizi (mock)
// -----------------------------------------------------------------------------
// Yalnızca frontend gösterimi için sahte veri. Backend bağlandığında SADECE bu
// dosyadaki fonksiyonların içi değişir; imzalar sabit kaldıkça ekranlar etkilenmez.

import type {
  TepAnaliz,
  TepAylik,
  TepKaynakDilim,
  TepKpi,
  TepWaterfall,
  TepYilBar,
  TepYillikMetrik,
  TepYilNokta,
  TepYogunlukNokta,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";
import { sayiOndalik } from "@/lib/format";

// Aylık TEP kırılımı (elektrik, doğalgaz, akaryakıt) + üretim (ton).
// Bileşen yıllık toplamları: elektrik 565,3 · doğalgaz 255,8 · akaryakıt 21,5 = 842,6.
interface Baz {
  ay: string;
  kisa: string;
  elektrik: number;
  dogalgaz: number;
  akaryakit: number;
  uretim: number;
}

const BAZ: Baz[] = [
  { ay: "Ocak", kisa: "Oca", elektrik: 45.0, dogalgaz: 26.0, akaryakit: 2.0, uretim: 230 },
  { ay: "Şubat", kisa: "Şub", elektrik: 43.0, dogalgaz: 24.0, akaryakit: 1.9, uretim: 227 },
  { ay: "Mart", kisa: "Mar", elektrik: 48.0, dogalgaz: 18.0, akaryakit: 1.8, uretim: 229 },
  { ay: "Nisan", kisa: "Nis", elektrik: 52.1, dogalgaz: 30.98, akaryakit: 1.3, uretim: 325 },
  { ay: "Mayıs", kisa: "May", elektrik: 55.2, dogalgaz: 35.3, akaryakit: 1.4, uretim: 330 },
  { ay: "Haziran", kisa: "Haz", elektrik: 56.8, dogalgaz: 37.1, akaryakit: 1.5, uretim: 337 },
  { ay: "Temmuz", kisa: "Tem", elektrik: 58.9, dogalgaz: 39.4, akaryakit: 1.5, uretim: 350 },
  { ay: "Ağustos", kisa: "Ağu", elektrik: 57.5, dogalgaz: 4.0, akaryakit: 1.6, uretim: 225 },
  { ay: "Eylül", kisa: "Eyl", elektrik: 46.0, dogalgaz: 5.0, akaryakit: 1.7, uretim: 200 },
  { ay: "Ekim", kisa: "Eki", elektrik: 44.0, dogalgaz: 8.0, akaryakit: 2.2, uretim: 205 },
  { ay: "Kasım", kisa: "Kas", elektrik: 33.0, dogalgaz: 14.0, akaryakit: 2.3, uretim: 180 },
  { ay: "Aralık", kisa: "Ara", elektrik: 25.8, dogalgaz: 14.02, akaryakit: 2.3, uretim: 155 },
];

const YIL = 2026;

const toplamOf = (b: Baz) => Math.round((b.elektrik + b.dogalgaz + b.akaryakit) * 100) / 100;

// 2025 aylık toplam — 2026 şeklinin yıllık orana (915,3/842,6) ölçeklenmişi + hafif sapma.
const SM_2025 = BAZ.map((b, i) => Math.round(toplamOf(b) * (915.3 / 842.6) * (1 + 0.03 * Math.sin(i * 1.1 + 0.4)) * 10) / 10);

function aylikUret(): TepAylik[] {
  return BAZ.map((b, i) => {
    const toplam = toplamOf(b);
    const yogunluk = Math.round((toplam / b.uretim) * 1000) / 1000;
    const oncekiAy = i === 0 ? null : Math.round(((toplam - toplamOf(BAZ[i - 1])) / toplamOf(BAZ[i - 1])) * 1000) / 10;
    const gecenYil = Math.round(((toplam - SM_2025[i]) / SM_2025[i]) * 1000) / 10;
    return {
      ay: b.ay,
      kisa: b.kisa,
      donem: `${b.ay} ${YIL}`,
      elektrik: b.elektrik,
      dogalgaz: b.dogalgaz,
      akaryakit: b.akaryakit,
      toplam,
      uretim: b.uretim,
      yogunluk,
      oncekiAy,
      gecenYil,
    };
  });
}

const KPILER: TepKpi[] = [
  { anahtar: "toplam", baslik: "Toplam Enerji Tüketimi", deger: sayiOndalik(842.6), birim: "TEP", degisimYuzde: -4.3 },
  { anahtar: "elektrik", baslik: "Elektrik TEP", deger: sayiOndalik(565.3), birim: "TEP", degisimYuzde: -3.8 },
  { anahtar: "dogalgaz", baslik: "Doğalgaz TEP", deger: sayiOndalik(255.8), birim: "TEP", degisimYuzde: -5.1 },
  { anahtar: "akaryakit", baslik: "Akaryakıt TEP", deger: sayiOndalik(21.5), birim: "TEP", degisimYuzde: 8.7 },
  { anahtar: "yogunluk", baslik: "Enerji Yoğunluğu", deger: "0,285", birim: "TEP / ton", degisimYuzde: -2.6 },
  { anahtar: "degisim", baslik: "Geçen Yıla Göre Değişim", degisimYuzde: -4.3, sadeDegisim: true },
];

const YILLIK: TepYilBar[] = [
  { yil: 2023, tep: 880.4, yoy: null },
  { yil: 2024, tep: 842.1, yoy: -4.3 },
  { yil: 2025, tep: 915.3, yoy: 8.7 },
  { yil: 2026, tep: 842.6, yoy: -7.9 },
];

const KAYNAKLAR: TepKaynakDilim[] = [
  { anahtar: "elektrik", etiket: "Elektrik TEP", tep: 565.3, yuzde: 67.1 },
  { anahtar: "dogalgaz", etiket: "Doğalgaz TEP", tep: 255.8, yuzde: 30.4 },
  { anahtar: "akaryakit", etiket: "Akaryakıt TEP", tep: 21.5, yuzde: 2.5 },
];

const WATERFALL: TepWaterfall[] = [
  { etiket: "2025", tur: "baz", deger: 592.4 },
  { etiket: "Elektrik", tur: "azalis", deger: -22.0 },
  { etiket: "Doğalgaz", tur: "azalis", deger: -7.0 },
  { etiket: "Akaryakıt", tur: "artis", deger: 3.0 },
  { etiket: "2026", tur: "sonuc", deger: 566.4 },
];

// Yoğunluk mini grafiği — gerçekleşen aylar (Ocak–Temmuz).
function yogunlukUret(aylik: TepAylik[]): TepYogunlukNokta[] {
  return aylik.slice(0, 7).map((a) => ({ kisa: a.kisa, deger: a.yogunluk }));
}

// Yıllara göre aylık toplam TEP — 2026 gerçek, diğer yıllar yıllık orana
// ölçeklenip hafif mevsimsel sapmayla türetilir.
const YIL_TOPLAM: Record<number, number> = { 2023: 880.4, 2024: 842.1, 2025: 915.3, 2026: 842.6 };
function aylikKarsilastirmaUret(aylik: TepAylik[]): TepYilNokta[] {
  const seri = (yil: number, faz: number) =>
    aylik.map((a, i) => Math.round(a.toplam * (YIL_TOPLAM[yil] / YIL_TOPLAM[2026]) * (1 + 0.045 * Math.sin(i * 0.9 + faz)) * 10) / 10);
  const y23 = seri(2023, 1.8), y24 = seri(2024, 1.1), y25 = seri(2025, 0.5);
  return aylik.map((a, i) => ({ kisa: a.kisa, y2023: y23[i], y2024: y24[i], y2025: y25[i], y2026: a.toplam }));
}

// Yıllık özet — kaynak bazında yıllık toplamlar + 2025→2026 değişimi.
const YILLIK_OZET: TepYillikMetrik[] = [
  { metrik: "Toplam TEP", birim: "TEP", y2023: 880.4, y2024: 842.1, y2025: 915.3, y2026: 842.6, yoy: -7.9 },
  { metrik: "Elektrik TEP", birim: "TEP", y2023: 585.0, y2024: 560.0, y2025: 605.0, y2026: 565.3, yoy: -6.6 },
  { metrik: "Doğalgaz TEP", birim: "TEP", y2023: 273.0, y2024: 261.0, y2025: 288.0, y2026: 255.8, yoy: -11.2 },
  { metrik: "Akaryakıt TEP", birim: "TEP", y2023: 22.4, y2024: 21.1, y2025: 22.3, y2026: 21.5, yoy: -3.6 },
  { metrik: "Enerji Yoğunluğu", birim: "TEP/ton", y2023: 0.298, y2024: 0.304, y2025: 0.301, y2026: 0.285, yoy: -5.3 },
];

/** Ekranın tüm mock verisini tek çağrıda döndürür. */
export function tepAnaliziGetir(): Promise<TepAnaliz> {
  const aylik = aylikUret();
  return gecikmeIle({
    aylikKarsilastirma: aylikKarsilastirmaUret(aylik),
    yillikOzet: YILLIK_OZET,
    kpiler: KPILER,
    aylik,
    yillik: YILLIK,
    kaynaklar: KAYNAKLAR,
    toplamTep: 842.6,
    ytd: { yil2025: sayiOndalik(592.4), yil2026: sayiOndalik(566.4), fark: `-${sayiOndalik(26)}`, degisim: -4.4 },
    waterfall: WATERFALL,
    yogunlukSeri: yogunlukUret(aylik),
    bazYil: { bazYil: 2024, bazDeger: "0,304", guncelDeger: "0,285", iyilesme: -6.3 },
    enYuksek: { donem: "Temmuz 2026", deger: sayiOndalik(102.4), trend: [84.4, 91.9, 95.4, 88.0, 96.0, 99.0, 102.4] },
    enDusuk: { donem: "Nisan 2026", deger: sayiOndalik(61.8), trend: [73.0, 68.9, 67.8, 61.8, 64.0, 63.1, 65.0] },
  });
}

// TEP → kWh eşdeğeri (grafik birim değiştiricisi için, 1 TEP ≈ 11.630 kWh).
export const TEP_KWH = 11630;
