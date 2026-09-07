"use client";

import * as React from "react";

export interface KullaniciFiltre {
  arama: string;
  rol: string;
  durum: string;
}

type FiltreCtx = KullaniciFiltre & {
  set: (anahtar: keyof KullaniciFiltre, deger: string) => void;
  sifirla: () => void;
  aktifMi: boolean;
};

const VARSAYILAN: KullaniciFiltre = { arama: "", rol: "Tümü", durum: "Tümü" };
const Context = React.createContext<FiltreCtx | null>(null);

export function KullaniciFiltreProvider({ children }: { children: React.ReactNode }) {
  const [f, setF] = React.useState<KullaniciFiltre>(VARSAYILAN);
  const set = React.useCallback((anahtar: keyof KullaniciFiltre, deger: string) => setF((p) => ({ ...p, [anahtar]: deger })), []);
  const sifirla = React.useCallback(() => setF(VARSAYILAN), []);
  const aktifMi = f.arama !== "" || f.rol !== "Tümü" || f.durum !== "Tümü";
  return <Context.Provider value={{ ...f, set, sifirla, aktifMi }}>{children}</Context.Provider>;
}

export function useKullaniciFiltre() {
  const c = React.useContext(Context);
  if (!c) throw new Error("useKullaniciFiltre yalnızca KullaniciFiltreProvider içinde kullanılabilir");
  return c;
}
