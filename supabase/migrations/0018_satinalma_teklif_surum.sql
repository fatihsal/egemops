-- -----------------------------------------------------------------------------
-- 0018 — Satın Alma: teklif revizyonu (sürüm) + geçerlilik
-- Aynı tedarikçiden gelen revize teklif yeni SÜRÜM olarak saklanır; eski sürüm
-- silinmez. Karşılaştırmada her tedarikçinin SON sürümü kullanılır.
-- -----------------------------------------------------------------------------

alter table public.sa_teklifler add column if not exists surum int not null default 1;
alter table public.sa_teklifler add column if not exists gecerlilik text;

create index if not exists sa_teklifler_grup_idx
  on public.sa_teklifler (talep_id, tedarikci_id, surum) where deleted_at is null;
