// -----------------------------------------------------------------------------
// VERİ KATMANI — Doğalgaz Analizi (mock)
// -----------------------------------------------------------------------------
// Yalnızca frontend gösterimi için sahte veri. Backend bağlandığında SADECE bu
// dosyadaki fonksiyonların içi değişir; imzalar sabit kaldıkça ekranlar etkilenmez.

import type {
  DogalgazAnaliz,
  DogalgazAylik,
  DogalgazFirsat,
  DogalgazKpi,
  DogalgazMevsim,
  DogalgazYilBar,
  DogalgazYilNokta,
  DogalgazYogunlukNokta,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";
import { sayi, sayiOndalik } from "@/lib/format";

const AYLAR: [string, string][] = [
  ["Ocak", "Oca"], ["Şubat", "Şub"], ["Mart", "Mar"], ["Nisan", "Nis"],
  ["Mayıs", "May"], ["Haziran", "Haz"], ["Temmuz", "Tem"], ["Ağustos", "Ağu"],
  ["Eylül", "Eyl"], ["Ekim", "Eki"], ["Kasım", "Kas"], ["Aralık", "Ara"],
];

const YIL = 2026;

// 2026 aylık tüketim (Sm³). Toplam 526.000; en yüksek Kasım (63.154),
// en düşük Nisan (30.978) — KPI'larla birebir tutarlı.
const SM3_2026 = [60000, 56000, 46000, 30978, 33000, 31000, 32000, 34000, 40000, 49000, 63154, 50868];

// Aylık yoğunluk (Sm³/ton) — Ocak–Temmuz gerçek, sonrası tahmin.
const YOGUNLUK = [21.4, 20.8, 19.6, 17.2, 17.8, 18.1, 18.4, 18.6, 19.0, 19.8, 20.6, 21.2];

// TEP dönüşümü: 431,6 TEP / 526.000 Sm³.
const TEP_FAKTOR = 431.6 / 526000;

// Yıllık toplamlar (çubuk grafik — kesin değerler).
const YIL_TOPLAM: Record<number, number> = { 2023: 612870, 2024: 568654, 2025: 550112, 2026: 526000 };

// Diğer yılların aylık serisi — 2026 şeklinin oranla ölçeklenmişi + hafif
// mevsimsel sapma (aylık YoY'un çeşitlenmesi için).
function seriUret(yil: number, faz: number): number[] {
  const oran = YIL_TOPLAM[yil] / YIL_TOPLAM[2026];
  return SM3_2026.map((v, i) => Math.round(v * oran * (1 + 0.05 * Math.sin(i * 0.9 + faz))));
}
const SM3_2025 = seriUret(2025, 0.5);
const SM3_2024 = seriUret(2024, 1.1);
const SM3_2023 = seriUret(2023, 1.8);

function aylikTuketimUret(): DogalgazYilNokta[] {
  return AYLAR.map(([, kisa], i) => ({
    kisa,
    y2023: SM3_2023[i],
    y2024: SM3_2024[i],
    y2025: SM3_2025[i],
    y2026: SM3_2026[i],
  }));
}

function yogunlukUret(): DogalgazYogunlukNokta[] {
  return AYLAR.map(([, kisa], i) => ({
    kisa,
    gercek: i <= 6 ? YOGUNLUK[i] : null,
    tahmin: i >= 6 ? YOGUNLUK[i] : null, // Temmuz'da bağlanır, sonrası tahmin
  }));
}

// Aylık detay (Ocak–Temmuz, en yeni önce).
function detayUret(): DogalgazAylik[] {
  const satirlar = AYLAR.slice(0, 7).map(([ay], i) => {
    const sm3 = SM3_2026[i];
    const yogunluk = YOGUNLUK[i];
    const oncekiAy = i === 0 ? null : Math.round(((sm3 - SM3_2026[i - 1]) / SM3_2026[i - 1]) * 1000) / 10;
    const gecenYil = Math.round(((sm3 - SM3_2025[i]) / SM3_2025[i]) * 1000) / 10;
    return {
      ay,
      donem: `${ay} ${YIL}`,
      sm3,
      tep: Math.round(sm3 * TEP_FAKTOR * 100) / 100,
      uretim: Math.round(sm3 / yogunluk),
      yogunluk,
      oncekiAy,
      gecenYil,
    };
  });
  return satirlar.reverse();
}

const KPILER: DogalgazKpi[] = [
  { anahtar: "toplam", baslik: "Toplam Doğalgaz Tüketimi", deger: sayi(526000), birim: "Sm³", degisimYuzde: -4.2 },
  { anahtar: "tep", baslik: "Toplam Doğalgaz TEP", deger: sayiOndalik(431.6), birim: "TEP", degisimYuzde: -4.1 },
  { anahtar: "ortalama", baslik: "Aylık Ortalama", deger: sayi(43833), birim: "Sm³", degisimYuzde: -3.1 },
  { anahtar: "enYuksek", baslik: "En Yüksek Tüketim", deger: sayi(63154), birim: "Sm³", altMetin: "Kasım 2026" },
  { anahtar: "enDusuk", baslik: "En Düşük Tüketim", deger: sayi(30978), birim: "Sm³", altMetin: "Nisan 2026" },
  { anahtar: "yogunluk", baslik: "Doğalgaz Yoğunluğu", deger: sayiOndalik(18.4), birim: "Sm³/ton", degisimYuzde: -2.3 },
];

const YILLIK: DogalgazYilBar[] = [
  { yil: 2023, sm3: 612870 },
  { yil: 2024, sm3: 568654 },
  { yil: 2025, sm3: 550112 },
  { yil: 2026, sm3: 526000 },
];

const MEVSIMSEL: DogalgazMevsim[] = [
  { anahtar: "kis", etiket: "Kış", yuzde: 32, sm3: 168320 },
  { anahtar: "ilkbahar", etiket: "İlkbahar", yuzde: 21, sm3: 110460 },
  { anahtar: "yaz", etiket: "Yaz", yuzde: 20, sm3: 105200 },
  { anahtar: "sonbahar", etiket: "Sonbahar", yuzde: 27, sm3: 142020 },
];

const FIRSATLAR: DogalgazFirsat[] = [
  { baslik: "Reküperatör Projesi", aciklama: "Atık ısı geri kazanımı ile yakıt tasarrufu", durum: "Fizibilite" },
  { baslik: "Kazan Yanma Ayarı", aciklama: "Yanma verimliliği ve ayar optimizasyonu", durum: "Takip" },
  { baslik: "İzolasyon İyileştirmesi", aciklama: "Boru ve ekipman izolasyon iyileştirmesi", durum: "Değerlendirme" },
];

/** Ekranın tüm mock verisini tek çağrıda döndürür. */
export function dogalgazAnaliziGetir(): Promise<DogalgazAnaliz> {
  return gecikmeIle({
    kpiler: KPILER,
    aylikTuketim: aylikTuketimUret(),
    yillik: YILLIK,
    yogunlukSeri: yogunlukUret(),
    mevsimsel: MEVSIMSEL,
    toplamSm3: 526000,
    ytd: {
      toplamSm3: sayi(526000),
      toplamDegisim: -4.2,
      tep: sayiOndalik(431.6),
      tepDegisim: -4.1,
      ortalama: sayi(43833),
      ortalamaDegisim: -3.1,
      yogunluk: sayiOndalik(18.4),
      yogunlukDegisim: -2.3,
    },
    firsatlar: FIRSATLAR,
    detay: detayUret(),
  });
}

// TEP dönüşüm faktörü — grafik birim değiştiricide kullanılır.
export const DOGALGAZ_TEP_FAKTOR = TEP_FAKTOR;
