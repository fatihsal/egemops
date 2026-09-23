-- 0006_katsayi_sil_fn.sql
-- Katsayı soft-delete'i RLS'ten bağımsız SECURITY DEFINER fonksiyonla yapar.

create or replace function public.katsayi_sil(p_id text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.katsayilar set deleted_at = now() where id = p_id;
$$;

grant execute on function public.katsayi_sil(text) to authenticated;
