-- 0008_firsatlar.sql
-- Enerji Fırsatları. KPI/donut/vade özetleri bu listeden türetilir.
-- created_at/updated_at/deleted_at + RLS. Tohum: mevcut örnek fırsatlar.

create table if not exists public.firsatlar (
  id          uuid primary key default gen_random_uuid(),
  oncelik     text not null default 'orta' check (oncelik in ('yuksek', 'orta', 'dusuk')),
  ad          text not null,
  kaynak      text not null default 'elektrik' check (kaynak in ('elektrik', 'dogalgaz', 'akaryakit')),
  tasarruf    numeric not null default 0,  -- TEP/yıl
  yatirim     numeric not null default 0,  -- €
  geri_donus  numeric not null default 0,  -- yıl
  durum       text not null default 'fizibilite' check (durum in ('fizibilite', 'teklif', 'onaylandi', 'uygulama', 'tamamlandi')),
  ilerleme    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

drop trigger if exists trg_firsatlar_updated_at on public.firsatlar;
create trigger trg_firsatlar_updated_at
  before update on public.firsatlar
  for each row execute function public.set_updated_at();

alter table public.firsatlar enable row level security;

drop policy if exists "firsat_sec" on public.firsatlar;
create policy "firsat_sec" on public.firsatlar for select to authenticated using (deleted_at is null);
drop policy if exists "firsat_ekle" on public.firsatlar;
create policy "firsat_ekle" on public.firsatlar for insert to authenticated with check (true);
drop policy if exists "firsat_guncelle" on public.firsatlar;
create policy "firsat_guncelle" on public.firsatlar for update to authenticated using (true) with check (true);

-- Soft-delete (RLS'ten bağımsız, katsayilar deseniyle aynı)
create or replace function public.firsat_sil(p_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.firsatlar set deleted_at = now() where id = p_id;
$$;
grant execute on function public.firsat_sil(uuid) to authenticated;

-- Tohum (yalnızca tablo boşsa)
insert into public.firsatlar (oncelik, ad, kaynak, tasarruf, yatirim, geri_donus, durum, ilerleme)
select * from (values
  ('yuksek','Kompresör Odası Optimizasyonu','elektrik',68.5,420000,1.8,'uygulama',60),
  ('yuksek','Reküperatör Projesi','dogalgaz',52.3,650000,2.2,'fizibilite',20),
  ('orta','LED Aydınlatma Dönüşümü','elektrik',31.2,180000,1.6,'onaylandi',0),
  ('orta','Kazan Yanma Ayarı Optimizasyonu','dogalgaz',24.6,60000,0.9,'uygulama',40),
  ('dusuk','Hat İzolasyon İyileştirmesi','dogalgaz',18.7,95000,1.3,'teklif',10),
  ('orta','GES Kapasite Artışı','elektrik',14.5,280000,3.4,'teklif',5),
  ('orta','Frekans Konvertörü (VSD) Montajı','elektrik',12.8,150000,2.1,'fizibilite',15),
  ('orta','Atık Isı Geri Kazanımı','dogalgaz',10.4,210000,3.8,'fizibilite',10),
  ('dusuk','Elektrik Motoru IE4 Yenileme','elektrik',9.3,120000,2.6,'fizibilite',0),
  ('dusuk','Bina Yalıtımı','dogalgaz',8.1,175000,4.2,'fizibilite',0),
  ('dusuk','Fırın Brülör Yenileme','dogalgaz',7.6,90000,2.3,'teklif',5),
  ('dusuk','Kondens Geri Dönüşü','dogalgaz',6.9,45000,1.4,'fizibilite',0),
  ('dusuk','Basınçlı Hava Kaçak Onarımı','elektrik',6.2,18000,0.6,'tamamlandi',100),
  ('dusuk','Buhar Kapanı Bakımı','dogalgaz',5.8,25000,0.8,'uygulama',55),
  ('dusuk','Akaryakıt Filo Optimizasyonu','akaryakit',5.2,40000,1.5,'teklif',10),
  ('dusuk','Akıllı Aydınlatma Sensörleri','elektrik',4.7,32000,1.1,'onaylandi',0),
  ('dusuk','Jeneratör Verim İyileştirme','akaryakit',3.8,28000,1.9,'onaylandi',0),
  ('dusuk','Güç Faktörü Düzeltme','elektrik',3.4,22000,0.9,'tamamlandi',100)
) as v(oncelik, ad, kaynak, tasarruf, yatirim, geri_donus, durum, ilerleme)
where not exists (select 1 from public.firsatlar where deleted_at is null);
