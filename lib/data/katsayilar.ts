// -----------------------------------------------------------------------------
// VERİ KATMANI — Katsayılar (mock)
// -----------------------------------------------------------------------------
// Enerji hesaplarında kullanılan dönüşüm katsayıları / faktörler. Değerler resmi
// referanslara yakın örnek değerlerdir. Backend bağlandığında bu fonksiyonun içi
// gerçek katsayı setiyle değişir; imza sabit kalır.

import type {
  BirimFiyat,
  EmisyonFaktor,
  GenelParametre,
  KatsayiAnaliz,
  KatsayiKpi,
  TepKatsayi,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";

const ELEKTRIK = "#2563eb";
const DOGALGAZ = "#8b5cf6";
const AKARYAKIT = "#f59e0b";
const KOMUR = "#64748b";
const SU = "#06b6d4";

const KPILER: KatsayiKpi[] = [
  { anahtar: "toplam", baslik: "Tanımlı Katsayı", deger: "26", altMetin: "4 kategoride" },
  { anahtar: "yil", baslik: "Aktif Katsayı Yılı", deger: "2026", altMetin: "Geçerli set" },
  { anahtar: "guncelleme", baslik: "Son Güncelleme", deger: "12.08.2026", altMetin: "Uğur Melih tarafından" },
  { anahtar: "kaynak", baslik: "Veri Kaynağı", deger: "Resmi", altMetin: "Enerji Verimliliği Tebliği" },
];

const TEP: TepKatsayi[] = [
  { id: "tep-elk", ad: "Elektrik", renk: ELEKTRIK, birim: "MWh", altIsil: "860.000 kcal", tep: "0,0860 TEP", referans: "Enerji Verimliliği Tebliği" },
  { id: "tep-dg", ad: "Doğalgaz", renk: DOGALGAZ, birim: "1000 Sm³", altIsil: "8.250.000 kcal", tep: "0,8250 TEP", referans: "Enerji Verimliliği Tebliği" },
  { id: "tep-mot", ad: "Motorin", renk: AKARYAKIT, birim: "ton", altIsil: "10.200.000 kcal", tep: "1,0200 TEP", referans: "Enerji Verimliliği Tebliği" },
  { id: "tep-fo", ad: "Fuel-Oil No.6", renk: AKARYAKIT, birim: "ton", altIsil: "9.600.000 kcal", tep: "0,9600 TEP", referans: "Enerji Verimliliği Tebliği" },
  { id: "tep-lpg", ad: "LPG", renk: AKARYAKIT, birim: "ton", altIsil: "11.000.000 kcal", tep: "1,1000 TEP", referans: "Enerji Verimliliği Tebliği" },
  { id: "tep-tk", ad: "Taş Kömürü", renk: KOMUR, birim: "ton", altIsil: "7.000.000 kcal", tep: "0,7000 TEP", referans: "TÜBİTAK MAM" },
  { id: "tep-lin", ad: "Linyit", renk: KOMUR, birim: "ton", altIsil: "2.500.000 kcal", tep: "0,2500 TEP", referans: "TÜBİTAK MAM" },
];

const EMISYON: EmisyonFaktor[] = [
  { id: "em-elk", ad: "Elektrik (şebeke)", renk: ELEKTRIK, birim: "MWh", faktor: "442 kgCO₂e", kapsam: "Kapsam 2" },
  { id: "em-dg", ad: "Doğalgaz", renk: DOGALGAZ, birim: "1000 Sm³", faktor: "1.923 kgCO₂e", kapsam: "Kapsam 1" },
  { id: "em-mot", ad: "Motorin", renk: AKARYAKIT, birim: "ton", faktor: "3.170 kgCO₂e", kapsam: "Kapsam 1" },
  { id: "em-fo", ad: "Fuel-Oil No.6", renk: AKARYAKIT, birim: "ton", faktor: "3.130 kgCO₂e", kapsam: "Kapsam 1" },
  { id: "em-lpg", ad: "LPG", renk: AKARYAKIT, birim: "ton", faktor: "2.985 kgCO₂e", kapsam: "Kapsam 1" },
  { id: "em-tk", ad: "Taş Kömürü", renk: KOMUR, birim: "ton", faktor: "2.420 kgCO₂e", kapsam: "Kapsam 1" },
];

const FIYAT: BirimFiyat[] = [
  { id: "fy-elk", ad: "Elektrik", renk: ELEKTRIK, birim: "kWh", fiyat: "2,45 TL", guncelleme: "01.08.2026" },
  { id: "fy-dg", ad: "Doğalgaz", renk: DOGALGAZ, birim: "Sm³", fiyat: "6,80 TL", guncelleme: "01.08.2026" },
  { id: "fy-mot", ad: "Motorin", renk: AKARYAKIT, birim: "lt", fiyat: "44,50 TL", guncelleme: "01.09.2026" },
  { id: "fy-fo", ad: "Fuel-Oil No.6", renk: AKARYAKIT, birim: "ton", fiyat: "28.500 TL", guncelleme: "01.08.2026" },
  { id: "fy-lpg", ad: "LPG", renk: AKARYAKIT, birim: "kg", fiyat: "32,20 TL", guncelleme: "01.09.2026" },
  { id: "fy-su", ad: "Su", renk: SU, birim: "m³", fiyat: "42,00 TL", guncelleme: "01.07.2026" },
];

const GENEL: GenelParametre[] = [
  { id: "gp-baz", ad: "Referans (Baz) Yıl", deger: "2024", aciklama: "EnPI karşılaştırma yılı", ikon: "solar:calendar-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  { id: "gp-gun", ad: "Yıllık Çalışma Günü", deger: "330 gün", aciklama: "Üretim takvimi", ikon: "solar:calendar-mark-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  { id: "gp-vardiya", ad: "Vardiya Sayısı", deger: "3", aciklama: "Günlük vardiya", ikon: "solar:clock-circle-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" },
  { id: "gp-saat", ad: "Çalışma Saati / Yıl", deger: "7.920 saat", aciklama: "Tam kapasite", ikon: "solar:stopwatch-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" },
  { id: "gp-hedef", ad: "Yıllık İyileşme Hedefi", deger: "%10", aciklama: "EnPI azaltım hedefi", ikon: "solar:target-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
  { id: "gp-karbon", ad: "Karbon Gölge Fiyatı", deger: "30 €/tCO₂e", aciklama: "Yatırım değerlendirme", ikon: "solar:leaf-bold-duotone", sinif: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300" },
];

export function katsayiAnaliziGetir(): Promise<KatsayiAnaliz> {
  return gecikmeIle({
    kpiler: KPILER,
    tep: TEP,
    emisyon: EMISYON,
    fiyat: FIYAT,
    genel: GENEL,
    kaynak: "Enerji Verimliliği Tebliği (Resmi Gazete)",
    sonGuncelleme: "12.08.2026 09:20",
  });
}
