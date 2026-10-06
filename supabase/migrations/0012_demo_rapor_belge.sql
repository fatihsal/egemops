-- 0012_demo_rapor_belge.sql
-- SUNUM İÇİN DEMO VERİSİ: raporlar + belgeler. Gerçek kullanıma geçerken temizleyin.
-- Not: belge URL'leri yer tutucudur ('#'); "Görüntüle" gerçek dosya açmaz.

-- Admin profil id (yukleyen/olusturan için)
-- Aşağıdaki alt sorgular kullanıcı adı 'admin' olan profili kullanır.

-- -------- RAPORLAR (üretilmiş rapor kayıtları) --------
insert into public.raporlar (ad, kategori, tur, format, donem, olusturan, created_at)
select
  t.ad, t.kategori, t.tur, t.format,
  to_char(date_trunc('month', now()) - (g.k || ' months')::interval, 'Mon YYYY'),
  (select id from public.profiles where kullanici_adi = 'admin' and deleted_at is null limit 1),
  date_trunc('month', now()) - (g.k || ' months')::interval + ((random() * 24)::int || ' days')::interval
from (values
  ('Aylık Tüketim Raporu', 'tuketim', 'Tüketim Raporu', 'Excel'),
  ('Enerji Performansı Raporu', 'performans', 'Performans Raporu', 'PDF'),
  ('TEP Analizi Raporu', 'tep', 'TEP Raporu', 'PDF'),
  ('Maliyet Analizi Raporu', 'maliyet', 'Maliyet Raporu', 'Excel'),
  ('Kaynak Bazlı Tüketim Raporu', 'tuketim', 'Tüketim Raporu', 'PDF'),
  ('EnPI Özet Raporu', 'performans', 'Performans Raporu', 'Excel'),
  ('Yıllık Karşılaştırma Raporu', 'karsilastirma', 'Karşılaştırma Raporu', 'PDF')
) as t(ad, kategori, tur, format)
cross join generate_series(0, 5) as g(k)
where random() < 0.8;

-- -------- BELGELER (genel belge kayıtları) --------
insert into public.belgeler (ad, tur, boyut, url, depolama_yolu, kategori, gecerlilik, aciklama, yukleyen, created_at)
select
  d.ad, d.tur, (300000 + random() * 8000000)::bigint, '#', 'demo/' || md5(random()::text),
  d.kategori, d.gecerlilik, d.aciklama,
  (select id from public.profiles where kullanici_adi = 'admin' and deleted_at is null limit 1),
  now() - ((random() * 300)::int || ' days')::interval
from (values
  ('Enerji Verimliliği Yönetmeliği (Güncel)', 'PDF', 'yasal', null::date, 'Yürürlükteki yönetmelik ve tebliğler'),
  ('Enerji Kimlik Belgesi (EKB)', 'PDF', 'yasal', (now() + interval '2800 days')::date, 'Tesis enerji kimlik belgesi'),
  ('Emisyon Ölçüm Yeterlilik Belgesi', 'PDF', 'yasal', (now() + interval '18 days')::date, 'Baca gazı ölçüm yeterlilik belgesi'),
  ('ÇED Gerekli Değildir Belgesi', 'PDF', 'yasal', null::date, 'Çevresel etki değerlendirme muafiyeti'),
  ('ISO 50001:2018 Sertifikası', 'PDF', 'sertifika', (now() + interval '140 days')::date, 'Enerji yönetim sistemi sertifikası'),
  ('ISO 14001 Çevre Yönetim Sertifikası', 'PDF', 'sertifika', (now() + interval '90 days')::date, 'Çevre yönetim sistemi sertifikası'),
  ('Enerji Yöneticisi Sertifikası', 'PDF', 'sertifika', (now() + interval '22 days')::date, 'Enerji yöneticisi yeterlilik sertifikası'),
  ('ISO 50001 Gözetim Denetim Raporu', 'PDF', 'sertifika', (now() - interval '20 days')::date, 'Yıllık gözetim denetim raporu'),
  ('Elektrik Tedarik Sözleşmesi 2026', 'PDF', 'sozlesme', (now() + interval '12 days')::date, 'Serbest tüketici elektrik sözleşmesi'),
  ('Doğalgaz Tedarik Sözleşmesi', 'PDF', 'sozlesme', (now() + interval '210 days')::date, 'Doğalgaz tedarik sözleşmesi'),
  ('GES Bakım ve İşletme Sözleşmesi', 'PDF', 'sozlesme', (now() + interval '75 days')::date, 'GES O&M sözleşmesi'),
  ('Enerji Performans Sözleşmesi (EPC)', 'PDF', 'sozlesme', null::date, 'Verimlilik performans sözleşmesi'),
  ('2025 Yılı Enerji Etüdü Raporu', 'PDF', 'rapor', null::date, 'Detaylı enerji etüdü'),
  ('VAP Başvuru Dosyası - Kompresör', 'Excel', 'rapor', null::date, 'Verimlilik artırıcı proje başvurusu'),
  ('Karbon Ayak İzi Raporu 2025', 'PDF', 'rapor', null::date, 'Kurumsal karbon ayak izi'),
  ('Yıllık EnPI Değerlendirme Raporu', 'Excel', 'rapor', null::date, 'Enerji performans göstergeleri'),
  ('Kompresör Odası Teknik Kılavuzu', 'PDF', 'teknik', null::date, 'Kurulum ve bakım kılavuzu'),
  ('Kalibrasyon Sertifikası - Sayaçlar', 'PDF', 'teknik', (now() - interval '40 days')::date, 'Elektrik sayaçları kalibrasyonu'),
  ('GES İnvertör Teknik Dökümanı', 'PDF', 'teknik', null::date, 'İnvertör teknik özellikleri'),
  ('Trafo Periyodik Bakım Kılavuzu', 'PDF', 'teknik', (now() + interval '30 days')::date, 'Trafo bakım planı'),
  ('Elektrik Faturası - Eylül 2026', 'PDF', 'fatura', null::date, 'Eylül dönemi elektrik faturası'),
  ('Doğalgaz Faturası - Eylül 2026', 'PDF', 'fatura', null::date, 'Eylül dönemi doğalgaz faturası'),
  ('Akaryakıt Faturası - Eylül 2026', 'Excel', 'fatura', null::date, 'Eylül dönemi akaryakıt faturası'),
  ('Elektrik Faturası - Ağustos 2026', 'PDF', 'fatura', null::date, 'Ağustos dönemi elektrik faturası')
) as d(ad, tur, kategori, gecerlilik, aciklama);
