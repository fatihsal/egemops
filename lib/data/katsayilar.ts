// -----------------------------------------------------------------------------
// VERİ KATMANI — Katsayılar (Supabase: public.katsayilar)
// TEP / emisyon / fiyat / genel katsayıları; düzenlenebilir.
// -----------------------------------------------------------------------------

import type {
  BirimFiyat,
  EmisyonFaktor,
  GenelParametre,
  KatsayiAnaliz,
  KatsayiKpi,
  TepKatsayi,
} from "@/lib/types";
import { supabaseTarayici } from "@/lib/supabase/client";

type Satir = {
  id: string;
  grup: "tep" | "emisyon" | "fiyat" | "genel";
  ad: string;
  renk: string | null;
  birim: string | null;
  alt_isil: string | null;
  tep: string | null;
  referans: string | null;
  faktor: string | null;
  kapsam: string | null;
  fiyat: string | null;
  guncelleme: string | null;
  deger: string | null;
  aciklama: string | null;
  ikon: string | null;
  sinif: string | null;
  sira: number;
  updated_at: string;
};

function tarihBicim(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export async function katsayiAnaliziGetir(): Promise<KatsayiAnaliz> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("katsayilar")
    .select("*")
    .is("deleted_at", null)
    .order("grup", { ascending: true })
    .order("sira", { ascending: true });
  if (error) throw new Error(error.message);

  const satirlar = (data ?? []) as Satir[];
  const grup = (g: Satir["grup"]) => satirlar.filter((s) => s.grup === g);

  const tep: TepKatsayi[] = grup("tep").map((s) => ({
    id: s.id,
    ad: s.ad,
    renk: s.renk ?? "#64748b",
    birim: s.birim ?? "",
    altIsil: s.alt_isil ?? "",
    tep: s.tep ?? "",
    referans: s.referans ?? "",
  }));

  const emisyon: EmisyonFaktor[] = grup("emisyon").map((s) => ({
    id: s.id,
    ad: s.ad,
    renk: s.renk ?? "#64748b",
    birim: s.birim ?? "",
    faktor: s.faktor ?? "",
    kapsam: (s.kapsam === "Kapsam 1" || s.kapsam === "Kapsam 2" ? s.kapsam : "Kapsam 1"),
  }));

  const fiyat: BirimFiyat[] = grup("fiyat").map((s) => ({
    id: s.id,
    ad: s.ad,
    renk: s.renk ?? "#64748b",
    birim: s.birim ?? "",
    fiyat: s.fiyat ?? "",
    guncelleme: s.guncelleme ?? "",
  }));

  const genel: GenelParametre[] = grup("genel").map((s) => ({
    id: s.id,
    ad: s.ad,
    deger: s.deger ?? "",
    aciklama: s.aciklama ?? "",
    ikon: s.ikon ?? "solar:settings-bold-duotone",
    sinif: s.sinif ?? "bg-muted text-muted-foreground",
  }));

  const sonIso = satirlar.reduce<string | null>(
    (en, s) => (!en || s.updated_at > en ? s.updated_at : en),
    null,
  );
  const sonGuncelleme = sonIso ? tarihBicim(sonIso) : "—";

  const kpiler: KatsayiKpi[] = [
    { anahtar: "toplam", baslik: "Tanımlı Katsayı", deger: String(satirlar.length), altMetin: "4 kategoride" },
    { anahtar: "yil", baslik: "Aktif Katsayı Yılı", deger: String(new Date().getFullYear()), altMetin: "Geçerli set" },
    { anahtar: "guncelleme", baslik: "Son Güncelleme", deger: sonIso ? sonGuncelleme.split(" ")[0] : "—", altMetin: "Son değişiklik" },
    { anahtar: "kaynak", baslik: "Veri Kaynağı", deger: "Resmi", altMetin: "Enerji Verimliliği Tebliği" },
  ];

  return {
    kpiler,
    tep,
    emisyon,
    fiyat,
    genel,
    kaynak: "Enerji Verimliliği Tebliği (Resmi Gazete)",
    sonGuncelleme,
  };
}

// Düzenleme/ekleme drawer'ından gelen alan adları -> DB sütunları
const ALAN_SUTUN: Record<string, string> = {
  ad: "ad",
  renk: "renk",
  birim: "birim",
  altIsil: "alt_isil",
  tep: "tep",
  referans: "referans",
  faktor: "faktor",
  kapsam: "kapsam",
  fiyat: "fiyat",
  guncelleme: "guncelleme",
  deger: "deger",
  aciklama: "aciklama",
  ikon: "ikon",
  sinif: "sinif",
};

function sutunlaraCevir(degerler: Record<string, string>): Record<string, string> {
  const cikti: Record<string, string> = {};
  for (const [k, v] of Object.entries(degerler)) {
    const sutun = ALAN_SUTUN[k];
    if (sutun) cikti[sutun] = v;
  }
  return cikti;
}

/** Bir katsayı satırının düzenlenen alanlarını günceller. */
export async function katsayiGuncelle(id: string, degerler: Record<string, string>): Promise<void> {
  const supabase = supabaseTarayici();
  const guncelleme = sutunlaraCevir(degerler);
  if (Object.keys(guncelleme).length === 0) return;

  const { error } = await supabase.from("katsayilar").update(guncelleme).eq("id", id);
  if (error) throw new Error(error.message);
}

/** Yeni katsayı satırı ekler. */
export async function katsayiEkle(
  grup: "tep" | "emisyon" | "fiyat" | "genel",
  degerler: Record<string, string>,
): Promise<void> {
  const supabase = supabaseTarayici();
  const satir = {
    id: `${grup}-${Date.now().toString(36)}`,
    grup,
    ad: degerler.ad?.trim() || "Yeni Katsayı",
    ...sutunlaraCevir(degerler),
  };
  const { error } = await supabase.from("katsayilar").insert(satir);
  if (error) throw new Error(error.message);
}

/** Katsayı satırını soft-delete yapar (RLS'ten bağımsız SECURITY DEFINER fonksiyon). */
export async function katsayiSil(id: string): Promise<void> {
  const supabase = supabaseTarayici();
  const { error } = await supabase.rpc("katsayi_sil", { p_id: id });
  if (error) throw new Error(error.message);
}
