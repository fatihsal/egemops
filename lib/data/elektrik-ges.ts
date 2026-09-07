// -----------------------------------------------------------------------------
// VERİ KATMANI — Elektrik & GES Analizi (mock)
// -----------------------------------------------------------------------------
// Yalnızca frontend gösterimi için sahte veri. Backend bağlandığında SADECE bu
// dosyadaki fonksiyonların içi değişir; imzalar sabit kaldıkça ekranlar etkilenmez.

import type {
  AylikKarsilastirma,
  ElektrikAylik,
  ElektrikGesAnaliz,
  ElektrikKaynakDilim,
  ElektrikKpi,
  ElektrikOzet,
  YilKarti,
  YillikMetrik,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";

// Aylık ham değerler (kWh). Şebeke + GES öz = fabrika toplam; GES üretim − GES öz
// = şebekeye verilen. Nisan–Temmuz değerleri detay tablosuyla birebir tutarlı.
interface AyBaz {
  ay: string;
  kisa: string;
  sebeke: number;
  gesUretim: number;
  gesOz: number;
  gesKarsilama: number;
  elektrikTep: number;
  elektrikYogunluk: number;
}

const BAZ: AyBaz[] = [
  { ay: "Ocak", kisa: "Oca", sebeke: 690100.0, gesUretim: 218000, gesOz: 175000, gesKarsilama: 25.8, elektrikTep: 74.1, elektrikYogunluk: 20.4 },
  { ay: "Şubat", kisa: "Şub", sebeke: 668300.0, gesUretim: 210000, gesOz: 172000, gesKarsilama: 25.5, elektrikTep: 72.0, elektrikYogunluk: 20.0 },
  { ay: "Mart", kisa: "Mar", sebeke: 678200.0, gesUretim: 214000, gesOz: 175000, gesKarsilama: 25.7, elektrikTep: 73.1, elektrikYogunluk: 20.1 },
  { ay: "Nisan", kisa: "Nis", sebeke: 654320.6, gesUretim: 210100, gesOz: 172300, gesKarsilama: 26.0, elektrikTep: 71.19, elektrikYogunluk: 19.8 },
  { ay: "Mayıs", kisa: "May", sebeke: 785210.45, gesUretim: 272400, gesOz: 214700, gesKarsilama: 27.0, elektrikTep: 86.17, elektrikYogunluk: 22.1 },
  { ay: "Haziran", kisa: "Haz", sebeke: 812450.1, gesUretim: 298300, gesOz: 232100, gesKarsilama: 28.0, elektrikTep: 89.9, elektrikYogunluk: 23.7 },
  { ay: "Temmuz", kisa: "Tem", sebeke: 846250.3, gesUretim: 315600, gesOz: 240800, gesKarsilama: 28.7, elektrikTep: 93.58, elektrikYogunluk: 24.9 },
  { ay: "Ağustos", kisa: "Ağu", sebeke: 838000.0, gesUretim: 305000, gesOz: 236000, gesKarsilama: 28.4, elektrikTep: 92.1, elektrikYogunluk: 24.5 },
  { ay: "Eylül", kisa: "Eyl", sebeke: 712000.0, gesUretim: 268000, gesOz: 210000, gesKarsilama: 27.2, elektrikTep: 80.4, elektrikYogunluk: 22.0 },
  { ay: "Ekim", kisa: "Eki", sebeke: 726000.0, gesUretim: 245000, gesOz: 196000, gesKarsilama: 26.6, elektrikTep: 79.1, elektrikYogunluk: 21.4 },
  { ay: "Kasım", kisa: "Kas", sebeke: 640000.0, gesUretim: 205000, gesOz: 162000, gesKarsilama: 25.4, elektrikTep: 70.2, elektrikYogunluk: 19.6 },
  { ay: "Aralık", kisa: "Ara", sebeke: 662000.0, gesUretim: 198000, gesOz: 158000, gesKarsilama: 25.1, elektrikTep: 71.0, elektrikYogunluk: 19.9 },
];

const YIL = 2026;

function aylikUret(): ElektrikAylik[] {
  return BAZ.map((b) => {
    const sebekeyeVerilen = Math.round((b.gesUretim - b.gesOz) * 100) / 100;
    const fabrikaToplam = Math.round((b.sebeke + b.gesOz) * 100) / 100;
    return {
      ay: b.ay,
      kisa: b.kisa,
      donem: `${b.ay} ${YIL}`,
      sebeke: b.sebeke,
      gesUretim: b.gesUretim,
      gesOz: b.gesOz,
      sebekeyeVerilen,
      fabrikaToplam,
      gesKarsilama: b.gesKarsilama,
      elektrikTep: b.elektrikTep,
      elektrikYogunluk: b.elektrikYogunluk,
    };
  });
}

// Üst KPI kartları — dönem bazlı özet (görseldeki 6 kart).
const KPILER: ElektrikKpi[] = [
  { anahtar: "toplam", baslik: "Toplam Elektrik Tüketimi", deger: "7,84", birim: "GWh", altDeger: "674,5 TEP", degisimYuzde: 3.7 },
  { anahtar: "sebeke", baslik: "Şebeke Elektrik Tüketimi", deger: "5,31", birim: "GWh", altDeger: "457,8 TEP", degisimYuzde: -2.1 },
  { anahtar: "gesUretim", baslik: "GES Toplam Üretimi", deger: "2,53", birim: "GWh", altDeger: "218,3 TEP", degisimYuzde: 15.6 },
  { anahtar: "gesOz", baslik: "GES Öz Tüketimi", deger: "1,95", birim: "GWh", altDeger: "168,0 TEP", degisimYuzde: 18.4 },
  { anahtar: "gesKarsilama", baslik: "GES Karşılama Oranı", deger: "31,4", birim: "%", degisimYuzde: 3.2, degisimBirim: "puan", radyal: 31.4 },
  { anahtar: "tep", baslik: "Elektrik TEP", deger: "674,5", birim: "TEP", degisimYuzde: 3.7 },
];

const KAYNAKLAR: ElektrikKaynakDilim[] = [
  { anahtar: "sebeke", etiket: "Şebeke Tüketimi", gwh: 5.31, yuzde: 67.7 },
  { anahtar: "gesOz", etiket: "GES Öz Tüketimi", gwh: 1.95, yuzde: 24.9 },
  { anahtar: "verilen", etiket: "Şebekeye Verilen", gwh: 0.58, yuzde: 7.4 },
];

const OZET: ElektrikOzet = {
  ytd: {
    toplamElektrik: "7,84",
    toplamDegisim: 3.7,
    gesUretim: "2,53",
    gesUretimDegisim: 15.6,
    gesKarsilama: "31,4",
    gesKarsilamaDegisim: 3.2,
  },
  enYuksek: { donem: "Temmuz 2026", gwh: "1,24", trend: [0.86, 0.84, 0.85, 0.83, 1.06, 1.11, 1.24] },
  enDusuk: { donem: "Nisan 2026", gwh: "0,81", trend: [0.86, 0.84, 0.85, 0.81, 0.9, 0.88, 0.83] },
  ortalama: "1,12",
  yogunluk: { deger: "22,4", degisim: 2.8 },
  sebekeBagimlilik: 67.7,
};

// Yıllara göre aylık fabrika toplam (GWh). 2026 gerçekleşen aylık veriden;
// 2025 ve 2024 ölçeklenerek türetilir (yıllar arası büyüme eğilimi).
function aylikKarsilastirmaUret(aylik: ElektrikAylik[]): AylikKarsilastirma[] {
  return aylik.map((a, i) => {
    const gwh2026 = a.fabrikaToplam / 1_000_000;
    return {
      kisa: a.kisa,
      y2024: Math.round(gwh2026 * 0.885 * 1000) / 1000,
      y2025: Math.round(gwh2026 * 0.935 * 1000) / 1000,
      // 2026 yalnızca gerçekleşen aylar (Ocak–Temmuz).
      y2026: i < 7 ? Math.round(gwh2026 * 1000) / 1000 : null,
    };
  });
}

// Yıllık özet tablosu — yıllık toplamlar (GWh / % / TEP) ve 2025→2026 değişimi.
const YILLIK_OZET: YillikMetrik[] = [
  { metrik: "Toplam Elektrik", birim: "GWh", y2024: 9.74, y2025: 10.42, y2026: 11.06, yoy: 6.1 },
  { metrik: "Şebeke Tüketimi", birim: "GWh", y2024: 7.02, y2025: 7.38, y2026: 7.62, yoy: 3.3 },
  { metrik: "GES Üretimi", birim: "GWh", y2024: 2.72, y2025: 3.04, y2026: 3.44, yoy: 13.2 },
  { metrik: "GES Öz Tüketimi", birim: "GWh", y2024: 2.18, y2025: 2.44, y2026: 2.71, yoy: 11.1 },
  { metrik: "Şebekeye Verilen", birim: "GWh", y2024: 0.54, y2025: 0.6, y2026: 0.73, yoy: 21.7 },
  { metrik: "GES Karşılama", birim: "%", y2024: 23.7, y2025: 24.8, y2026: 26.2, yoy: 1.4, yoyBirim: "puan" },
  { metrik: "Elektrik TEP", birim: "TEP", y2024: 837.5, y2025: 896.4, y2026: 951.2, yoy: 6.1 },
];

const YIL_KARTLARI: YilKarti[] = [
  { yil: 2024, toplam: 9.74, yoy: null },
  { yil: 2025, toplam: 10.42, yoy: 7.0 },
  { yil: 2026, toplam: 11.06, yoy: 6.1 },
];

/** Ekranın tüm mock verisini tek çağrıda döndürür. */
export function elektrikGesAnaliziGetir(): Promise<ElektrikGesAnaliz> {
  const aylik = aylikUret();
  return gecikmeIle({
    kpiler: KPILER,
    aylik,
    kaynaklar: KAYNAKLAR,
    toplamElektrikGwh: 7.84,
    ozet: OZET,
    aylikKarsilastirma: aylikKarsilastirmaUret(aylik),
    yillikOzet: YILLIK_OZET,
    yilKartlari: YIL_KARTLARI,
  });
}
