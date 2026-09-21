"use client";

import * as React from "react";

import { supabaseTarayici } from "@/lib/supabase/client";

export type Profil = {
  id: string;
  ad_soyad: string | null;
  eposta: string | null;
  rol: "admin" | "enerji_yoneticisi" | "izleyici";
};

/** Giriş yapan kullanıcının profiles kaydını getirir. */
export function useProfil() {
  const [profil, setProfil] = React.useState<Profil | null>(null);
  const [yukleniyor, setYukleniyor] = React.useState(true);

  React.useEffect(() => {
    let iptal = false;
    const supabase = supabaseTarayici();

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!iptal) setYukleniyor(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("id, ad_soyad, eposta, rol")
        .eq("id", user.id)
        .is("deleted_at", null)
        .single();
      if (!iptal) {
        setProfil((data as Profil) ?? null);
        setYukleniyor(false);
      }
    })();

    return () => {
      iptal = true;
    };
  }, []);

  return { profil, yukleniyor };
}
