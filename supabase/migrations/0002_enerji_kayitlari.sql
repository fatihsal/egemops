-- 0002_enerji_kayitlari.sql
-- Aylık enerji veri girişi tablosu. Veri Girişi sayfası yazar, Enerji Kayıtları okur.
-- created_at/updated_at/deleted_at + soft delete + RLS. SQL Editor'de çalıştır.

create table if not exists public.enerji_kayitlari (
  id                 uuid primary key default gen_random_uuid(),
  yil                int  not null,
  ay                 int  not null check (ay between 1 and 12),

  -- Elektrik & GES (kWh)
  sebeke_elektrik    numeric,
  ges_toplam_uretim  numeric,
  ges_oz_tuketim     numeric,
  sebekeye_verilen   numeric,

  -- Doğalgaz (Sm³)
  dogalgaz           numeric,

  -- Akaryakıt (L)
  motorin            numeric,
  benzin             numeric,
  diger_akaryakit    numeric,

  -- Üretim (ton)
  uretim_ton         numeric,

  durum              text not null default 'taslak' check (durum in ('taslak', 'onayli')),
  giren              uuid references auth.users (id),

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz
);

-- Aynı dönem (yıl+ay) için silinmemiş tek kayıt olsun (upsert hedefi).
create unique index if not exists enerji_kayitlari_donem_uniq
  on public.enerji_kayitlari (yil, ay)
  where deleted_at is null;

-- updated_at otomatik (0001'deki ortak fonksiyon)
drop trigger if exists trg_enerji_kayitlari_updated_at on public.enerji_kayitlari;
create trigger trg_enerji_kayitlari_updated_at
  before update on public.enerji_kayitlari
  for each row execute function public.set_updated_at();

-- RLS: giriş yapan herkes okur/yazar; sadece silinmemiş kayıtlar görünür.
alter table public.enerji_kayitlari enable row level security;

drop policy if exists "kayitlari gor" on public.enerji_kayitlari;
create policy "kayitlari gor" on public.enerji_kayitlari for select
  to authenticated using (deleted_at is null);

drop policy if exists "kayit ekle" on public.enerji_kayitlari;
create policy "kayit ekle" on public.enerji_kayitlari for insert
  to authenticated with check (true);

drop policy if exists "kayit guncelle" on public.enerji_kayitlari;
create policy "kayit guncelle" on public.enerji_kayitlari for update
  to authenticated using (true) with check (true);
