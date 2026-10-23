// -----------------------------------------------------------------------------
// VERİ KATMANI — Satın Alma / Talep Kalemleri (Supabase: public.sa_talep_kalemleri)
// Bir talepte birden fazla ürün kalemi.
// -----------------------------------------------------------------------------

import type { AiCikarim, AiDurum, Kapsam, TalepKalem, UrunDurumu } from "@/lib/types/satinalma";
import { supabaseTarayici } from "@/lib/supabase/client";

type Satir = {
  id: string;
  talep_id: string;
  sira: number;
  ad: string;
  marka: string | null;
  model: string | null;
  siparis_kodu: string | null;
  adet: number | null;
  birim: string | null;
  urun_durumu: string;
  kapsam: string;
  alternatif_kabul: boolean;
  teknik_aciklama: string | null;
  ai_cikarim: AiCikarim | null;
  ai_durum: string;
  notlar: string | null;
  created_at: string;
};

const SECIM =
  "id, talep_id, sira, ad, marka, model, siparis_kodu, adet, birim, urun_durumu, kapsam, alternatif_kabul, teknik_aciklama, ai_cikarim, ai_durum, notlar, created_at";

function modele(s: Satir): TalepKalem {
  return {
    id: s.id,
    talepId: s.talep_id,
    sira: s.sira,
    ad: s.ad,
    marka: s.marka,
    model: s.model,
    siparisKodu: s.siparis_kodu,
    adet: s.adet,
    birim: s.birim,
    urunDurumu: s.urun_durumu as UrunDurumu,
    kapsam: s.kapsam as Kapsam,
    alternatifKabul: s.alternatif_kabul,
    teknikAciklama: s.teknik_aciklama,
    aiCikarim: s.ai_cikarim,
    aiDurum: s.ai_durum as AiDurum,
    notlar: s.notlar,
    createdAt: s.created_at,
  };
}

export async function kalemListele(talepId: string): Promise<TalepKalem[]> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("sa_talep_kalemleri")
    .select(SECIM)
    .eq("talep_id", talepId)
    .is("deleted_at", null)
    .order("sira", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as Satir[]).map(modele);
}

/** Birden fazla talep için kalem sayıları (liste önizlemesi). */
export async function kalemSayilari(talepIdler: string[]): Promise<Map<string, number>> {
  const harita = new Map<string, number>();
  if (talepIdler.length === 0) return harita;
  const supabase = supabaseTarayici();
  const { data } = await supabase
    .from("sa_talep_kalemleri")
    .select("talep_id")
    .in("talep_id", talepIdler)
    .is("deleted_at", null);
  for (const r of (data ?? []) as { talep_id: string }[]) {
    harita.set(r.talep_id, (harita.get(r.talep_id) ?? 0) + 1);
  }
  return harita;
}

export type KalemGirdi = {
  ad: string;
  marka?: string | null;
  model?: string | null;
  siparisKodu?: string | null;
  adet?: number | null;
  birim?: string | null;
  urunDurumu?: UrunDurumu;
  kapsam?: Kapsam;
  alternatifKabul?: boolean;
  teknikAciklama?: string | null;
  aiCikarim?: AiCikarim | null;
  aiDurum?: AiDurum;
  notlar?: string | null;
};

function govdeHazirla(talepId: string | null, g: KalemGirdi, sira?: number) {
  const o: Record<string, unknown> = {
    ad: g.ad,
    marka: g.marka ?? null,
    model: g.model ?? null,
    siparis_kodu: g.siparisKodu ?? null,
    adet: g.adet ?? null,
    birim: g.birim ?? null,
    urun_durumu: g.urunDurumu ?? "farketmez",
    kapsam: g.kapsam ?? "farketmez",
    alternatif_kabul: g.alternatifKabul ?? false,
    teknik_aciklama: g.teknikAciklama ?? null,
    ai_cikarim: g.aiCikarim ?? null,
    ai_durum: g.aiDurum ?? "beklemede",
    notlar: g.notlar ?? null,
  };
  if (talepId) o.talep_id = talepId;
  if (sira != null) o.sira = sira;
  return o;
}

export async function kalemEkle(talepId: string, g: KalemGirdi, sira = 1): Promise<string> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("sa_talep_kalemleri")
    .insert(govdeHazirla(talepId, g, sira))
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return (data as { id: string }).id;
}

/** Yeni talep için birden çok kalemi tek seferde ekler. */
export async function kalemleriEkle(talepId: string, kalemler: KalemGirdi[]): Promise<void> {
  if (kalemler.length === 0) return;
  const supabase = supabaseTarayici();
  const govdeler = kalemler.map((k, i) => govdeHazirla(talepId, k, i + 1));
  const { error } = await supabase.from("sa_talep_kalemleri").insert(govdeler);
  if (error) throw new Error(error.message);
}

export async function kalemGuncelle(id: string, g: Partial<KalemGirdi>): Promise<void> {
  const supabase = supabaseTarayici();
  const o: Record<string, unknown> = {};
  if (g.ad !== undefined) o.ad = g.ad;
  if (g.marka !== undefined) o.marka = g.marka;
  if (g.model !== undefined) o.model = g.model;
  if (g.siparisKodu !== undefined) o.siparis_kodu = g.siparisKodu;
  if (g.adet !== undefined) o.adet = g.adet;
  if (g.birim !== undefined) o.birim = g.birim;
  if (g.urunDurumu !== undefined) o.urun_durumu = g.urunDurumu;
  if (g.kapsam !== undefined) o.kapsam = g.kapsam;
  if (g.alternatifKabul !== undefined) o.alternatif_kabul = g.alternatifKabul;
  if (g.teknikAciklama !== undefined) o.teknik_aciklama = g.teknikAciklama;
  if (g.aiCikarim !== undefined) o.ai_cikarim = g.aiCikarim;
  if (g.aiDurum !== undefined) o.ai_durum = g.aiDurum;
  if (g.notlar !== undefined) o.notlar = g.notlar;
  const { error } = await supabase.from("sa_talep_kalemleri").update(o).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function kalemSil(id: string): Promise<void> {
  const supabase = supabaseTarayici();
  const { error } = await supabase.from("sa_talep_kalemleri").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}
