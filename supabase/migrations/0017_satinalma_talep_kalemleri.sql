-- -----------------------------------------------------------------------------
-- 0017 — Satın Alma: çok kalemli talep (RequestItem)
-- Bir talepte birden fazla ürün kalemi olabilir (ör. motor + redüktör ayrı).
-- Talep başlık+fotoğraf+durum taşır; kalemler ürün detaylarını taşır.
-- -----------------------------------------------------------------------------

create table if not exists public.sa_talep_kalemleri (
  id               uuid primary key default gen_random_uuid(),
  talep_id         uuid not null references public.sa_talepler (id) on delete cascade,
  sira             int  not null default 1,
  ad               text not null,
  marka            text,
  model            text,
  siparis_kodu     text,
  adet             numeric,
  birim            text,
  urun_durumu      text not null default 'farketmez'
                     check (urun_durumu in ('yeni','ikinci_el_kabul','farketmez')),
  kapsam           text not null default 'farketmez'
                     check (kapsam in ('parca','komple','farketmez')),
  alternatif_kabul boolean not null default false,
  teknik_aciklama  text,
  ai_cikarim       jsonb,
  ai_durum         text not null default 'beklemede'
                     check (ai_durum in ('beklemede','dogrulandi')),
  notlar           text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

create index if not exists sa_talep_kalemleri_talep_idx
  on public.sa_talep_kalemleri (talep_id) where deleted_at is null;

drop trigger if exists trg_sa_talep_kalemleri_updated_at on public.sa_talep_kalemleri;
create trigger trg_sa_talep_kalemleri_updated_at before update on public.sa_talep_kalemleri
  for each row execute function public.set_updated_at();

alter table public.sa_talep_kalemleri enable row level security;
drop policy if exists "sa_talep_kalemleri sec" on public.sa_talep_kalemleri;
create policy "sa_talep_kalemleri sec" on public.sa_talep_kalemleri for select to authenticated using (deleted_at is null);
drop policy if exists "sa_talep_kalemleri ekle" on public.sa_talep_kalemleri;
create policy "sa_talep_kalemleri ekle" on public.sa_talep_kalemleri for insert to authenticated with check (true);
drop policy if exists "sa_talep_kalemleri guncelle" on public.sa_talep_kalemleri;
create policy "sa_talep_kalemleri guncelle" on public.sa_talep_kalemleri for update to authenticated using (true) with check (true);
