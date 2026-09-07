"use client";

// Üst filtreler ile "Tüm Projeler" tablosu arasında paylaşılan filtre durumu.
// (Basit React context — backend/URL state gerekmeden çalışır.)

import * as React from "react";

export interface ProjeFiltre {
  yil: string;
  durum: string;
  tur: string;
  sorumlu: string;
}

type FiltreCtx = ProjeFiltre & {
  set: (anahtar: keyof ProjeFiltre, deger: string) => void;
  sifirla: () => void;
  aktifMi: boolean;
};

const VARSAYILAN: ProjeFiltre = { yil: "2026", durum: "Tümü", tur: "Tümü", sorumlu: "Tümü" };

const Context = React.createContext<FiltreCtx | null>(null);

export function ProjeFiltreProvider({ children }: { children: React.ReactNode }) {
  const [f, setF] = React.useState<ProjeFiltre>(VARSAYILAN);

  const set = React.useCallback((anahtar: keyof ProjeFiltre, deger: string) => {
    setF((p) => ({ ...p, [anahtar]: deger }));
  }, []);
  const sifirla = React.useCallback(() => setF(VARSAYILAN), []);

  const aktifMi = f.durum !== "Tümü" || f.tur !== "Tümü" || f.sorumlu !== "Tümü" || f.yil !== "2026";

  return <Context.Provider value={{ ...f, set, sifirla, aktifMi }}>{children}</Context.Provider>;
}

export function useProjeFiltre() {
  const c = React.useContext(Context);
  if (!c) throw new Error("useProjeFiltre yalnızca ProjeFiltreProvider içinde kullanılabilir");
  return c;
}
