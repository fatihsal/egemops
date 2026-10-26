-- -----------------------------------------------------------------------------
-- 0020 — Satın Alma: soft-delete + RLS düzeltmesi
-- SELECT politikası `using (deleted_at is null)` iken, soft-delete (deleted_at
-- yazan UPDATE) satırı görünmez yaptığı için RLS update'i reddediyordu
-- ("new row violates row-level security policy"). SELECT'i `using (true)` yapıyoruz;
-- silinmiş kayıtlar zaten tüm sorgularda `.is("deleted_at", null)` ile gizleniyor.
-- Tüm sa_ iş tablolarının politikalarını tutarlı biçimde yeniden kurar.
-- -----------------------------------------------------------------------------

do $$ declare t text; r record; begin
  foreach t in array array['sa_talepler','sa_tedarikciler','sa_rfq','sa_teklifler','sa_talep_kalemleri']
  loop
    for r in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I;', r.policyname, t);
    end loop;
    execute format('alter table public.%1$s enable row level security;', t);
    execute format('create policy "%1$s_sel" on public.%1$s for select to authenticated using (true);', t);
    execute format('create policy "%1$s_ins" on public.%1$s for insert to authenticated with check (true);', t);
    execute format('create policy "%1$s_upd" on public.%1$s for update to authenticated using (true) with check (true);', t);
  end loop;
end $$;
