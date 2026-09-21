// -----------------------------------------------------------------------------
// VERİ KATMANI — Kullanıcılar (Supabase: public.profiles)
// -----------------------------------------------------------------------------

import type {
  Kullanici,
  KullaniciAnaliz,
  KullaniciKpi,
  KullaniciRol,
  RolDagilim,
} from "@/lib/types";
import { supabaseTarayici } from "@/lib/supabase/client";

// profiles.rol -> UI rolü
const ROL_ESLEME: Record<string, KullaniciRol> = {
  admin: "yonetici",
  enerji_yoneticisi: "editor",
  izleyici: "goruntuleyici",
};

const RENKLER = [
  "#0d9488", "#2563eb", "#f59e0b", "#8b5cf6", "#0891b2",
  "#ec4899", "#16a34a", "#dc2626", "#7c3aed", "#0284c7",
];

function renkSec(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return RENKLER[h % RENKLER.length];
}

function basHarfler(ad: string, eposta: string) {
  const k = (ad ?? "").trim();
  if (k) {
    return k
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toLocaleUpperCase("tr") ?? "")
      .join("");
  }
  return (eposta?.[0] ?? "?").toLocaleUpperCase("tr");
}

type ProfilSatir = {
  id: string;
  ad_soyad: string | null;
  eposta: string | null;
  rol: string;
  created_at: string;
};

export async function kullaniciAnaliziGetir(): Promise<KullaniciAnaliz> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, ad_soyad, eposta, rol, created_at")
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  const satirlar = (data ?? []) as ProfilSatir[];

  const kullanicilar: Kullanici[] = satirlar.map((s) => {
    const ad = s.ad_soyad ?? s.eposta ?? "—";
    const email = s.eposta ?? "";
    return {
      id: s.id,
      ad,
      email,
      bas: basHarfler(s.ad_soyad ?? "", email),
      renk: renkSec(s.id),
      rol: ROL_ESLEME[s.rol] ?? "goruntuleyici",
      departman: "—",
      durum: "aktif",
      sonGiris: "—",
    };
  });

  const say = (r: KullaniciRol) => kullanicilar.filter((u) => u.rol === r).length;

  const roller: RolDagilim[] = [
    { rol: "yonetici", adet: say("yonetici") },
    { rol: "editor", adet: say("editor") },
    { rol: "goruntuleyici", adet: say("goruntuleyici") },
  ];

  const kpiler: KullaniciKpi[] = [
    { anahtar: "toplam", baslik: "Toplam Kullanıcı", deger: String(kullanicilar.length), altMetin: "Tüm departmanlar" },
    { anahtar: "aktif", baslik: "Aktif Kullanıcı", deger: String(kullanicilar.length), altMetin: "Son 30 günde giriş yaptı" },
    { anahtar: "davet", baslik: "Bekleyen Davet", deger: "0", altMetin: "Yanıt bekliyor" },
    { anahtar: "yonetici", baslik: "Yönetici", deger: String(say("yonetici")), altMetin: "Tam yetkili" },
  ];

  return { kpiler, roller, kullanicilar };
}
