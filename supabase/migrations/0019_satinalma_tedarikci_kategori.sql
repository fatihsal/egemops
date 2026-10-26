-- -----------------------------------------------------------------------------
-- 0019 — Satın Alma: tedarikçi kategorileri (çok etiketli gruplama)
-- Bir tedarikçi birden fazla kategoride olabilir (ör. hem elektrik hem mekanik).
-- -----------------------------------------------------------------------------

alter table public.sa_tedarikciler add column if not exists kategoriler text[] not null default '{}';

create index if not exists sa_tedarikciler_kategori_idx
  on public.sa_tedarikciler using gin (kategoriler) where deleted_at is null;
