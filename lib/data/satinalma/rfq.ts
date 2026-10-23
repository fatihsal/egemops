// -----------------------------------------------------------------------------
// VERİ KATMANI — Satın Alma / RFQ (teklif talepleri) — Supabase: public.sa_rfq
// Faz 5: taslak oluşturma + onay akışı. Gönderim Faz 6'da (Gmail) eklenecek.
// -----------------------------------------------------------------------------

import type { Rfq, RfqDurum } from "@/lib/types/satinalma";
import { supabaseTarayici } from "@/lib/supabase/client";

type Satir = {
  id: string;
  talep_id: string;
  tedarikci_id: string | null;
  konu: string | null;
  govde: string | null;
  alici_eposta: string | null;
  durum: string;
  provider: string | null;
  message_id: string | null;
  gonderildi_at: string | null;
  created_at: string;
};

const SECIM = "id, talep_id, tedarikci_id, konu, govde, alici_eposta, durum, provider, message_id, gonderildi_at, created_at";

function modele(s: Satir): Rfq {
  return {
    id: s.id,
    talepId: s.talep_id,
    tedarikciId: s.tedarikci_id,
    konu: s.konu,
    govde: s.govde,
    aliciEposta: s.alici_eposta,
    durum: s.durum as RfqDurum,
    provider: s.provider,
    messageId: s.message_id,
    gonderildiAt: s.gonderildi_at,
    createdAt: s.created_at,
  };
}

export async function rfqListele(talepId: string): Promise<Rfq[]> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("sa_rfq")
    .select(SECIM)
    .eq("talep_id", talepId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as Satir[]).map(modele);
}

export type RfqOlusturGirdi = {
  talepId: string;
  tedarikciId?: string | null;
  konu: string;
  govde: string;
  aliciEposta?: string | null;
};

export async function rfqOlustur(girdi: RfqOlusturGirdi): Promise<string> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("sa_rfq")
    .insert({
      talep_id: girdi.talepId,
      tedarikci_id: girdi.tedarikciId ?? null,
      konu: girdi.konu,
      govde: girdi.govde,
      alici_eposta: girdi.aliciEposta ?? null,
      durum: "taslak",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return (data as { id: string }).id;
}

export async function rfqGuncelle(
  id: string,
  alanlar: Partial<{ konu: string; govde: string; aliciEposta: string | null; tedarikciId: string | null; durum: RfqDurum }>,
): Promise<void> {
  const supabase = supabaseTarayici();
  const g: Record<string, unknown> = {};
  if (alanlar.konu !== undefined) g.konu = alanlar.konu;
  if (alanlar.govde !== undefined) g.govde = alanlar.govde;
  if (alanlar.aliciEposta !== undefined) g.alici_eposta = alanlar.aliciEposta;
  if (alanlar.tedarikciId !== undefined) g.tedarikci_id = alanlar.tedarikciId;
  if (alanlar.durum !== undefined) g.durum = alanlar.durum;
  const { error } = await supabase.from("sa_rfq").update(g).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function rfqSil(id: string): Promise<void> {
  const supabase = supabaseTarayici();
  const { error } = await supabase.from("sa_rfq").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  if (error) throw new Error(error.message);
}
