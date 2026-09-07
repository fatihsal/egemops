// -----------------------------------------------------------------------------
// VERİ KATMANI — Raporlar (mock)
// -----------------------------------------------------------------------------
// Yalnızca frontend gösterimi için sahte veri. Backend bağlandığında SADECE bu
// dosyadaki fonksiyonların içi değişir; imzalar sabit kaldıkça ekranlar etkilenmez.

import type {
  EnCokIndirilen,
  Rapor,
  RaporAnaliz,
  RaporKategori,
  RaporKpi,
  RaporTrendNoktasi,
  SonRapor,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";

const KPILER: RaporKpi[] = [
  { anahtar: "olusturulan", baslik: "Oluşturulan Rapor", deger: "24", altMetin: "Bu dönemde" },
  { anahtar: "indirilen", baslik: "İndirilen Rapor", deger: "18", altMetin: "Bu dönemde" },
  { anahtar: "zamanlanan", baslik: "Zamanlanan Rapor", deger: "6", altMetin: "Aktif" },
  { anahtar: "sablon", baslik: "Kaydedilen Şablon", deger: "8", altMetin: "Kullanılan şablon" },
  { anahtar: "encok", baslik: "En Çok Kullanılan Rapor", deger: "Enerji Performansı Raporu", altMetin: "8 kez", boyut: "metin" },
  { anahtar: "kapsam", baslik: "Toplam Veri Kapsamı", deger: "%100", altMetin: "Dönem kapsamı" },
];

const KATEGORILER: RaporKategori[] = [
  { anahtar: "tuketim", baslik: "Tüketim Raporları", aciklama: "Elektrik, doğalgaz, akaryakıt ve TEP tüketim raporları", adet: 6 },
  { anahtar: "performans", baslik: "Performans Raporları", aciklama: "Enerji performansı ve EnPI analiz raporları", adet: 5 },
  { anahtar: "maliyet", baslik: "Maliyet Raporları", aciklama: "Enerji maliyetleri ve birim fiyat analiz raporları", adet: 4 },
  { anahtar: "tep", baslik: "TEP Raporları", aciklama: "TEP analizleri ve kaynak bazlı TEP raporları", adet: 4 },
  { anahtar: "karsilastirma", baslik: "Karşılaştırma Raporları", aciklama: "Dönemsel ve yıllar arası karşılaştırma raporları", adet: 3 },
  { anahtar: "ozel", baslik: "Özel Raporlar", aciklama: "Özel tasarım raporlar ve özel analizler", adet: 2 },
];

const TREND: RaporTrendNoktasi[] = [
  { etiket: "Mar '26", olusturulan: 10, indirilen: 6 },
  { etiket: "Nis '26", olusturulan: 13, indirilen: 8 },
  { etiket: "May '26", olusturulan: 12, indirilen: 7 },
  { etiket: "Haz '26", olusturulan: 11, indirilen: 6 },
  { etiket: "Tem '26", olusturulan: 14, indirilen: 9 },
  { etiket: "Ağu '26", olusturulan: 16, indirilen: 11 },
];

const EN_COK_INDIRILEN: EnCokIndirilen[] = [
  { sira: 1, ad: "Enerji Performansı Raporu", adet: 8 },
  { sira: 2, ad: "Aylık Tüketim Raporu", adet: 6 },
  { sira: 3, ad: "TEP Analizi Raporu", adet: 5 },
  { sira: 4, ad: "Maliyet Analizi Raporu", adet: 4 },
  { sira: 5, ad: "Kaynak Bazlı Tüketim Raporu", adet: 3 },
];

const SON_RAPORLAR: SonRapor[] = [
  { id: "r-perf-08", ad: "Ağustos 2026 Enerji Performansı Raporu", tur: "Performans", kategori: "performans", tarih: "26.08.2026 10:30", olusturan: "Uğur Melih", format: "PDF" },
  { id: "r-tuk-07", ad: "Temmuz 2026 Tüketim Raporu", tur: "Tüketim", kategori: "tuketim", tarih: "01.08.2026 09:15", olusturan: "Uğur Melih", format: "Excel" },
  { id: "r-tep-ytd", ad: "2026 YTD TEP Analizi Raporu", tur: "TEP", kategori: "tep", tarih: "01.08.2026 09:10", olusturan: "Uğur Melih", format: "PDF" },
  { id: "r-mal-06", ad: "Haziran 2026 Maliyet Raporu", tur: "Maliyet", kategori: "maliyet", tarih: "01.07.2026 09:05", olusturan: "Uğur Melih", format: "Excel" },
  { id: "r-kaynak-tuk", ad: "Kaynak Bazlı Tüketim Raporu", tur: "Tüketim", kategori: "tuketim", tarih: "30.06.2026 16:40", olusturan: "Uğur Melih", format: "PDF" },
];

const RAPORLAR: Rapor[] = [
  { id: "aylik-tuketim", ad: "Aylık Tüketim Raporu", kategori: "tuketim", aciklama: "Aylık enerji tüketimlerinin kaynak bazlı detaylı raporu", format: "Excel, PDF", siklik: "Aylık", sonOlusturma: "01.08.2026", durum: "aktif" },
  { id: "enerji-performansi", ad: "Enerji Performansı Raporu", kategori: "performans", aciklama: "Enerji performans göstergeleri ve EnPI analiz raporu", format: "PDF", siklik: "Aylık", sonOlusturma: "26.08.2026", durum: "aktif" },
  { id: "tep-analizi", ad: "TEP Analizi Raporu", kategori: "tep", aciklama: "TEP dönüşümleri ve kaynak bazlı TEP analiz raporu", format: "Excel, PDF", siklik: "Aylık", sonOlusturma: "01.08.2026", durum: "aktif" },
  { id: "maliyet-analizi", ad: "Maliyet Analizi Raporu", kategori: "maliyet", aciklama: "Enerji maliyetleri, birim fiyatlar ve maliyet analiz raporu", format: "Excel, PDF", siklik: "Aylık", sonOlusturma: "01.07.2026", durum: "aktif" },
  { id: "kaynak-bazli-tuketim", ad: "Kaynak Bazlı Tüketim Raporu", kategori: "tuketim", aciklama: "Enerji kaynaklarına göre tüketim dağılım raporu", format: "PDF", siklik: "Aylık", sonOlusturma: "30.06.2026", durum: "aktif" },
  { id: "yillik-karsilastirma", ad: "Yıllık Karşılaştırma Raporu", kategori: "karsilastirma", aciklama: "Yıllar arası tüketim ve maliyet karşılaştırma raporu", format: "PDF", siklik: "Yıllık", sonOlusturma: "15.01.2026", durum: "aktif" },
  { id: "enpi-ozet", ad: "EnPI Özet Raporu", kategori: "performans", aciklama: "Enerji performans göstergeleri özet ve hedef karşılaştırması", format: "Excel, PDF", siklik: "Aylık", sonOlusturma: "26.08.2026", durum: "aktif" },
  { id: "ceyreklik-maliyet", ad: "Çeyreklik Maliyet Raporu", kategori: "maliyet", aciklama: "Üç aylık enerji maliyeti ve bütçe sapma raporu", format: "Excel", siklik: "Çeyreklik", sonOlusturma: "01.07.2026", durum: "taslak" },
  { id: "ozel-yonetim", ad: "Özel Yönetim Sunumu", kategori: "ozel", aciklama: "Yönetim kurulu için özel tasarım enerji özeti", format: "PDF", siklik: "Talebe göre", sonOlusturma: "10.06.2026", durum: "taslak" },
  { id: "haftalik-tuketim", ad: "Haftalık Tüketim İzleme", kategori: "tuketim", aciklama: "Haftalık kaynak bazlı tüketim izleme raporu", format: "Excel", siklik: "Haftalık", sonOlusturma: "24.08.2026", durum: "aktif" },
  { id: "eski-tep-2024", ad: "2024 TEP Yıl Sonu Raporu", kategori: "tep", aciklama: "2024 yılı toplam TEP dönüşüm ve dağılım raporu", format: "PDF", siklik: "Yıllık", sonOlusturma: "31.12.2024", durum: "arsivlendi" },
  { id: "hatali-import", ad: "Otomatik Veri İçe Aktarım Raporu", kategori: "ozel", aciklama: "Son içe aktarımda kaynak eşleşmesi başarısız oldu", format: "Excel", siklik: "Günlük", sonOlusturma: "26.08.2026", durum: "hata" },
];

/** Ekranın tüm mock verisini tek çağrıda döndürür. */
export function raporAnaliziGetir(): Promise<RaporAnaliz> {
  return gecikmeIle({
    kpiler: KPILER,
    kategoriler: KATEGORILER,
    trend: TREND,
    enCokIndirilen: EN_COK_INDIRILEN,
    sonRaporlar: SON_RAPORLAR,
    raporlar: RAPORLAR,
  });
}
