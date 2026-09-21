-- 0001_profiles.sql
-- Kullanıcı profilleri + roller. Her tabloda created_at/updated_at/deleted_at.
-- Soft delete (deleted_at) + RLS. Supabase SQL Editor'de çalıştır.

-- ----------------------------------------------------------------------------
-- 1) Rol tipi (şimdilik admin; ileride diğer roller eklenecek)
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'kullanici_rolu') then
    create type public.kullanici_rolu as enum ('admin', 'enerji_yoneticisi', 'izleyici');
  end if;
end$$;

-- ----------------------------------------------------------------------------
-- 2) updated_at'i otomatik güncelleyen ortak fonksiyon (tüm tablolarda kullanılır)
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3) profiles tablosu — auth.users'a bağlı
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  ad_soyad    text,
  eposta      text,
  rol         public.kullanici_rolu not null default 'izleyici',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 4) Yeni auth kullanıcısı oluşunca otomatik profil aç
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, eposta, ad_soyad)
  values (new.id, new.email, new.raw_user_meta_data->>'ad_soyad')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 5) RLS — sadece silinmemiş (deleted_at is null) kayıtlar görünür
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Admin mi? (RLS içinde tekrar kullanmak için yardımcı fonksiyon)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and rol = 'admin'
      and deleted_at is null
  );
$$;

-- Kendi profilini gör
drop policy if exists "kendi profilini gor" on public.profiles;
create policy "kendi profilini gor"
  on public.profiles for select
  using (deleted_at is null and (id = auth.uid() or public.is_admin()));

-- Kendi profilini güncelle (rol hariç — rolü sadece admin değiştirebilir)
drop policy if exists "kendi profilini guncelle" on public.profiles;
create policy "kendi profilini guncelle"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Sadece admin ekleyip (soft) silebilir
drop policy if exists "admin ekle" on public.profiles;
create policy "admin ekle"
  on public.profiles for insert
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6) İLK ADMİN — kendi kullanıcı e-postanı yaz, bir kez çalıştır
-- ----------------------------------------------------------------------------
-- update public.profiles set rol = 'admin'
-- where eposta = 'BURAYA_SENIN_EPOSTAN';
