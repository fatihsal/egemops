// -----------------------------------------------------------------------------
// VERİ KATMANI — Enerji Projeleri (mock)
// -----------------------------------------------------------------------------
// Yalnızca frontend gösterimi için sahte veri. Backend bağlandığında SADECE bu
// dosyadaki fonksiyonların içi değişir; imzalar sabit kaldıkça ekranlar etkilenmez.

import type {
  Proje,
  ProjeAnaliz,
  ProjeAsama,
  ProjeButceKalem,
  ProjeDikkatMadde,
  ProjeGantt,
  ProjeKpi,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";

const KPILER: ProjeKpi[] = [
  { anahtar: "aktif", baslik: "Aktif Proje", deger: "5", altMetin: "Devam eden proje sayısı" },
  { anahtar: "butce", baslik: "Toplam Proje Bütçesi", deger: "4,85", birim: "M TL", altMetin: "Onaylı toplam bütçe" },
  { anahtar: "harcama", baslik: "Gerçekleşen Harcama", deger: "2,10", birim: "M TL", altMetin: "Bütçenin %43'ü", ilerleme: 43 },
  { anahtar: "planlanan", baslik: "Planlanan Tasarruf", deger: "82,4", birim: "TEP / yıl", altMetin: "Toplam beklenti" },
  { anahtar: "dogrulanan", baslik: "Doğrulanan Tasarruf", deger: "31,6", birim: "TEP / yıl", altMetin: "Gerçekleşen tasarruf" },
  { anahtar: "zamaninda", baslik: "Zamanında İlerleyen", deger: "4 / 5", altMetin: "1 proje gecikmede" },
];

const PROJELER: Proje[] = [
  {
    id: "p1",
    ad: "Kompresör Odası Optimizer",
    aciklama: "Kompresör Odası İyileştirmesi",
    kaynak: "elektrik",
    durum: "uygulama",
    ilerleme: 62,
    baslangic: "15.09.2026",
    hedefBitis: "15.12.2026",
    sorumlu: "Bakım Onarım",
    butce: 1200000,
    harcanan: 720000,
    beklenenTasarruf: 24.5,
    dogrulananTasarruf: null,
    geriDonus: 1.6,
    saglik: { zaman: "yesil", butce: "yesil", tasarruf: "yesil" },
  },
  {
    id: "p2",
    ad: "EAE LED Dönüşümü",
    aciklama: "LED Aydınlatma Dönüşüm Projesi",
    kaynak: "elektrik",
    durum: "satinAlma",
    ilerleme: 45,
    baslangic: "01.10.2026",
    hedefBitis: "31.01.2027",
    sorumlu: "Bakım Onarım",
    butce: 850000,
    harcanan: 300000,
    beklenenTasarruf: 10.0,
    dogrulananTasarruf: null,
    geriDonus: 2.1,
    saglik: { zaman: "yesil", butce: "amber", tasarruf: "yok" },
  },
  {
    id: "p3",
    ad: "Reküperatör Projesi",
    aciklama: "Atık Isı Geri Kazanım Sistemi",
    kaynak: "dogalgaz",
    durum: "muhendislik",
    ilerleme: 25,
    baslangic: "12.08.2026",
    hedefBitis: "30.04.2027",
    sorumlu: "Enerji Ekibi",
    butce: 1450000,
    harcanan: 650000,
    beklenenTasarruf: 18.0,
    dogrulananTasarruf: null,
    geriDonus: 2.4,
    saglik: { zaman: "amber", butce: "yesil", tasarruf: "yok" },
  },
  {
    id: "p4",
    ad: "Motor VFD Uygulaması",
    aciklama: "Değişken Hızlı Sürücü Montajı",
    kaynak: "elektrik",
    durum: "uygulama",
    ilerleme: 70,
    baslangic: "10.07.2026",
    hedefBitis: "30.11.2026",
    sorumlu: "Bakım Onarım",
    butce: 650000,
    harcanan: 450000,
    beklenenTasarruf: 12.0,
    dogrulananTasarruf: 7.2,
    geriDonus: 1.2,
    saglik: { zaman: "yesil", butce: "yesil", tasarruf: "yesil" },
  },
  {
    id: "p5",
    ad: "Kazan Yanma Ayarı",
    aciklama: "Yanma Verimi Optimizasyonu",
    kaynak: "dogalgaz",
    durum: "devreyeAlma",
    ilerleme: 90,
    baslangic: "05.06.2026",
    hedefBitis: "15.09.2026",
    sorumlu: "Enerji Ekibi",
    butce: 700000,
    harcanan: 580000,
    beklenenTasarruf: 7.9,
    dogrulananTasarruf: 6.4,
    geriDonus: 0.9,
    saglik: { zaman: "yesil", butce: "yesil", tasarruf: "yesil" },
  },
];

// Yaşam döngüsü — portföy genelindeki (tamamlananlar dâhil) aşama dağılımı.
const ASAMALAR: ProjeAsama[] = [
  { anahtar: "onaylandi", etiket: "Onaylandı", ikon: "solar:check-circle-bold-duotone", adet: 0 },
  { anahtar: "planlama", etiket: "Planlama", ikon: "solar:clipboard-list-bold-duotone", adet: 1 },
  { anahtar: "satinAlma", etiket: "Satın Alma", ikon: "solar:cart-large-2-bold-duotone", adet: 1 },
  { anahtar: "uygulama", etiket: "Uygulama", ikon: "solar:settings-bold-duotone", adet: 2 },
  { anahtar: "devreyeAlma", etiket: "Devreye Alma", ikon: "solar:bolt-circle-bold-duotone", adet: 0 },
  { anahtar: "olcum", etiket: "Ölçüm & Doğrulama", ikon: "solar:chart-square-bold-duotone", adet: 1 },
  { anahtar: "tamamlandi", etiket: "Tamamlandı", ikon: "solar:verified-check-bold-duotone", adet: 3 },
];

// Gantt — konumlar 7 aylık pencerenin (Ağu '26 – Şub '27) yüzdesi cinsinden,
// gerçek başlangıç/bitiş tarihlerinden türetildi (1 ay ≈ %14,29).
const GANTT: ProjeGantt[] = [
  { id: "p1", ad: "Kompresör Odası Optimizer", renk: "#14b8a6", sol: 21.0, genislik: 42.6 },
  { id: "p2", ad: "EAE LED Dönüşümü", renk: "#f59e0b", sol: 28.6, genislik: 56.7 },
  { id: "p3", ad: "Reküperatör Projesi", renk: "#8b5cf6", sol: 5.1, genislik: 94.9, gecikme: 20 },
  { id: "p4", ad: "Motor VFD Uygulaması", renk: "#22c55e", sol: 0, genislik: 56.7 },
  { id: "p5", ad: "Kazan Yanma Ayarı", renk: "#3b82f6", sol: 0, genislik: 21.0 },
];

const GANTT_EKSEN = ["Ağu '26", "Eyl '26", "Eki '26", "Kas '26", "Ara '26", "Oca '27", "Şub '27"];
const GANTT_BUGUN = 15.2; // 03.09.2026

const BUTCE_DILIMLER: ProjeButceKalem[] = [
  { etiket: "Gerçekleşen Harcama", deger: 2.1, renk: "#14b8a6" },
  { etiket: "Siparişe Bağlanan (kalan)", deger: 1.0, renk: "#3b82f6" },
  { etiket: "Serbest Bütçe", deger: 1.75, renk: "#cbd5e1" },
];

const BUTCE_KALEMLER: ProjeButceKalem[] = [
  { etiket: "Toplam Onaylı Bütçe", deger: 4.85, renk: "#0f766e" },
  { etiket: "Siparişe Bağlanan", deger: 3.1, renk: "#3b82f6" },
  { etiket: "Gerçekleşen Harcama", deger: 2.1, renk: "#14b8a6" },
  { etiket: "Kalan Bütçe", deger: 2.75, renk: "#cbd5e1" },
];

const DIKKAT: ProjeDikkatMadde[] = [
  { id: "d1", proje: "Reküperatör Projesi", mesaj: "Tedarikçi teknik çizimleri bekleniyor.", kaynak: "dogalgaz" },
  { id: "d2", proje: "EAE LED Dönüşümü", mesaj: "AutoCAD saha yerleşimi tamamlanmadı.", kaynak: "elektrik" },
  { id: "d3", proje: "Kompresör Optimizer", mesaj: "Debi ölçümü için firma ziyareti planlanacak.", kaynak: "elektrik" },
];

/** Ekranın tüm mock verisini tek çağrıda döndürür. */
export function projeAnaliziGetir(): Promise<ProjeAnaliz> {
  return gecikmeIle({
    kpiler: KPILER,
    projeler: PROJELER,
    asamalar: ASAMALAR,
    gantt: GANTT,
    ganttEksen: GANTT_EKSEN,
    ganttBugun: GANTT_BUGUN,
    butce: {
      toplam: 4.85,
      kullanimYuzde: 43,
      dilimler: BUTCE_DILIMLER,
      kalemler: BUTCE_KALEMLER,
    },
    tasarruf: { planlanan: 82.4, dogrulanan: 31.6 },
    dikkat: DIKKAT,
  });
}
