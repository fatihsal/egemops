// sa_mail_hesaplari erişimi — YALNIZCA service_role (RLS policy yok).
// Token'lar şifreli saklanır (lib/satinalma/kripto). SADECE SUNUCU.

import { supabaseAdmin } from "@/lib/supabase/admin";
import { sifrele, coz } from "@/lib/satinalma/kripto";

export interface MailHesabi {
  eposta: string | null;
  accessToken: string;
  refreshToken: string | null;
  scope: string | null;
  expiry: string | null;
}

export async function hesapKaydet(
  kullaniciId: string,
  p: { eposta?: string | null; accessToken: string; refreshToken?: string | null; tokenTipi?: string | null; scope?: string | null; expiry?: string | null },
): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db.from("sa_mail_hesaplari").upsert(
    {
      kullanici_id: kullaniciId,
      provider: "gmail",
      eposta: p.eposta ?? null,
      access_token: sifrele(p.accessToken),
      refresh_token: p.refreshToken ? sifrele(p.refreshToken) : null,
      token_tipi: p.tokenTipi ?? null,
      scope: p.scope ?? null,
      expiry: p.expiry ?? null,
    },
    { onConflict: "kullanici_id,provider" },
  );
  if (error) throw new Error(error.message);
}

export async function hesapGetir(kullaniciId: string): Promise<MailHesabi | null> {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("sa_mail_hesaplari")
    .select("eposta, access_token, refresh_token, scope, expiry")
    .eq("kullanici_id", kullaniciId)
    .eq("provider", "gmail")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || !data.access_token) return null;
  return {
    eposta: data.eposta,
    accessToken: coz(data.access_token),
    refreshToken: data.refresh_token ? coz(data.refresh_token) : null,
    scope: data.scope,
    expiry: data.expiry,
  };
}

/** Token çözmeden sadece bağlantı durumu (durum ekranı için). */
export async function hesapDurumGetir(kullaniciId: string): Promise<{ bagli: boolean; eposta: string | null }> {
  const db = supabaseAdmin();
  const { data } = await db
    .from("sa_mail_hesaplari")
    .select("eposta, access_token")
    .eq("kullanici_id", kullaniciId)
    .eq("provider", "gmail")
    .maybeSingle();
  return { bagli: !!data?.access_token, eposta: data?.eposta ?? null };
}

export async function hesapAccessGuncelle(kullaniciId: string, accessToken: string, expiryIso: string): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db
    .from("sa_mail_hesaplari")
    .update({ access_token: sifrele(accessToken), expiry: expiryIso })
    .eq("kullanici_id", kullaniciId)
    .eq("provider", "gmail");
  if (error) throw new Error(error.message);
}

export async function hesapSil(kullaniciId: string): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db
    .from("sa_mail_hesaplari")
    .delete()
    .eq("kullanici_id", kullaniciId)
    .eq("provider", "gmail");
  if (error) throw new Error(error.message);
}
