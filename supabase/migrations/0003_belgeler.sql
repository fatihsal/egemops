-- 0003_belgeler.sql
-- Yüklenen belgeler (Firebase Storage'da dosya, burada meta + indirme URL'si).
-- Dönem (yıl+ay) bazlı bağlanır. created_at/updated_at/deleted_at + RLS.

create table if not exists public.belgeler (
  id           uuid primary key default gen_random_uuid(),
  yil          int  not null,
  ay           int  not null check (ay between 1 and 12),

  ad           text not null,        -- dosya adı
  tur          text,                 -- "PDF" | "Excel" | "JPG" ...
  boyut        bigint,               -- byte
  url          text not null,        -- Firebase indirme URL'si
  depolama_yolu text not null,       -- Firebase Storage path (silme için)

  yukleyen     uuid references auth.users (id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz
);

create index if not exists belgeler_donem_idx
  on public.belgeler (yil, ay) where deleted_at is null;

drop trigger if exists trg_belgeler_updated_at on public.belgeler;
create trigger trg_belgeler_updated_at
  before update on public.belgeler
  for each row execute function public.set_updated_at();

alter table public.belgeler enable row level security;

drop policy if exists "belgeleri gor" on public.belgeler;
create policy "belgeleri gor" on public.belgeler for select
  to authenticated using (deleted_at is null);

drop policy if exists "belge ekle" on public.belgeler;
create policy "belge ekle" on public.belgeler for insert
  to authenticated with check (true);

drop policy if exists "belge guncelle" on public.belgeler;
create policy "belge guncelle" on public.belgeler for update
  to authenticated using (true) with check (true);
