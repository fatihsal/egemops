-- 0009_projeler.sql
-- Enerji Projeleri. KPI/gantt/bütçe/aşama özetleri bu listeden türetilir.
-- created_at/updated_at/deleted_at + RLS. Tohum: mevcut örnek projeler.

create table if not exists public.projeler (
  id                   uuid primary key default gen_random_uuid(),
  ad                   text not null,
  aciklama             text,
  kaynak               text not null default 'elektrik' check (kaynak in ('elektrik', 'dogalgaz', 'akaryakit')),
  durum                text not null default 'planlama' check (durum in ('planlama', 'muhendislik', 'satinAlma', 'uygulama', 'devreyeAlma', 'tamamlandi')),
  ilerleme             int not null default 0,
  baslangic            date,
  hedef_bitis          date,
  sorumlu              text,
  butce                numeric not null default 0,
  harcanan             numeric not null default 0,
  beklenen_tasarruf    numeric not null default 0,
  dogrulanan_tasarruf  numeric,
  geri_donus           numeric not null default 0,
  saglik_zaman         text not null default 'yok' check (saglik_zaman in ('yesil', 'amber', 'kirmizi', 'yok')),
  saglik_butce         text not null default 'yok' check (saglik_butce in ('yesil', 'amber', 'kirmizi', 'yok')),
  saglik_tasarruf      text not null default 'yok' check (saglik_tasarruf in ('yesil', 'amber', 'kirmizi', 'yok')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  deleted_at           timestamptz
);

drop trigger if exists trg_projeler_updated_at on public.projeler;
create trigger trg_projeler_updated_at
  before update on public.projeler
  for each row execute function public.set_updated_at();

alter table public.projeler enable row level security;

drop policy if exists "proje_sec" on public.projeler;
create policy "proje_sec" on public.projeler for select to authenticated using (deleted_at is null);
drop policy if exists "proje_ekle" on public.projeler;
create policy "proje_ekle" on public.projeler for insert to authenticated with check (true);
drop policy if exists "proje_guncelle" on public.projeler;
create policy "proje_guncelle" on public.projeler for update to authenticated using (true) with check (true);

create or replace function public.proje_sil(p_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.projeler set deleted_at = now() where id = p_id;
$$;
grant execute on function public.proje_sil(uuid) to authenticated;

insert into public.projeler
  (ad, aciklama, kaynak, durum, ilerleme, baslangic, hedef_bitis, sorumlu, butce, harcanan, beklenen_tasarruf, dogrulanan_tasarruf, geri_donus, saglik_zaman, saglik_butce, saglik_tasarruf)
select * from (values
  ('Kompresör Odası Optimizer','Kompresör Odası İyileştirmesi','elektrik','uygulama',62,date '2026-09-15',date '2026-12-15','Bakım Onarım',1200000,720000,24.5,null::numeric,1.6,'yesil','yesil','yesil'),
  ('EAE LED Dönüşümü','LED Aydınlatma Dönüşüm Projesi','elektrik','satinAlma',45,date '2026-10-01',date '2027-01-31','Bakım Onarım',850000,300000,10.0,null::numeric,2.1,'yesil','amber','yok'),
  ('Reküperatör Projesi','Atık Isı Geri Kazanım Sistemi','dogalgaz','muhendislik',25,date '2026-08-12',date '2027-04-30','Enerji Ekibi',1450000,650000,18.0,null::numeric,2.4,'amber','yesil','yok'),
  ('Motor VFD Uygulaması','Değişken Hızlı Sürücü Montajı','elektrik','uygulama',70,date '2026-07-10',date '2026-11-30','Bakım Onarım',650000,450000,12.0,7.2,1.2,'yesil','yesil','yesil'),
  ('Kazan Yanma Ayarı','Yanma Verimi Optimizasyonu','dogalgaz','devreyeAlma',90,date '2026-06-05',date '2026-09-15','Enerji Ekibi',700000,580000,7.9,6.4,0.9,'yesil','yesil','yesil')
) as v(ad, aciklama, kaynak, durum, ilerleme, baslangic, hedef_bitis, sorumlu, butce, harcanan, beklenen_tasarruf, dogrulanan_tasarruf, geri_donus, saglik_zaman, saglik_butce, saglik_tasarruf)
where not exists (select 1 from public.projeler where deleted_at is null);
