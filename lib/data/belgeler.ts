// -----------------------------------------------------------------------------
// VERİ KATMANI — Belgeler (mock)
// -----------------------------------------------------------------------------
// Yalnızca frontend gösterimi için sahte veri. Backend bağlandığında SADECE bu
// dosyadaki fonksiyonun içi değişir; imza sabit kaldıkça ekran etkilenmez.

import type {
  Belge,
  BelgeAnaliz,
  BelgeKategori,
  BelgeKpi,
  DepolamaKalem,
  SureYaklasan,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";

const KPILER: BelgeKpi[] = [
  { anahtar: "toplam", baslik: "Toplam Belge", deger: "248", altMetin: "Tüm kategoriler" },
  { anahtar: "buAy", baslik: "Bu Ay Yüklenen", deger: "16", altMetin: "Son 30 gün" },
  { anahtar: "yaklasan", baslik: "Süresi Yaklaşan", deger: "5", altMetin: "30 gün içinde" },
  { anahtar: "depolama", baslik: "Depolama", deger: "4,8", birim: "GB", altMetin: "10 GB'ın %48'i", ilerleme: 48 },
];

const KATEGORILER: BelgeKategori[] = [
  { anahtar: "yasal", baslik: "Yasal & Mevzuat", aciklama: "Kanun, yönetmelik ve resmi bildirimler", adet: 34, boyut: "820 MB" },
  { anahtar: "sertifika", baslik: "Sertifikalar", aciklama: "ISO 50001, EKB ve yeterlilik belgeleri", adet: 18, boyut: "210 MB" },
  { anahtar: "sozlesme", baslik: "Sözleşmeler", aciklama: "Tedarik ve enerji performans sözleşmeleri", adet: 26, boyut: "640 MB" },
  { anahtar: "rapor", baslik: "Etüt & Raporlar", aciklama: "Enerji etütleri ve VAP proje dosyaları", adet: 52, boyut: "1,6 GB" },
  { anahtar: "teknik", baslik: "Teknik Dökümanlar", aciklama: "Ekipman kılavuzları ve kalibrasyon belgeleri", adet: 61, boyut: "1,1 GB" },
  { anahtar: "fatura", baslik: "Faturalar", aciklama: "Elektrik, doğalgaz ve akaryakıt faturaları", adet: 57, boyut: "280 MB" },
];

const DEPOLAMA: DepolamaKalem[] = [
  { anahtar: "rapor", etiket: "Etüt & Raporlar", gb: 1.6, renk: "#14b8a6" },
  { anahtar: "teknik", etiket: "Teknik Dökümanlar", gb: 1.1, renk: "#f59e0b" },
  { anahtar: "sozlesme", etiket: "Sözleşmeler", gb: 0.64, renk: "#8b5cf6" },
  { anahtar: "yasal", etiket: "Yasal & Mevzuat", gb: 0.82, renk: "#2563eb" },
  { anahtar: "fatura", etiket: "Faturalar", gb: 0.28, renk: "#06b6d4" },
  { anahtar: "sertifika", etiket: "Sertifikalar", gb: 0.21, renk: "#10b981" },
];

const SURE_YAKLASAN: SureYaklasan[] = [
  { id: "s1", ad: "ISO 50001 Gözetim Denetim Raporu", kategori: "sertifika", tarih: "08.09.2026", kalanGun: 12 },
  { id: "s2", ad: "Elektrik Tedarik Sözleşmesi 2026", kategori: "sozlesme", tarih: "14.09.2026", kalanGun: 18 },
  { id: "s3", ad: "Enerji Yöneticisi Sertifikası", kategori: "sertifika", tarih: "20.09.2026", kalanGun: 24 },
  { id: "s4", ad: "Doğalgaz Tedarik Sözleşmesi", kategori: "sozlesme", tarih: "23.09.2026", kalanGun: 27 },
  { id: "s5", ad: "Emisyon Ölçüm Yeterlilik Belgesi", kategori: "yasal", tarih: "30.09.2026", kalanGun: 34 },
];

const BELGELER: Belge[] = [
  { id: "iso50001", ad: "ISO 50001:2018 Enerji Yönetim Sistemi Sertifikası", kategori: "sertifika", format: "PDF", boyut: "2,4 MB", yukleyen: "Uğur Melih", tarih: "15.03.2026", durum: "gecerli", gecerlilik: "15.03.2027", aciklama: "Akredite belgelendirme kuruluşundan alınan ISO 50001 enerji yönetim sistemi sertifikası." },
  { id: "ekb", ad: "Enerji Kimlik Belgesi (EKB)", kategori: "yasal", format: "PDF", boyut: "1,8 MB", yukleyen: "Uğur Melih", tarih: "02.02.2026", durum: "gecerli", gecerlilik: "02.02.2036", aciklama: "Bina/tesis enerji kimlik belgesi; 10 yıl geçerlidir." },
  { id: "etut-2026", ad: "2026 Yılı Enerji Etüdü Raporu", kategori: "rapor", format: "PDF", boyut: "8,6 MB", yukleyen: "Enerji Ekibi", tarih: "20.01.2026", durum: "gecerli", gecerlilik: null, aciklama: "Yetkilendirilmiş enerji verimliliği danışmanlık şirketi tarafından hazırlanan detaylı enerji etüdü." },
  { id: "elektrik-sozlesme", ad: "Elektrik Tedarik Sözleşmesi 2026", kategori: "sozlesme", format: "PDF", boyut: "3,2 MB", yukleyen: "Satın Alma", tarih: "01.01.2026", durum: "yaklasiyor", gecerlilik: "14.09.2026", aciklama: "Serbest tüketici elektrik tedarik sözleşmesi; yenileme görüşmeleri planlanmalı." },
  { id: "enerji-yonetici", ad: "Enerji Yöneticisi Sertifikası", kategori: "sertifika", format: "PDF", boyut: "1,1 MB", yukleyen: "Uğur Melih", tarih: "20.09.2021", durum: "yaklasiyor", gecerlilik: "20.09.2026", aciklama: "Enerji yöneticisi yeterlilik sertifikası; yenileme eğitimi gerekli." },
  { id: "vap-kompresor", ad: "VAP Başvuru Dosyası - Kompresör Optimizasyonu", kategori: "rapor", format: "Excel, PDF", boyut: "5,3 MB", yukleyen: "Enerji Ekibi", tarih: "12.08.2026", durum: "taslak", gecerlilik: null, aciklama: "Verimlilik Artırıcı Proje (VAP) destek başvuru dosyası; teknik ekler tamamlanıyor." },
  { id: "kompresor-kilavuz", ad: "Kompresör Odası Teknik Kılavuzu", kategori: "teknik", format: "PDF", boyut: "12,4 MB", yukleyen: "Bakım Onarım", tarih: "05.07.2026", durum: "gecerli", gecerlilik: null, aciklama: "Kompresör ekipmanları kurulum, işletme ve bakım kılavuzu." },
  { id: "dogalgaz-fatura-07", ad: "Doğalgaz Faturası - Temmuz 2026", kategori: "fatura", format: "PDF", boyut: "640 KB", yukleyen: "Muhasebe", tarih: "03.08.2026", durum: "gecerli", gecerlilik: null, aciklama: "Temmuz 2026 dönemi doğalgaz tüketim faturası." },
  { id: "kalibrasyon-sayac", ad: "Kalibrasyon Sertifikası - Elektrik Sayaçları", kategori: "teknik", format: "PDF", boyut: "900 KB", yukleyen: "Bakım Onarım", tarih: "10.06.2025", durum: "doldu", gecerlilik: "10.06.2026", aciklama: "Elektrik sayaçları kalibrasyon sertifikası; geçerlilik süresi dolmuştur, yenilenmeli." },
  { id: "iso-gozetim", ad: "ISO 50001 Gözetim Denetim Raporu", kategori: "sertifika", format: "PDF", boyut: "2,0 MB", yukleyen: "Uğur Melih", tarih: "08.09.2025", durum: "yaklasiyor", gecerlilik: "08.09.2026", aciklama: "Yıllık gözetim denetimi raporu; sonraki denetim tarihi yaklaşıyor." },
  { id: "elektrik-fatura-08", ad: "Elektrik Faturası - Ağustos 2026", kategori: "fatura", format: "PDF", boyut: "720 KB", yukleyen: "Muhasebe", tarih: "02.09.2026", durum: "gecerli", gecerlilik: null, aciklama: "Ağustos 2026 dönemi elektrik tüketim faturası." },
  { id: "verimlilik-yonetmelik", ad: "Enerji Verimliliği Yönetmeliği (Güncel)", kategori: "yasal", format: "PDF", boyut: "3,6 MB", yukleyen: "Uğur Melih", tarih: "15.05.2026", durum: "gecerli", gecerlilik: null, aciklama: "Yürürlükteki enerji verimliliği yönetmeliği ve ilgili tebliğler." },
];

export function belgeAnaliziGetir(): Promise<BelgeAnaliz> {
  return gecikmeIle({
    kpiler: KPILER,
    kategoriler: KATEGORILER,
    depolama: { toplam: 10, kullanilan: 4.8, yuzde: 48, kalemler: DEPOLAMA },
    sureYaklasan: SURE_YAKLASAN,
    belgeler: BELGELER,
  });
}
