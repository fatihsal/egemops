-- 0011_demo_veri.sql
-- SUNUM İÇİN ZENGİN DEMO VERİSİ. enerji_kayitlari'nı 2019-2026 mevsimsel +
-- trendli veriyle doldurur. DİKKAT: mevcut tüm enerji_kayitlari silinir.
-- Gerçek kullanıma geçerken bu veriyi temizleyin.

delete from public.enerji_kayitlari;

with hesap as (
  select
    y, m,
    (y - 2019) as yi,
    (1 + 0.035 * (y - 2019)) as prodY,   -- üretim büyümesi
    (1 - 0.030 * (y - 2019)) as effY,    -- verimlilik iyileşmesi
    (1 + 0.180 * (y - 2019)) as gesY,    -- GES kapasite artışı
    (array[1.08,1.06,1.00,0.95,0.98,1.05,1.12,1.14,1.04,0.97,1.00,1.07])[m] as elecS,
    (array[1.90,1.80,1.40,1.00,0.60,0.35,0.25,0.25,0.40,0.90,1.50,1.85])[m] as gasS,
    (array[0.45,0.60,0.85,1.05,1.25,1.40,1.45,1.35,1.10,0.80,0.55,0.40])[m] as gesS,
    (array[1.00,0.98,1.02,1.03,1.05,1.00,0.90,0.75,1.05,1.08,1.04,0.95])[m] as prodS,
    (1 + (random() - 0.5) * 0.05) as g
  from generate_series(2019, 2026) y, generate_series(1, 12) m
  where not (y = 2026 and m > 9)   -- 2026 yalnızca Ocak-Eylül
)
insert into public.enerji_kayitlari
  (yil, ay, sebeke_elektrik, ges_toplam_uretim, ges_oz_tuketim, sebekeye_verilen, dogalgaz, motorin, benzin, diger_akaryakit, uretim_ton, durum)
select
  y, m,
  round(780000 * prodY * effY * elecS * g - 150000 * gesY * gesS * g * 0.82)::numeric,  -- sebeke elektrik
  round(150000 * gesY * gesS * g)::numeric,            -- GES toplam üretim
  round(150000 * gesY * gesS * g * 0.82)::numeric,     -- GES öz tüketim
  round(150000 * gesY * gesS * g * 0.18)::numeric,     -- şebekeye verilen
  round(45000 * prodY * effY * gasS * g)::numeric,     -- doğalgaz
  round(1400 * prodY * prodS * g)::numeric,            -- motorin
  round(170 * prodY * g)::numeric,                     -- benzin
  round(35 * prodY * g)::numeric,                      -- diğer akaryakıt
  round(2600 * prodY * prodS * g)::numeric,            -- üretim (ton)
  case when y = 2026 and m >= 8 then 'taslak' else 'onayli' end
from hesap;
