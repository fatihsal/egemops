-- -----------------------------------------------------------------------------
-- 0015 — Satın Alma: otomatik teklif toplama için alanlar
-- RFQ'ya thread_id (gelen cevapları eşleştirmek için), teklife kaynak mesaj/ek
-- kimlikleri (aynı eki iki kez eklememek için) ve AI özeti.
-- -----------------------------------------------------------------------------

alter table public.sa_rfq add column if not exists thread_id text;

alter table public.sa_teklifler add column if not exists kaynak_mesaj_id text;
alter table public.sa_teklifler add column if not exists kaynak_ek_id text;
alter table public.sa_teklifler add column if not exists ai_ozet text;
alter table public.sa_teklifler add column if not exists okunamadi boolean not null default false;

-- Aynı e-posta eki iki kez eklenmesin.
create unique index if not exists sa_teklifler_kaynak_uniq
  on public.sa_teklifler (kaynak_mesaj_id, kaynak_ek_id)
  where kaynak_mesaj_id is not null;
