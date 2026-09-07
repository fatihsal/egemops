"use client";

// Rapor Listesi filtreleri + kategori kartlarından tetiklenen filtre için
// paylaşılan durum. Basit React context.

import * as React from "react";

export interface RaporFiltre {
  arama: string;
  kategori: string; // "Tümü" | etiket
  format: string; // "Tümü" | "PDF" | "Excel"
  durum: string; // "Tümü" | "Aktif" | ...
}

type FiltreCtx = RaporFiltre & {
  set: (anahtar: keyof RaporFiltre, deger: string) => void;
  sifirla: () => void;
  aktifMi: boolean;
};

const VARSAYILAN: RaporFiltre = { arama: "", kategori: "Tümü", format: "Tümü", durum: "Tümü" };

const Context = React.createContext<FiltreCtx | null>(null);

export function RaporFiltreProvider({ children }: { children: React.ReactNode }) {
  const [f, setF] = React.useState<RaporFiltre>(VARSAYILAN);

  const set = React.useCallback((anahtar: keyof RaporFiltre, deger: string) => {
    setF((p) => ({ ...p, [anahtar]: deger }));
  }, []);
  const sifirla = React.useCallback(() => setF(VARSAYILAN), []);

  const aktifMi = f.arama !== "" || f.kategori !== "Tümü" || f.format !== "Tümü" || f.durum !== "Tümü";

  return <Context.Provider value={{ ...f, set, sifirla, aktifMi }}>{children}</Context.Provider>;
}

export function useRaporFiltre() {
  const c = React.useContext(Context);
  if (!c) throw new Error("useRaporFiltre yalnızca RaporFiltreProvider içinde kullanılabilir");
  return c;
}
