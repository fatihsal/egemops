-- 0005_katsayilar.sql
-- Katsayılar (TEP / emisyon / fiyat / genel). Düzenlenebilir; değerler string olarak tutulur.
-- created_at/updated_at/deleted_at + RLS. Tohum verisi mevcut sabit değerlerle.

create table if not exists public.katsayilar (
  id          text primary key,
  grup        text not null check (grup in ('tep', 'emisyon', 'fiyat', 'genel')),
  ad          text not null,
  renk        text,
  birim       text,
  alt_isil    text,
  tep         text,
  referans    text,
  faktor      text,
  kapsam      text,
  fiyat       text,
  guncelleme  text,
  deger       text,
  aciklama    text,
  ikon        text,
  sinif       text,
  sira        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

drop trigger if exists trg_katsayilar_updated_at on public.katsayilar;
create trigger trg_katsayilar_updated_at
  before update on public.katsayilar
  for each row execute function public.set_updated_at();

alter table public.katsayilar enable row level security;

drop policy if exists "katsayilari gor" on public.katsayilar;
create policy "katsayilari gor" on public.katsayilar for select
  to authenticated using (deleted_at is null);

drop policy if exists "katsayi guncelle" on public.katsayilar;
create policy "katsayi guncelle" on public.katsayilar for update
  to authenticated using (true) with check (true);

drop policy if exists "katsayi ekle" on public.katsayilar;
create policy "katsayi ekle" on public.katsayilar for insert
  to authenticated with check (true);

-- Tohum verisi (yalnızca yoksa ekle)
insert into public.katsayilar (id, grup, ad, renk, birim, alt_isil, tep, referans, faktor, kapsam, fiyat, guncelleme, deger, aciklama, ikon, sinif, sira) values
  ('tep-elk','tep','Elektrik','#2563eb','MWh','860.000 kcal','0,0860 TEP','Enerji Verimliliği Tebliği',null,null,null,null,null,null,null,null,1),
  ('tep-dg','tep','Doğalgaz','#8b5cf6','1000 Sm³','8.250.000 kcal','0,8250 TEP','Enerji Verimliliği Tebliği',null,null,null,null,null,null,null,null,2),
  ('tep-mot','tep','Motorin','#f59e0b','ton','10.200.000 kcal','1,0200 TEP','Enerji Verimliliği Tebliği',null,null,null,null,null,null,null,null,3),
  ('tep-fo','tep','Fuel-Oil No.6','#f59e0b','ton','9.600.000 kcal','0,9600 TEP','Enerji Verimliliği Tebliği',null,null,null,null,null,null,null,null,4),
  ('tep-lpg','tep','LPG','#f59e0b','ton','11.000.000 kcal','1,1000 TEP','Enerji Verimliliği Tebliği',null,null,null,null,null,null,null,null,5),
  ('tep-tk','tep','Taş Kömürü','#64748b','ton','7.000.000 kcal','0,7000 TEP','TÜBİTAK MAM',null,null,null,null,null,null,null,null,6),
  ('tep-lin','tep','Linyit','#64748b','ton','2.500.000 kcal','0,2500 TEP','TÜBİTAK MAM',null,null,null,null,null,null,null,null,7),
  ('em-elk','emisyon','Elektrik (şebeke)','#2563eb','MWh',null,null,null,'442 kgCO₂e','Kapsam 2',null,null,null,null,null,null,1),
  ('em-dg','emisyon','Doğalgaz','#8b5cf6','1000 Sm³',null,null,null,'1.923 kgCO₂e','Kapsam 1',null,null,null,null,null,null,2),
  ('em-mot','emisyon','Motorin','#f59e0b','ton',null,null,null,'3.170 kgCO₂e','Kapsam 1',null,null,null,null,null,null,3),
  ('em-fo','emisyon','Fuel-Oil No.6','#f59e0b','ton',null,null,null,'3.130 kgCO₂e','Kapsam 1',null,null,null,null,null,null,4),
  ('em-lpg','emisyon','LPG','#f59e0b','ton',null,null,null,'2.985 kgCO₂e','Kapsam 1',null,null,null,null,null,null,5),
  ('em-tk','emisyon','Taş Kömürü','#64748b','ton',null,null,null,'2.420 kgCO₂e','Kapsam 1',null,null,null,null,null,null,6),
  ('fy-elk','fiyat','Elektrik','#2563eb','kWh',null,null,null,null,null,'2,45 TL','01.08.2026',null,null,null,null,1),
  ('fy-dg','fiyat','Doğalgaz','#8b5cf6','Sm³',null,null,null,null,null,'6,80 TL','01.08.2026',null,null,null,null,2),
  ('fy-mot','fiyat','Motorin','#f59e0b','lt',null,null,null,null,null,'44,50 TL','01.09.2026',null,null,null,null,3),
  ('fy-fo','fiyat','Fuel-Oil No.6','#f59e0b','ton',null,null,null,null,null,'28.500 TL','01.08.2026',null,null,null,null,4),
  ('fy-lpg','fiyat','LPG','#f59e0b','kg',null,null,null,null,null,'32,20 TL','01.09.2026',null,null,null,null,5),
  ('fy-su','fiyat','Su','#06b6d4','m³',null,null,null,null,null,'42,00 TL','01.07.2026',null,null,null,null,6),
  ('gp-baz','genel','Referans (Baz) Yıl',null,null,null,null,null,null,null,null,null,'2024','EnPI karşılaştırma yılı','solar:calendar-bold-duotone','bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300',1),
  ('gp-gun','genel','Yıllık Çalışma Günü',null,null,null,null,null,null,null,null,null,'330 gün','Üretim takvimi','solar:calendar-mark-bold-duotone','bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300',2),
  ('gp-vardiya','genel','Vardiya Sayısı',null,null,null,null,null,null,null,null,null,'3','Günlük vardiya','solar:clock-circle-bold-duotone','bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300',3),
  ('gp-saat','genel','Çalışma Saati / Yıl',null,null,null,null,null,null,null,null,null,'7.920 saat','Tam kapasite','solar:stopwatch-bold-duotone','bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300',4),
  ('gp-hedef','genel','Yıllık İyileşme Hedefi',null,null,null,null,null,null,null,null,null,'%10','EnPI azaltım hedefi','solar:target-bold-duotone','bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300',5),
  ('gp-karbon','genel','Karbon Gölge Fiyatı',null,null,null,null,null,null,null,null,null,'30 €/tCO₂e','Yatırım değerlendirme','solar:leaf-bold-duotone','bg-cyan-50 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300',6)
on conflict (id) do nothing;
