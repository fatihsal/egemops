"use client";

// Belge Listesi filtreleri + kategori kartlarından tetiklenen filtre için
// paylaşılan durum.

import * as React from "react";

export interface BelgeFiltre {
  arama: string;
  kategori: string; // "Tümü" | etiket
  durum: string; // "Tümü" | "Geçerli" | ...
}

type FiltreCtx = BelgeFiltre & {
  set: (anahtar: keyof BelgeFiltre, deger: string) => void;
  sifirla: () => void;
  aktifMi: boolean;
};

const VARSAYILAN: BelgeFiltre = { arama: "", kategori: "Tümü", durum: "Tümü" };

const Context = React.createContext<FiltreCtx | null>(null);

export function BelgeFiltreProvider({ children }: { children: React.ReactNode }) {
  const [f, setF] = React.useState<BelgeFiltre>(VARSAYILAN);

  const set = React.useCallback((anahtar: keyof BelgeFiltre, deger: string) => {
    setF((p) => ({ ...p, [anahtar]: deger }));
  }, []);
  const sifirla = React.useCallback(() => setF(VARSAYILAN), []);

  const aktifMi = f.arama !== "" || f.kategori !== "Tümü" || f.durum !== "Tümü";

  return <Context.Provider value={{ ...f, set, sifirla, aktifMi }}>{children}</Context.Provider>;
}

export function useBelgeFiltre() {
  const c = React.useContext(Context);
  if (!c) throw new Error("useBelgeFiltre yalnızca BelgeFiltreProvider içinde kullanılabilir");
  return c;
}
