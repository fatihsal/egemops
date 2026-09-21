// -----------------------------------------------------------------------------
// VERİ KATMANI — Veri Girişi (Supabase: public.enerji_kayitlari)
// -----------------------------------------------------------------------------

import { supabaseTarayici } from "@/lib/supabase/client";

export type EnerjiKaydiInput = {
  yil: number;
  ay: number;
  durum: "taslak" | "onayli";
  degerler: Record<string, number | null>;
};

/** Aynı dönem varsa günceller, yoksa ekler (soft-delete uyumlu upsert). */
export async function enerjiKaydiKaydet(input: EnerjiKaydiInput) {
  const supabase = supabaseTarayici();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const satir = {
    yil: input.yil,
    ay: input.ay,
    durum: input.durum,
    giren: user?.id ?? null,
    ...input.degerler,
  };

  const { data: mevcut, error: bulHata } = await supabase
    .from("enerji_kayitlari")
    .select("id")
    .eq("yil", input.yil)
    .eq("ay", input.ay)
    .is("deleted_at", null)
    .maybeSingle();

  if (bulHata) throw new Error(bulHata.message);

  if (mevcut) {
    const { error } = await supabase
      .from("enerji_kayitlari")
      .update(satir)
      .eq("id", mevcut.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("enerji_kayitlari").insert(satir);
    if (error) throw new Error(error.message);
  }
}
