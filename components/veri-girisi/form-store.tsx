"use client";

import * as React from "react";

export interface AlanDurum {
  etiket: string;
  gecerli: boolean;
}

interface VeriGirisiCtx {
  kaydet: (id: string, durum: AlanDurum) => void;
  sil: (id: string) => void;
  /** Onaylamadan önce çağrılır: dokunulmamış alanların da hatasını gösterir,
   *  geçersiz alanların listesini döndürür. */
  denemeVeDogrula: () => AlanDurum[];
  denendi: boolean;
}

const Context = React.createContext<VeriGirisiCtx | null>(null);

export function VeriGirisiProvider({ children }: { children: React.ReactNode }) {
  const alanlar = React.useRef<Map<string, AlanDurum>>(new Map());
  const [denendi, setDenendi] = React.useState(false);

  const kaydet = React.useCallback((id: string, durum: AlanDurum) => {
    alanlar.current.set(id, durum);
  }, []);
  const sil = React.useCallback((id: string) => {
    alanlar.current.delete(id);
  }, []);
  const denemeVeDogrula = React.useCallback(() => {
    setDenendi(true);
    return [...alanlar.current.values()].filter((a) => !a.gecerli);
  }, []);

  return (
    <Context.Provider value={{ kaydet, sil, denemeVeDogrula, denendi }}>
      {children}
    </Context.Provider>
  );
}

/** Sağlayıcı yoksa güvenli no-op döner (VeriInput her yerde çalışsın diye). */
export function useVeriGirisi(): VeriGirisiCtx {
  return (
    React.useContext(Context) ?? {
      kaydet: () => {},
      sil: () => {},
      denemeVeDogrula: () => [],
      denendi: false,
    }
  );
}
