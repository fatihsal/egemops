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
  created_at: string;
};

const SECIM = "id, ad, web_sitesi, eposta, telefon, ulke, kaynak_url, dogrulanmis, notlar, created_at";

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
};

export async function tedarikciOlustur(girdi: TedarikciOlusturGirdi): Promise<string> {
  if (!girdi.kaynakUrl?.trim()) throw new Error("Tedarikçi için doğrulanabilir bir kaynak URL'i zorunludur.");
  const supabase = supabaseTarayici();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("sa_tedarikciler")
    .insert({
      ad: girdi.ad,
      kaynak_url: girdi.kaynakUrl,
      web_sitesi: girdi.webSitesi ?? null,
      eposta: girdi.eposta ?? null,
      telefon: girdi.telefon ?? null,
      ulke: girdi.ulke ?? null,
      dogrulanmis: girdi.dogrulanmis ?? false,
      notlar: girdi.notlar ?? null,
      olusturan: user?.id ?? null,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return (data as { id: string }).id;
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
