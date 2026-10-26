// -----------------------------------------------------------------------------
// VERİ KATMANI — Satın Alma / Tedarikçiler (Supabase: public.sa_tedarikciler)
// kaynak_url ZORUNLU — doğrulanabilir kaynağı olmayan tedarikçi kaydedilemez.
// -----------------------------------------------------------------------------

import type { Tedarikci } from "@/lib/types/satinalma";
import { supabaseTarayici } from "@/lib/supabase/client";

type Satir = {
  id: string;
  ad: string;
  web_sitesi: string | null;
  eposta: string | null;
  telefon: string | null;
  ulke: string | null;
  kaynak_url: string;
  dogrulanmis: boolean;
  notlar: string | null;
  kategoriler: string[] | null;
  created_at: string;
};

const SECIM = "id, ad, web_sitesi, eposta, telefon, ulke, kaynak_url, dogrulanmis, notlar, kategoriler, created_at";

function modele(s: Satir): Tedarikci {
  return {
    id: s.id,
    ad: s.ad,
    webSitesi: s.web_sitesi,
    eposta: s.eposta,
    telefon: s.telefon,
    ulke: s.ulke,
    kaynakUrl: s.kaynak_url,
    dogrulanmis: s.dogrulanmis,
    notlar: s.notlar,
    kategoriler: s.kategoriler ?? [],
    createdAt: s.created_at,
  };
}

export async function tedarikcilerGetir(): Promise<Tedarikci[]> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("sa_tedarikciler")
    .select(SECIM)
    .is("deleted_at", null)
    .order("ad", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as Satir[]).map(modele);
}

export type TedarikciOlusturGirdi = {
  ad: string;
  kaynakUrl: string; // zorunlu
  webSitesi?: string | null;
  eposta?: string | null;
  telefon?: string | null;
  ulke?: string | null;
  dogrulanmis?: boolean;
  notlar?: string | null;
  kategoriler?: string[];
};

export async function tedarikciOlustur(girdi: TedarikciOlusturGirdi): Promise<string> {
  // İzlenebilirlik: kaynak URL yoksa web sitesine, o da yoksa "manuel-giris"e düş.
  const kaynak = girdi.kaynakUrl?.trim() || girdi.webSitesi?.trim() || "manuel-giris";
  const supabase = supabaseTarayici();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("sa_tedarikciler")
    .insert({
      ad: girdi.ad,
      kaynak_url: kaynak,
      web_sitesi: girdi.webSitesi ?? null,
      eposta: girdi.eposta ?? null,
      telefon: girdi.telefon ?? null,
      ulke: girdi.ulke ?? null,
      dogrulanmis: girdi.dogrulanmis ?? false,
      notlar: girdi.notlar ?? null,
      kategoriler: girdi.kategoriler ?? [],
      olusturan: user?.id ?? null,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return (data as { id: string }).id;
}

export type TedarikciGuncelleGirdi = Partial<{
  ad: string; webSitesi: string | null; eposta: string | null; telefon: string | null;
  ulke: string | null; kaynakUrl: string; dogrulanmis: boolean; notlar: string | null; kategoriler: string[];
}>;

export async function tedarikciGuncelle(id: string, g: TedarikciGuncelleGirdi): Promise<void> {
  const supabase = supabaseTarayici();
  const o: Record<string, unknown> = {};
  if (g.ad !== undefined) o.ad = g.ad;
  if (g.webSitesi !== undefined) o.web_sitesi = g.webSitesi;
  if (g.eposta !== undefined) o.eposta = g.eposta;
  if (g.telefon !== undefined) o.telefon = g.telefon;
  if (g.ulke !== undefined) o.ulke = g.ulke;
  if (g.kaynakUrl !== undefined) o.kaynak_url = g.kaynakUrl;
  if (g.dogrulanmis !== undefined) o.dogrulanmis = g.dogrulanmis;
  if (g.notlar !== undefined) o.notlar = g.notlar;
  if (g.kategoriler !== undefined) o.kategoriler = g.kategoriler;
  const { error } = await supabase.from("sa_tedarikciler").update(o).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function tedarikciDogrulamaAyarla(id: string, deger: boolean): Promise<void> {
  const supabase = supabaseTarayici();
  const { error } = await supabase.from("sa_tedarikciler").update({ dogrulanmis: deger }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function tedarikciSil(id: string): Promise<void> {
  const supabase = supabaseTarayici();
  const { error } = await supabase.from("sa_tedarikciler").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}
