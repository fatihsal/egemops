-- 0004_belgeler_genisletme.sql
-- Belgeler sayfası (belge yönetimi) için ek alanlar. Dönem bazlı yüklemeler
-- (Veri Girişi) yil/ay kullanır; genel belgeler (sözleşme, sertifika...) kullanmaz.

alter table public.belgeler
  alter column yil drop not null,
  alter column ay drop not null,
  add column if not exists kategori   text,      -- yasal | sertifika | sozlesme | rapor | teknik | fatura
  add column if not exists durum      text,      -- gecerli | yaklasiyor | doldu | taslak (boşsa gecerlilik'ten hesaplanır)
  add column if not exists gecerlilik date,       -- son geçerlilik tarihi (yoksa null)
  add column if not exists aciklama   text;

-- Dönem bazlı (Veri Girişi) yüklemeleri "fatura" kategorisine işaretle.
update public.belgeler
  set kategori = coalesce(kategori, 'fatura')
  where yil is not null and ay is not null;
