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

  /** Bir alanın sayısal değerini sakla (null = boş/geçersiz). */
  degerKaydet: (alan: string, sayi: number | null) => void;
  /** Tüm alan değerlerini {alan: sayi} olarak döndür. */
  degerleriAl: () => Record<string, number | null>;

  /** Seçili dönem. */
  yil: number;
  ay: number;
  setDonem: (yil: number, ay: number) => void;
}

const Context = React.createContext<VeriGirisiCtx | null>(null);

const SIMDI = new Date();

export function VeriGirisiProvider({ children }: { children: React.ReactNode }) {
  const alanlar = React.useRef<Map<string, AlanDurum>>(new Map());
  const degerler = React.useRef<Map<string, number | null>>(new Map());
  const [denendi, setDenendi] = React.useState(false);
  const [donem, setDonemState] = React.useState({
    yil: SIMDI.getFullYear(),
    ay: SIMDI.getMonth() + 1,
  });

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

  const degerKaydet = React.useCallback((alan: string, sayi: number | null) => {
    degerler.current.set(alan, sayi);
  }, []);
  const degerleriAl = React.useCallback(() => {
    return Object.fromEntries(degerler.current);
  }, []);

  const setDonem = React.useCallback((yil: number, ay: number) => {
    setDonemState({ yil, ay });
  }, []);

  return (
    <Context.Provider
      value={{
        kaydet,
        sil,
        denemeVeDogrula,
        denendi,
        degerKaydet,
        degerleriAl,
        yil: donem.yil,
        ay: donem.ay,
        setDonem,
      }}
    >
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
      degerKaydet: () => {},
      degerleriAl: () => ({}),
      yil: SIMDI.getFullYear(),
      ay: SIMDI.getMonth() + 1,
      setDonem: () => {},
    }
  );
}
