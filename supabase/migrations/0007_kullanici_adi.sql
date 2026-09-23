-- 0007_kullanici_adi.sql
-- Kullanıcı adı ile giriş: profiles.kullanici_adi + kullanıcı adından e-posta bulan RPC.

alter table public.profiles
  add column if not exists kullanici_adi text;

-- Benzersiz kullanıcı adı (silinmemişler arasında, büyük/küçük harf duyarsız)
create unique index if not exists profiles_kullanici_adi_uniq
  on public.profiles (lower(kullanici_adi))
  where kullanici_adi is not null and deleted_at is null;

-- Girişte kullanıcı adından e-postayı bul (anon çağırabilir; sadece e-posta döner).
create or replace function public.eposta_bul(p_kullanici_adi text)
returns text
language sql
security definer
set search_path = public
as $$
  select eposta from public.profiles
  where lower(kullanici_adi) = lower(p_kullanici_adi) and deleted_at is null
  limit 1;
$$;

grant execute on function public.eposta_bul(text) to anon, authenticated;

-- Mevcut admin için kullanıcı adı ata (login test edebilmek için).
update public.profiles set kullanici_adi = 'admin'
  where eposta = 'by.fatihsal@gmail.com' and kullanici_adi is null;
