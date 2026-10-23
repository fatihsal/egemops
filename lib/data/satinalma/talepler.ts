// -----------------------------------------------------------------------------
// VERİ KATMANI — Satın Alma / Malzeme Talepleri (Supabase: public.sa_talepler)
// -----------------------------------------------------------------------------

import type { AiCikarim, AiDurum, Talep, TalepDurum } from "@/lib/types/satinalma";
import { supabaseTarayici } from "@/lib/supabase/client";

type Satir = {
  id: string;
  talep_no: string | null;
  baslik: string;
  marka: string | null;
  model: string | null;
  adet: number | null;
  birim: string | null;
  teknik_aciklama: string | null;
  foto_url: string[] | null;
  ai_cikarim: AiCikarim | null;
  ai_durum: string;
  durum: string;
  olusturan: string | null;
  created_at: string;
  updated_at: string;
};

const SECIM =
  "id, talep_no, baslik, marka, model, adet, birim, teknik_aciklama, foto_url, ai_cikarim, ai_durum, durum, olusturan, created_at, updated_at";

function modele(s: Satir, isimAl: (id: string | null) => string): Talep {
  return {
    id: s.id,
    talepNo: s.talep_no,
    baslik: s.baslik,
    marka: s.marka,
    model: s.model,
    adet: s.adet,
    birim: s.birim,
    teknikAciklama: s.teknik_aciklama,
    fotoUrl: s.foto_url ?? [],
    aiCikarim: s.ai_cikarim,
    aiDurum: s.ai_durum as AiDurum,
    durum: s.durum as TalepDurum,
    olusturan: s.olusturan,
    olusturanAd: isimAl(s.olusturan),
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  };
}

async function isimHaritasi() {
  const supabase = supabaseTarayici();
  const { data } = await supabase.from("profiles").select("id, ad_soyad, eposta").is("deleted_at", null);
  const harita = new Map<string, string>();
  for (const p of (data ?? []) as { id: string; ad_soyad: string | null; eposta: string | null }[]) {
    harita.set(p.id, p.ad_soyad ?? p.eposta ?? "—");
  }
  return (id: string | null) => (id ? harita.get(id) ?? "—" : "—");
}

export async function taleplerGetir(): Promise<Talep[]> {
  const supabase = supabaseTarayici();
  const [{ data, error }, isimAl] = await Promise.all([
    supabase.from("sa_talepler").select(SECIM).is("deleted_at", null).order("created_at", { ascending: false }),
    isimHaritasi(),
  ]);
  if (error) throw new Error(error.message);
  return ((data ?? []) as Satir[]).map((s) => modele(s, isimAl));
}

export async function talepGetir(id: string): Promise<Talep | null> {
  const supabase = supabaseTarayici();
  const [{ data, error }, isimAl] = await Promise.all([
    supabase.from("sa_talepler").select(SECIM).eq("id", id).is("deleted_at", null).maybeSingle(),
    isimHaritasi(),
  ]);
  if (error) throw new Error(error.message);
  return data ? modele(data as Satir, isimAl) : null;
}

export type TalepOlusturGirdi = {
  baslik: string;
  marka?: string | null;
  model?: string | null;
  adet?: number | null;
  birim?: string | null;
  teknikAciklama?: string | null;
  fotoUrl?: string[];
  aiCikarim?: AiCikarim | null;
  aiDurum?: AiDurum;
};

/** Yıl bazlı sıralı talep numarası (ST-YYYY-####). */
async function yeniTalepNo(): Promise<string> {
  const supabase = supabaseTarayici();
  const yil = new Date().getFullYear();
  const { count } = await supabase
    .from("sa_talepler")
    .select("id", { count: "exact", head: true })
    .gte("created_at", `${yil}-01-01`);
  const sira = String((count ?? 0) + 1).padStart(4, "0");
  return `ST-${yil}-${sira}`;
}

export async function talepOlustur(girdi: TalepOlusturGirdi): Promise<string> {
  const supabase = supabaseTarayici();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const talep_no = await yeniTalepNo();
  const { data, error } = await supabase
    .from("sa_talepler")
    .insert({
      talep_no,
      baslik: girdi.baslik,
      marka: girdi.marka ?? null,
      model: girdi.model ?? null,
      adet: girdi.adet ?? null,
      birim: girdi.birim ?? null,
      teknik_aciklama: girdi.teknikAciklama ?? null,
      foto_url: girdi.fotoUrl ?? [],
      ai_cikarim: girdi.aiCikarim ?? null,
      ai_durum: girdi.aiDurum ?? "beklemede",
      olusturan: user?.id ?? null,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return (data as { id: string }).id;
}

export async function talepGuncelle(
  id: string,
  alanlar: Partial<{ baslik: string; marka: string | null; model: string | null; adet: number | null; birim: string | null; teknikAciklama: string | null; fotoUrl: string[]; aiCikarim: AiCikarim | null; aiDurum: AiDurum; durum: TalepDurum }>,
): Promise<void> {
  const supabase = supabaseTarayici();
  const g: Record<string, unknown> = {};
  if (alanlar.baslik !== undefined) g.baslik = alanlar.baslik;
  if (alanlar.marka !== undefined) g.marka = alanlar.marka;
  if (alanlar.model !== undefined) g.model = alanlar.model;
  if (alanlar.adet !== undefined) g.adet = alanlar.adet;
  if (alanlar.birim !== undefined) g.birim = alanlar.birim;
  if (alanlar.teknikAciklama !== undefined) g.teknik_aciklama = alanlar.teknikAciklama;
  if (alanlar.fotoUrl !== undefined) g.foto_url = alanlar.fotoUrl;
  if (alanlar.aiCikarim !== undefined) g.ai_cikarim = alanlar.aiCikarim;
  if (alanlar.aiDurum !== undefined) g.ai_durum = alanlar.aiDurum;
  if (alanlar.durum !== undefined) g.durum = alanlar.durum;
  const { error } = await supabase.from("sa_talepler").update(g).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function talepSil(id: string): Promise<void> {
  const supabase = supabaseTarayici();
  const { error } = await supabase.from("sa_talepler").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}
