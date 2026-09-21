// -----------------------------------------------------------------------------
// VERİ KATMANI — Kaynak Belgeler (Veri Girişi / dönem bazlı yüklemeler)
// Dosya Firebase Storage'a yüklenir, indirme URL'si Supabase.belgeler'e kaydedilir.
// -----------------------------------------------------------------------------

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import { firebaseStorage } from "@/lib/firebase/client";
import { supabaseTarayici } from "@/lib/supabase/client";

export type KaynakBelge = {
  id: string;
  ad: string;
  tur: string | null;
  boyut: number | null;
  url: string;
  depolama_yolu: string;
  created_at: string;
};

/** Uzantıdan görünen tür etiketi. */
function turEtiket(ad: string): string {
  const uzanti = ad.split(".").pop()?.toLowerCase() ?? "";
  if (uzanti === "pdf") return "PDF";
  if (uzanti === "xlsx" || uzanti === "xls" || uzanti === "csv") return "Excel";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(uzanti)) return "Görsel";
  if (uzanti === "doc" || uzanti === "docx") return "Word";
  return uzanti.toUpperCase() || "Dosya";
}

/** Bir dönem için yüklenmiş belgeleri getirir. */
export async function belgeleriGetir(yil: number, ay: number): Promise<KaynakBelge[]> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("belgeler")
    .select("id, ad, tur, boyut, url, depolama_yolu, created_at")
    .eq("yil", yil)
    .eq("ay", ay)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as KaynakBelge[];
}

/** Dosyayı Firebase'e yükler, meta veriyi Supabase'e kaydeder. */
export async function belgeYukle(dosya: File, yil: number, ay: number): Promise<KaynakBelge> {
  const supabase = supabaseTarayici();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const guvenliAd = dosya.name.replace(/[^\w.\-]+/g, "_");
  const yol = `belgeler/${yil}-${String(ay).padStart(2, "0")}/${Date.now()}_${guvenliAd}`;

  const depoRef = ref(firebaseStorage, yol);
  await uploadBytes(depoRef, dosya, { contentType: dosya.type || undefined });
  const url = await getDownloadURL(depoRef);

  const { data, error } = await supabase
    .from("belgeler")
    .insert({
      yil,
      ay,
      ad: dosya.name,
      tur: turEtiket(dosya.name),
      boyut: dosya.size,
      url,
      depolama_yolu: yol,
      yukleyen: user?.id ?? null,
    })
    .select("id, ad, tur, boyut, url, depolama_yolu, created_at")
    .single();

  if (error) throw new Error(error.message);
  return data as KaynakBelge;
}

/** Belgeyi soft-delete yapar; Firebase'deki dosyayı da siler. */
export async function belgeSil(belge: KaynakBelge): Promise<void> {
  const supabase = supabaseTarayici();
  const { error } = await supabase
    .from("belgeler")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", belge.id);
  if (error) throw new Error(error.message);

  try {
    await deleteObject(ref(firebaseStorage, belge.depolama_yolu));
  } catch {
    /* dosya zaten yoksa yut */
  }
}
