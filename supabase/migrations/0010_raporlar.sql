-- 0010_raporlar.sql
-- Üretilen rapor kayıtları (metadata). Dosya içeriği istemcide gerçek veriden
-- Excel/CSV olarak üretilir; burada kayıt tutulur. RLS + soft-delete.

create table if not exists public.raporlar (
  id          uuid primary key default gen_random_uuid(),
  ad          text not null,
  kategori    text not null default 'ozel' check (kategori in ('tuketim', 'performans', 'maliyet', 'tep', 'karsilastirma', 'ozel')),
  tur         text,
  format      text not null default 'PDF',
  donem       text,
  olusturan   uuid references auth.users (id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

drop trigger if exists trg_raporlar_updated_at on public.raporlar;
create trigger trg_raporlar_updated_at
  before update on public.raporlar
  for each row execute function public.set_updated_at();

alter table public.raporlar enable row level security;

drop policy if exists "rapor_sec" on public.raporlar;
create policy "rapor_sec" on public.raporlar for select to authenticated using (deleted_at is null);
drop policy if exists "rapor_ekle" on public.raporlar;
create policy "rapor_ekle" on public.raporlar for insert to authenticated with check (true);
drop policy if exists "rapor_guncelle" on public.raporlar;
create policy "rapor_guncelle" on public.raporlar for update to authenticated using (true) with check (true);

create or replace function public.rapor_sil(p_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.raporlar set deleted_at = now() where id = p_id;
$$;
grant execute on function public.rapor_sil(uuid) to authenticated;
