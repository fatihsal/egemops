// -----------------------------------------------------------------------------
// VERİ KATMANI — Yönetim Özeti (mock)
// -----------------------------------------------------------------------------
// Yalnızca frontend gösterimi için sahte veri. Backend bağlandığında SADECE bu
// dosyadaki fonksiyonun içi değişir; imza sabit kaldıkça ekran etkilenmez.

import type {
  OzetKpi,
  OzetOneCikan,
  OzetProje,
  OzetRapor,
  OzetSistemDurum,
  PerformansTrendNoktasi,
  TuketimUretimNoktasi,
  YonetimOzetiAnaliz,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";

const KPILER: OzetKpi[] = [
  { anahtar: "tuketim", baslik: "Toplam Enerji Tüketimi", deger: "18.420", birim: "TEP", degisim: -4.8, iyiYon: "azalis", altMetin: "geçen yıla göre" },
  { anahtar: "uretim", baslik: "Toplam Üretim", deger: "64.850", birim: "ton", degisim: 11.2, iyiYon: "artis", altMetin: "geçen yıla göre" },
  { anahtar: "yogunluk", baslik: "Enerji Yoğunluğu", deger: "0,284", birim: "TEP/ton", degisim: -6.1, iyiYon: "azalis", altMetin: "geçen yıla göre" },
  { anahtar: "hedef", baslik: "Hedefe Uyum", deger: "%63", altMetin: "Hedef: %10 iyileşme", ilerleme: 63 },
  { anahtar: "tasarruf", baslik: "Gerçekleşen Tasarruf", deger: "38,4", birim: "TEP", degisim: 6.3, iyiYon: "artis", altMetin: "baz yıla göre" },
  { anahtar: "maliyet", baslik: "Toplam Enerji Maliyeti", deger: "54,2", birim: "M TL", degisim: -2.1, iyiYon: "azalis", altMetin: "geçen yıla göre" },
];

const TUKETIM_URETIM: TuketimUretimNoktasi[] = [
  { ay: "Oca", tuketim: 1500, uretim: 6200 },
  { ay: "Şub", tuketim: 1520, uretim: 6400 },
  { ay: "Mar", tuketim: 1480, uretim: 6300 },
  { ay: "Nis", tuketim: 1560, uretim: 6650 },
  { ay: "May", tuketim: 1700, uretim: 7050 },
  { ay: "Haz", tuketim: 1650, uretim: 7650 },
  { ay: "Tem", tuketim: 1760, uretim: 8250 },
  { ay: "Ağu", tuketim: 1500, uretim: 8800 },
];

const PERFORMANS_TREND: PerformansTrendNoktasi[] = [
  { ay: "Oca", gerceklesen: 0.305, hedef: 0.300, bazYil: 0.325 },
  { ay: "Şub", gerceklesen: 0.303, hedef: 0.297, bazYil: 0.325 },
  { ay: "Mar", gerceklesen: 0.300, hedef: 0.294, bazYil: 0.324 },
  { ay: "Nis", gerceklesen: 0.297, hedef: 0.291, bazYil: 0.324 },
  { ay: "May", gerceklesen: 0.294, hedef: 0.288, bazYil: 0.323 },
  { ay: "Haz", gerceklesen: 0.291, hedef: 0.285, bazYil: 0.323 },
  { ay: "Tem", gerceklesen: 0.288, hedef: 0.282, bazYil: 0.322 },
  { ay: "Ağu", gerceklesen: 0.284, hedef: 0.279, bazYil: 0.322 },
];

const ONE_CIKAN: OzetOneCikan[] = [
  { anahtar: "uretim", ikon: "solar:chart-2-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", baslik: "Üretim %11,2 arttı.", aciklama: "Geçen yılın aynı dönemine göre." },
  { anahtar: "tuketim", ikon: "solar:bolt-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Enerji tüketimi %4,8 azaldı.", aciklama: "Verimlilik çalışmaları etkili oldu." },
  { anahtar: "proje", ikon: "solar:target-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300", baslik: "3 projede devreye alma tamamlandı.", aciklama: "Toplam 22,8 TEP/yıl tasarruf sağlandı." },
  { anahtar: "karbon", ikon: "solar:leaf-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", baslik: "Karbon emisyonu %6,1 azaldı.", aciklama: "Geçen yıla göre toplam 1.240 ton CO₂e daha düşük." },
];

const PROJELER: OzetProje[] = [
  { id: "p1", ad: "Kompresör Odası Optimizer", durum: "uygulama", ilerleme: 62, tasarruf: 24.5, termin: "15.12.2026" },
  { id: "p2", ad: "EAE LED Dönüşümü", durum: "satinAlma", ilerleme: 45, tasarruf: 10.0, termin: "31.01.2027" },
  { id: "p3", ad: "Reküperatör Projesi", durum: "muhendislik", ilerleme: 25, tasarruf: 18.0, termin: "30.04.2027" },
];

const RAPORLAR: OzetRapor[] = [
  { id: "r-perf-08", ad: "Ağustos 2026 Enerji Performansı Raporu", tarih: "26.08.2026", format: "PDF" },
  { id: "r-tuk-07", ad: "Temmuz 2026 Tüketim Raporu", tarih: "01.08.2026", format: "Excel" },
  { id: "r-tep-ytd", ad: "2026 YTD TEP Analizi Raporu", tarih: "01.08.2026", format: "PDF" },
];

const SISTEM: OzetSistemDurum[] = [
  { alan: "Veri Girişi", durum: "Güncel", iyi: true },
  { alan: "Enerji Kayıtları", durum: "Sorun Yok", iyi: true },
  { alan: "Hesaplamalar", durum: "Sorun Yok", iyi: true },
  { alan: "Raporlama", durum: "Aktif", iyi: true },
  { alan: "Sistem Entegrasyonları", durum: "Aktif", iyi: true },
];

export function yonetimOzetiGetir(): Promise<YonetimOzetiAnaliz> {
  return gecikmeIle({
    kpiler: KPILER,
    tuketimUretim: TUKETIM_URETIM,
    kaynakTep: {
      merkez: "18.420",
      birim: "TEP",
      dilimler: [
        { anahtar: "elektrik", etiket: "Elektrik", deger: 10240, yuzde: 55.6, renk: "#2563eb" },
        { anahtar: "dogalgaz", etiket: "Doğalgaz", deger: 6180, yuzde: 33.6, renk: "#8b5cf6" },
        { anahtar: "akaryakit", etiket: "Akaryakıt", deger: 1540, yuzde: 8.4, renk: "#f59e0b" },
        { anahtar: "diger", etiket: "Diğer", deger: 460, yuzde: 2.5, renk: "#94a3b8" },
      ],
    },
    maliyetDagilim: {
      merkez: "54,2",
      birim: "M TL",
      dilimler: [
        { anahtar: "elektrik", etiket: "Elektrik", deger: 28.3, yuzde: 52.2, renk: "#2563eb" },
        { anahtar: "dogalgaz", etiket: "Doğalgaz", deger: 18.6, yuzde: 34.3, renk: "#8b5cf6" },
        { anahtar: "akaryakit", etiket: "Akaryakıt", deger: 5.1, yuzde: 9.4, renk: "#f59e0b" },
        { anahtar: "diger", etiket: "Diğer", deger: 2.2, yuzde: 4.1, renk: "#94a3b8" },
      ],
    },
    performansTrend: PERFORMANS_TREND,
    hedef: { yuzde: 63, hedefIyilesme: "%10", gerceklesen: "%6,3", hedefeKalan: "0,011 TEP/ton" },
    oneCikan: ONE_CIKAN,
    projeler: PROJELER,
    raporlar: RAPORLAR,
    sistem: SISTEM,
  });
}
