-- -----------------------------------------------------------------------------
-- 0013 — Yeni kullanıcı rolü: Bakım Müdürü
-- kullanici_rolu enum'una 'bakim_muduru' değeri eklenir.
-- Not: ALTER TYPE ... ADD VALUE transaction bloğu içinde çalışmaz; tek başına
--      (ayrı statement olarak) çalıştırılmalıdır.
-- -----------------------------------------------------------------------------

alter type public.kullanici_rolu add value if not exists 'bakim_muduru';
