// -----------------------------------------------------------------------------
// VERİ KATMANI — Satın Alma / Gelen Teklifler (Supabase: public.sa_teklifler)
// Otomatik toplama teklif-topla route'u tarafından yapılır; burada okuma.
// -----------------------------------------------------------------------------

import type { Teklif, TeklifKaynak } from "@/lib/types/satinalma";
import { supabaseTarayici } from "@/lib/supabase/client";

type Satir = {
  id: string;
  talep_id: string;
  tedarikci_id: string | null;
  rfq_id: string | null;
  pdf_url: string | null;
  depolama_yolu: string | null;
  kaynak: string;
  fiyat: number | null;
  para_birimi: string | null;
  kdv_dahil: boolean | null;
  kdv_oran: number | null;
  termin_gun: number | null;
  nakliye: string | null;
  garanti_ay: number | null;
  teknik_uygun: boolean | null;
  teknik_not: string | null;
  notlar: string | null;
  ai_ozet: string | null;
  okunamadi: boolean | null;
  surum: number | null;
  gecerlilik: string | null;
  created_at: string;
};

const SECIM =
  "id, talep_id, tedarikci_id, rfq_id, pdf_url, depolama_yolu, kaynak, fiyat, para_birimi, kdv_dahil, kdv_oran, termin_gun, nakliye, garanti_ay, teknik_uygun, teknik_not, notlar, ai_ozet, okunamadi, surum, gecerlilik, created_at";

function modele(s: Satir): Teklif {
  return {
    id: s.id,
    talepId: s.talep_id,
    tedarikciId: s.tedarikci_id,
    rfqId: s.rfq_id,
    pdfUrl: s.pdf_url,
    depolamaYolu: s.depolama_yolu,
    kaynak: s.kaynak as TeklifKaynak,
    fiyat: s.fiyat,
    paraBirimi: s.para_birimi,
    kdvDahil: s.kdv_dahil,
    kdvOran: s.kdv_oran,
    terminGun: s.termin_gun,
    nakliye: s.nakliye,
    garantiAy: s.garanti_ay,
    teknikUygun: s.teknik_uygun,
    teknikNot: s.teknik_not,
    notlar: s.notlar,
    aiOzet: s.ai_ozet,
    okunamadi: !!s.okunamadi,
    surum: s.surum ?? 1,
    gecerlilik: s.gecerlilik,
    createdAt: s.created_at,
  };
}

export async function teklifListele(talepId: string): Promise<Teklif[]> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("sa_teklifler")
    .select(SECIM)
    .eq("talep_id", talepId)
    .is("deleted_at", null)
    .order("surum", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as Satir[]).map(modele);
}

export async function teklifSil(id: string): Promise<void> {
  const supabase = supabaseTarayici();
  const { error } = await supabase.from("sa_teklifler").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}
