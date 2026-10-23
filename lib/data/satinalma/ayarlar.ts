// -----------------------------------------------------------------------------
// VERİ KATMANI — Satın Alma / Firma Profili (Supabase: public.sa_ayarlar)
// RFQ gönderen bilgileri ve imza. Tek satır (id='firma').
// -----------------------------------------------------------------------------

import type { FirmaProfili } from "@/lib/types/satinalma";
import { supabaseTarayici } from "@/lib/supabase/client";

const VARSAYILAN: FirmaProfili = {
  firmaAdi: "Egem Ambalaj",
  gonderenAdi: "Fatih SAL",
  departman: "Bakım Departmanı",
  telefon: "",
  imza: "",
};

export async function firmaProfiliGetir(): Promise<FirmaProfili> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("sa_ayarlar")
    .select("firma_adi, gonderen_adi, departman, telefon, imza")
    .eq("id", "firma")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return VARSAYILAN;
  return {
    firmaAdi: data.firma_adi ?? VARSAYILAN.firmaAdi,
    gonderenAdi: data.gonderen_adi ?? VARSAYILAN.gonderenAdi,
    departman: data.departman ?? VARSAYILAN.departman,
    telefon: data.telefon ?? "",
    imza: data.imza ?? "",
  };
}

export async function firmaProfiliKaydet(p: FirmaProfili): Promise<void> {
  const supabase = supabaseTarayici();
  const { error } = await supabase.from("sa_ayarlar").upsert(
    {
      id: "firma",
      firma_adi: p.firmaAdi,
      gonderen_adi: p.gonderenAdi,
      departman: p.departman,
      telefon: p.telefon,
      imza: p.imza,
    },
    { onConflict: "id" },
  );
  if (error) throw new Error(error.message);
}

/** Profilden otomatik imza metni üretir (kullanıcı özel imza girmediyse). */
export function imzaUret(p: FirmaProfili): string {
  if (p.imza?.trim()) return p.imza.trim();
  return [
    "Saygılarımızla,",
    [p.gonderenAdi, p.departman].filter(Boolean).join(" — "),
    p.firmaAdi,
    p.telefon ? `Tel: ${p.telefon}` : "",
  ].filter(Boolean).join("\n");
}
