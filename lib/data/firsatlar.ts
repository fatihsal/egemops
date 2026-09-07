// -----------------------------------------------------------------------------
// VERİ KATMANI — Enerji Fırsatları (mock)
// -----------------------------------------------------------------------------
// Yalnızca frontend gösterimi için sahte veri. Backend bağlandığında SADECE bu
// dosyadaki fonksiyonların içi değişir; imzalar sabit kaldıkça ekranlar etkilenmez.

import type {
  Firsat,
  FirsatAnaliz,
  FirsatDurumDilim,
  FirsatKaynakDilim,
  FirsatKpi,
  FirsatVade,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";

const KPILER: FirsatKpi[] = [
  { anahtar: "toplam", baslik: "Toplam Fırsat", deger: "18", altMetin: "Aktif + Planlanan" },
  { anahtar: "tasarruf", baslik: "Toplam Potansiyel Tasarruf", deger: "264,7", birim: "TEP / yıl", altMetin: "Yıllık tahmini" },
  { anahtar: "yatirim", baslik: "Yatırım Tutarı", deger: "2.850.000", birim: "€", altMetin: "Toplam yatırım ihtiyacı" },
  { anahtar: "geriDonus", baslik: "Geri Dönüş Süresi", deger: "2,8", birim: "yıl", altMetin: "Ağırlıklı ortalama" },
  { anahtar: "gerceklesen", baslik: "Gerçekleşen Tasarruf", deger: "38,4", birim: "TEP", altMetin: "YTD gerçekleşen" },
  { anahtar: "uygulama", baslik: "Uygulama Oranı", deger: "%39", altMetin: "Ağırlıklı ilerleme" },
];

const DURUM_DAGILIMI: FirsatDurumDilim[] = [
  { anahtar: "fizibilite", etiket: "Fizibilite", adet: 6, yuzde: 33 },
  { anahtar: "teklif", etiket: "Teklif / Planlama", adet: 4, yuzde: 22 },
  { anahtar: "onaylandi", etiket: "Onaylandı", adet: 3, yuzde: 17 },
  { anahtar: "uygulama", etiket: "Uygulama", adet: 3, yuzde: 17 },
  { anahtar: "tamamlandi", etiket: "Tamamlandı", adet: 2, yuzde: 11 },
];

// Kaynak bazlı tasarruf — bar ve donut aynı veriyi kullanır (tutarlı).
const KAYNAK_TASARRUF: FirsatKaynakDilim[] = [
  { anahtar: "elektrik", etiket: "Elektrik", tep: 132.6, yuzde: 50.1 },
  { anahtar: "dogalgaz", etiket: "Doğalgaz", tep: 85.4, yuzde: 32.3 },
  { anahtar: "akaryakit", etiket: "Akaryakıt", tep: 46.7, yuzde: 17.6 },
];

const FIRSATLAR: Firsat[] = [
  { id: "f1", oncelik: "yuksek", ad: "Kompresör Odası Optimizasyonu", kaynak: "elektrik", tasarruf: 68.5, yatirim: 420000, geriDonus: 1.8, durum: "uygulama", ilerleme: 60 },
  { id: "f2", oncelik: "yuksek", ad: "Reküperatör Projesi", kaynak: "dogalgaz", tasarruf: 52.3, yatirim: 650000, geriDonus: 2.2, durum: "fizibilite", ilerleme: 20 },
  { id: "f3", oncelik: "orta", ad: "LED Aydınlatma Dönüşümü", kaynak: "elektrik", tasarruf: 31.2, yatirim: 180000, geriDonus: 1.6, durum: "onaylandi", ilerleme: 0 },
  { id: "f4", oncelik: "orta", ad: "Kazan Yanma Ayarı Optimizasyonu", kaynak: "dogalgaz", tasarruf: 24.6, yatirim: 60000, geriDonus: 0.9, durum: "uygulama", ilerleme: 40 },
  { id: "f5", oncelik: "dusuk", ad: "Hat İzolasyon İyileştirmesi", kaynak: "dogalgaz", tasarruf: 18.7, yatirim: 95000, geriDonus: 1.3, durum: "teklif", ilerleme: 10 },
  { id: "f6", oncelik: "orta", ad: "GES Kapasite Artışı", kaynak: "elektrik", tasarruf: 14.5, yatirim: 280000, geriDonus: 3.4, durum: "teklif", ilerleme: 5 },
  { id: "f7", oncelik: "orta", ad: "Frekans Konvertörü (VSD) Montajı", kaynak: "elektrik", tasarruf: 12.8, yatirim: 150000, geriDonus: 2.1, durum: "fizibilite", ilerleme: 15 },
  { id: "f8", oncelik: "orta", ad: "Atık Isı Geri Kazanımı", kaynak: "dogalgaz", tasarruf: 10.4, yatirim: 210000, geriDonus: 3.8, durum: "fizibilite", ilerleme: 10 },
  { id: "f9", oncelik: "dusuk", ad: "Elektrik Motoru IE4 Yenileme", kaynak: "elektrik", tasarruf: 9.3, yatirim: 120000, geriDonus: 2.6, durum: "fizibilite", ilerleme: 0 },
  { id: "f10", oncelik: "dusuk", ad: "Bina Yalıtımı", kaynak: "dogalgaz", tasarruf: 8.1, yatirim: 175000, geriDonus: 4.2, durum: "fizibilite", ilerleme: 0 },
  { id: "f11", oncelik: "dusuk", ad: "Fırın Brülör Yenileme", kaynak: "dogalgaz", tasarruf: 7.6, yatirim: 90000, geriDonus: 2.3, durum: "teklif", ilerleme: 5 },
  { id: "f12", oncelik: "dusuk", ad: "Kondens Geri Dönüşü", kaynak: "dogalgaz", tasarruf: 6.9, yatirim: 45000, geriDonus: 1.4, durum: "fizibilite", ilerleme: 0 },
  { id: "f13", oncelik: "dusuk", ad: "Basınçlı Hava Kaçak Onarımı", kaynak: "elektrik", tasarruf: 6.2, yatirim: 18000, geriDonus: 0.6, durum: "tamamlandi", ilerleme: 100 },
  { id: "f14", oncelik: "dusuk", ad: "Buhar Kapanı Bakımı", kaynak: "dogalgaz", tasarruf: 5.8, yatirim: 25000, geriDonus: 0.8, durum: "uygulama", ilerleme: 55 },
  { id: "f15", oncelik: "dusuk", ad: "Akaryakıt Filo Optimizasyonu", kaynak: "akaryakit", tasarruf: 5.2, yatirim: 40000, geriDonus: 1.5, durum: "teklif", ilerleme: 10 },
  { id: "f16", oncelik: "dusuk", ad: "Akıllı Aydınlatma Sensörleri", kaynak: "elektrik", tasarruf: 4.7, yatirim: 32000, geriDonus: 1.1, durum: "onaylandi", ilerleme: 0 },
  { id: "f17", oncelik: "dusuk", ad: "Jeneratör Verim İyileştirme", kaynak: "akaryakit", tasarruf: 3.8, yatirim: 28000, geriDonus: 1.9, durum: "onaylandi", ilerleme: 0 },
  { id: "f18", oncelik: "dusuk", ad: "Güç Faktörü Düzeltme", kaynak: "elektrik", tasarruf: 3.4, yatirim: 22000, geriDonus: 0.9, durum: "tamamlandi", ilerleme: 100 },
];

const VADELER: FirsatVade[] = [
  { anahtar: "hizli", baslik: "Hızlı Etki Potansiyeli", deger: "96,8", birim: "TEP / yıl", aciklama: "1 yıldan kısa geri dönüş süresi olan fırsatlar" },
  { anahtar: "orta", baslik: "Orta Vadeli Potansiyel", deger: "124,3", birim: "TEP / yıl", aciklama: "1 – 3 yıl geri dönüş süresi olan fırsatlar" },
  { anahtar: "uzun", baslik: "Uzun Vadeli Potansiyel", deger: "43,6", birim: "TEP / yıl", aciklama: "3 yıldan uzun geri dönüş süresi olan fırsatlar" },
  { anahtar: "co2", baslik: "CO₂ Azaltım Potansiyeli", deger: "482", birim: "tCO₂e / yıl", aciklama: "Tahmini yıllık emisyon azaltımı" },
];

/** Ekranın tüm mock verisini tek çağrıda döndürür. */
export function firsatAnaliziGetir(): Promise<FirsatAnaliz> {
  return gecikmeIle({
    kpiler: KPILER,
    durumDagilimi: DURUM_DAGILIMI,
    toplamFirsat: 18,
    kaynakTasarruf: KAYNAK_TASARRUF,
    toplamTasarruf: 264.7,
    firsatlar: FIRSATLAR,
    vadeler: VADELER,
  });
}
