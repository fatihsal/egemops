-- -----------------------------------------------------------------------------
-- 0014 — Akıllı Teknik Satın Alma modülü (MVP)
-- Tüm tablolar public şemada, 'sa_' önekli. created_at/updated_at/deleted_at +
-- soft delete + RLS. set_updated_at() fonksiyonu 0001'den gelir.
-- SQL Editor'de bir kerede çalıştırılabilir.
-- E-posta sağlayıcısından bağımsız tasarlandı (provider alanı metin).
-- -----------------------------------------------------------------------------

-- ======================= 1) MALZEME TALEPLERİ =======================
create table if not exists public.sa_talepler (
  id               uuid primary key default gen_random_uuid(),
  talep_no         text,
  baslik           text not null,
  marka            text,
  model            text,
  adet             numeric,
  birim            text,
  teknik_aciklama  text,
  foto_url         text[] not null default '{}',
  ai_cikarim       jsonb,
  ai_durum         text not null default 'beklemede'
                     check (ai_durum in ('beklemede', 'dogrulandi')),
  durum            text not null default 'taslak'
                     check (durum in ('taslak','kaynak_arama','rfq_gonderildi','teklif_toplama','karsilastirma','tamamlandi','iptal')),
  olusturan        uuid references auth.users (id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

create unique index if not exists sa_talepler_no_uniq
  on public.sa_talepler (talep_no) where deleted_at is null and talep_no is not null;
create index if not exists sa_talepler_durum_idx on public.sa_talepler (durum) where deleted_at is null;

-- ======================= 2) TEDARİKÇİLER =======================
-- kaynak_url ZORUNLU: her tedarikçi doğrulanabilir bir kaynağa dayanmalı (uydurma yok).
create table if not exists public.sa_tedarikciler (
  id               uuid primary key default gen_random_uuid(),
  ad               text not null,
  web_sitesi       text,
  eposta           text,
  telefon          text,
  ulke             text,
  kaynak_url       text not null,
  dogrulanmis      boolean not null default false,
  notlar           text,
  olusturan        uuid references auth.users (id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

create index if not exists sa_tedarikciler_ad_idx on public.sa_tedarikciler (ad) where deleted_at is null;

-- ======================= 3) RFQ (TEKLİF TALEPLERİ / GÖNDERİLEN E-POSTA) =======================
create table if not exists public.sa_rfq (
  id               uuid primary key default gen_random_uuid(),
  talep_id         uuid not null references public.sa_talepler (id) on delete cascade,
  tedarikci_id     uuid references public.sa_tedarikciler (id),
  konu             text,
  govde            text,
  alici_eposta     text,
  durum            text not null default 'taslak'
                     check (durum in ('taslak','onay_bekliyor','gonderildi','yanitlandi','iptal')),
  provider         text,              -- 'gmail' | 'microsoft' (sağlayıcıdan bağımsız)
  message_id       text,              -- sağlayıcı mesaj kimliği
  onaylayan        uuid references auth.users (id),
  gonderildi_at    timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

create index if not exists sa_rfq_talep_idx on public.sa_rfq (talep_id) where deleted_at is null;

-- ======================= 4) GELEN TEKLİFLER =======================
create table if not exists public.sa_teklifler (
  id               uuid primary key default gen_random_uuid(),
  talep_id         uuid not null references public.sa_talepler (id) on delete cascade,
  tedarikci_id     uuid references public.sa_tedarikciler (id),
  rfq_id           uuid references public.sa_rfq (id),
  pdf_url          text,
  depolama_yolu    text,
  kaynak           text not null default 'manuel' check (kaynak in ('gmail','manuel')),
  fiyat            numeric,
  para_birimi      text,              -- 'TRY' | 'USD' | 'EUR' ...
  kdv_dahil        boolean,
  kdv_oran         numeric,
  termin_gun       int,
  nakliye          text,
  garanti_ay       int,
  teknik_uygun     boolean,
  teknik_not       text,
  notlar           text,
  yukleyen         uuid references auth.users (id),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

create index if not exists sa_teklifler_talep_idx on public.sa_teklifler (talep_id) where deleted_at is null;

-- ======================= 5) MAIL HESAPLARI (OAuth TOKEN — GİZLİ) =======================
-- Token'lar YALNIZCA güvenli backend'den (service_role) erişilir. authenticated
-- kullanıcıya hiçbir policy verilmez → RLS açık + policy yok = erişim yok.
create table if not exists public.sa_mail_hesaplari (
  id               uuid primary key default gen_random_uuid(),
  kullanici_id     uuid not null references auth.users (id) on delete cascade,
  provider         text not null check (provider in ('gmail','microsoft')),
  eposta           text,
  access_token     text,
  refresh_token    text,
  token_tipi       text,
  scope            text,
  expiry           timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create unique index if not exists sa_mail_hesaplari_uniq
  on public.sa_mail_hesaplari (kullanici_id, provider);

-- ======================= 6) MAIL GÖNDERİM LOGU =======================
create table if not exists public.sa_mail_log (
  id               uuid primary key default gen_random_uuid(),
  rfq_id           uuid references public.sa_rfq (id) on delete set null,
  provider         text,
  message_id       text,
  durum            text,              -- 'gonderildi' | 'hata'
  hata             text,
  created_at       timestamptz not null default now()
);

-- ======================= updated_at TETİKLEYİCİLERİ =======================
do $$
declare t text;
begin
  foreach t in array array['sa_talepler','sa_tedarikciler','sa_rfq','sa_teklifler','sa_mail_hesaplari']
  loop
    execute format('drop trigger if exists trg_%1$s_updated_at on public.%1$s;', t);
    execute format('create trigger trg_%1$s_updated_at before update on public.%1$s for each row execute function public.set_updated_at();', t);
  end loop;
end $$;

-- ======================= RLS =======================
-- İş tabloları: giriş yapan herkes okur/yazar; yalnızca silinmemiş kayıtlar görünür.
do $$
declare t text;
begin
  foreach t in array array['sa_talepler','sa_tedarikciler','sa_rfq','sa_teklifler']
  loop
    execute format('alter table public.%1$s enable row level security;', t);
    execute format('drop policy if exists "%1$s sec" on public.%1$s;', t);
    execute format('create policy "%1$s sec" on public.%1$s for select to authenticated using (deleted_at is null);', t);
    execute format('drop policy if exists "%1$s ekle" on public.%1$s;', t);
    execute format('create policy "%1$s ekle" on public.%1$s for insert to authenticated with check (true);', t);
    execute format('drop policy if exists "%1$s guncelle" on public.%1$s;', t);
    execute format('create policy "%1$s guncelle" on public.%1$s for update to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- mail_log: giriş yapan okur; yazma backend (service_role) üzerinden.
alter table public.sa_mail_log enable row level security;
drop policy if exists "sa_mail_log gor" on public.sa_mail_log;
create policy "sa_mail_log gor" on public.sa_mail_log for select to authenticated using (true);

-- mail_hesaplari: RLS açık, authenticated'a POLICY YOK → yalnızca service_role erişir.
alter table public.sa_mail_hesaplari enable row level security;
