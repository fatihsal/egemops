-- -----------------------------------------------------------------------------
-- 0016 — Satın Alma: firma profili & gönderen imzası (ayarlar)
-- RFQ e-postalarının gönderen bilgileri ve imzası buradan gelir.
-- Tek satır (id='firma'); ayarlardan düzenlenebilir.
-- -----------------------------------------------------------------------------

create table if not exists public.sa_ayarlar (
  id            text primary key default 'firma',
  firma_adi     text,
  gonderen_adi  text,
  departman     text,
  telefon       text,
  imza          text,
  updated_at    timestamptz not null default now()
);

insert into public.sa_ayarlar (id, firma_adi, gonderen_adi, departman)
  values ('firma', 'Egem Ambalaj', 'Fatih SAL', 'Bakım Departmanı')
  on conflict (id) do nothing;

drop trigger if exists trg_sa_ayarlar_updated_at on public.sa_ayarlar;
create trigger trg_sa_ayarlar_updated_at before update on public.sa_ayarlar
  for each row execute function public.set_updated_at();

alter table public.sa_ayarlar enable row level security;
drop policy if exists "sa_ayarlar gor" on public.sa_ayarlar;
create policy "sa_ayarlar gor" on public.sa_ayarlar for select to authenticated using (true);
drop policy if exists "sa_ayarlar ekle" on public.sa_ayarlar;
create policy "sa_ayarlar ekle" on public.sa_ayarlar for insert to authenticated with check (true);
drop policy if exists "sa_ayarlar guncelle" on public.sa_ayarlar;
create policy "sa_ayarlar guncelle" on public.sa_ayarlar for update to authenticated using (true) with check (true);
