// -----------------------------------------------------------------------------
// VERİ KATMANI — Akaryakıt Analizi (mock)
// -----------------------------------------------------------------------------
// Yalnızca frontend gösterimi için sahte veri. Backend bağlandığında SADECE bu
// dosyadaki fonksiyonların içi değişir; imzalar sabit kaldıkça ekranlar etkilenmez.

import type {
  AkaryakitAnaliz,
  AkaryakitAylik,
  AkaryakitFirsat,
  AkaryakitKpi,
  AkaryakitKullanimNokta,
  AkaryakitTurDilim,
  AkaryakitYilBar,
  AkaryakitYilNokta,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";
import { sayi, sayiOndalik } from "@/lib/format";

const AYLAR: [string, string][] = [
  ["Ocak", "Oca"], ["Şubat", "Şub"], ["Mart", "Mar"], ["Nisan", "Nis"],
  ["Mayıs", "May"], ["Haziran", "Haz"], ["Temmuz", "Tem"], ["Ağustos", "Ağu"],
  ["Eylül", "Eyl"], ["Ekim", "Eki"], ["Kasım", "Kas"], ["Aralık", "Ara"],
];

const YIL = 2026;

// 2026 aylık tüketim (Litre). Toplam 153.000; en yüksek Temmuz (15.800),
// en düşük Şubat (10.400) — KPI'larla birebir tutarlı.
const LITRE_2026 = [11200, 10400, 11800, 12100, 13200, 14600, 15800, 15200, 13100, 12300, 11600, 11700];

// Aylık jeneratör payı — yaz aylarında şebeke yükünü karşılamak için artar.
const JEN_ORAN = [0.24, 0.23, 0.25, 0.27, 0.3, 0.34, 0.36, 0.35, 0.31, 0.28, 0.25, 0.24];

// TEP dönüşümü: 129,3 TEP / 153.000 Litre.
const TEP_FAKTOR = 129.3 / 153000;

// Yıllık toplamlar (çubuk grafik — kesin değerler).
const YIL_TOPLAM: Record<number, number> = { 2023: 172400, 2024: 164800, 2025: 158900, 2026: 153000 };

// Diğer yılların aylık serisi — 2026 şeklinin oranla ölçeklenmişi + hafif
// mevsimsel sapma (aylık YoY'un çeşitlenmesi için).
function seriUret(yil: number, faz: number): number[] {
  const oran = YIL_TOPLAM[yil] / YIL_TOPLAM[2026];
  return LITRE_2026.map((v, i) => Math.round(v * oran * (1 + 0.05 * Math.sin(i * 0.9 + faz))));
}
const LITRE_2025 = seriUret(2025, 0.5);
const LITRE_2024 = seriUret(2024, 1.1);
const LITRE_2023 = seriUret(2023, 1.8);

function aylikTuketimUret(): AkaryakitYilNokta[] {
  return AYLAR.map(([, kisa], i) => ({
    kisa,
    y2023: LITRE_2023[i],
    y2024: LITRE_2024[i],
    y2025: LITRE_2025[i],
    y2026: LITRE_2026[i],
  }));
}

function kullanimSerisiUret(): AkaryakitKullanimNokta[] {
  return AYLAR.map(([, kisa], i) => {
    const jenerator = Math.round(LITRE_2026[i] * JEN_ORAN[i]);
    return { kisa, arac: LITRE_2026[i] - jenerator, jenerator };
  });
}

// Aylık detay (Ocak–Temmuz, en yeni önce).
function detayUret(): AkaryakitAylik[] {
  const satirlar = AYLAR.slice(0, 7).map(([ay], i) => {
    const litre = LITRE_2026[i];
    const jenerator = Math.round(litre * JEN_ORAN[i]);
    const oncekiAy = i === 0 ? null : Math.round(((litre - LITRE_2026[i - 1]) / LITRE_2026[i - 1]) * 1000) / 10;
    const gecenYil = Math.round(((litre - LITRE_2025[i]) / LITRE_2025[i]) * 1000) / 10;
    return {
      ay,
      donem: `${ay} ${YIL}`,
      litre,
      tep: Math.round(litre * TEP_FAKTOR * 100) / 100,
      arac: litre - jenerator,
      jenerator,
      oncekiAy,
      gecenYil,
    };
  });
  return satirlar.reverse();
}

const KPILER: AkaryakitKpi[] = [
  { anahtar: "toplam", baslik: "Toplam Akaryakıt Tüketimi", deger: sayi(153000), birim: "Litre", degisimYuzde: -3.7 },
  { anahtar: "tep", baslik: "Toplam Akaryakıt TEP", deger: sayiOndalik(129.3), birim: "TEP", degisimYuzde: -3.6 },
  { anahtar: "ortalama", baslik: "Aylık Ortalama", deger: sayi(12750), birim: "Litre", degisimYuzde: -2.8 },
  { anahtar: "enYuksek", baslik: "En Yüksek Tüketim", deger: sayi(15800), birim: "Litre", altMetin: "Temmuz 2026" },
  { anahtar: "enDusuk", baslik: "En Düşük Tüketim", deger: sayi(10400), birim: "Litre", altMetin: "Şubat 2026" },
  { anahtar: "aracBasi", baslik: "Araç Başına Ortalama", deger: sayiOndalik(854.8), birim: "L/araç", degisimYuzde: -1.9 },
];

const YILLIK: AkaryakitYilBar[] = [
  { yil: 2023, litre: 172400 },
  { yil: 2024, litre: 164800 },
  { yil: 2025, litre: 158900 },
  { yil: 2026, litre: 153000 },
];

const TUR_DAGILIMI: AkaryakitTurDilim[] = [
  { anahtar: "motorin", etiket: "Motorin", yuzde: 78, litre: 119340 },
  { anahtar: "benzin", etiket: "Benzin", yuzde: 14, litre: 21420 },
  { anahtar: "diger", etiket: "Diğer (LPG/Yağ)", yuzde: 8, litre: 12240 },
];

const FIRSATLAR: AkaryakitFirsat[] = [
  { baslik: "Araç Filosu Yenileme", aciklama: "Düşük tüketimli araçlarla filo modernizasyonu", durum: "Fizibilite" },
  { baslik: "Jeneratör Bakım Optimizasyonu", aciklama: "Periyodik bakım ile yakıt verimliliği artışı", durum: "Takip" },
  { baslik: "Ekonomik Sürüş Eğitimi", aciklama: "Sürücü davranışına dayalı tüketim azaltımı", durum: "Değerlendirme" },
];

/** Ekranın tüm mock verisini tek çağrıda döndürür. */
export function akaryakitAnaliziGetir(): Promise<AkaryakitAnaliz> {
  return gecikmeIle({
    kpiler: KPILER,
    aylikTuketim: aylikTuketimUret(),
    yillik: YILLIK,
    kullanimSeri: kullanimSerisiUret(),
    turDagilimi: TUR_DAGILIMI,
    toplamLitre: 153000,
    ytd: {
      toplamLitre: sayi(153000),
      toplamDegisim: -3.7,
      tep: sayiOndalik(129.3),
      tepDegisim: -3.6,
      ortalama: sayi(12750),
      ortalamaDegisim: -2.8,
      aracBasi: sayiOndalik(854.8),
      aracBasiDegisim: -1.9,
    },
    firsatlar: FIRSATLAR,
    detay: detayUret(),
  });
}

// TEP dönüşüm faktörü — grafik birim değiştiricide kullanılır.
export const AKARYAKIT_TEP_FAKTOR = TEP_FAKTOR;
