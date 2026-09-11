"use client";

import * as React from "react";

import { EN, type Dil } from "@/lib/i18n/sozluk";

interface DilCtx {
  dil: Dil;
  setDil: (d: Dil) => void;
  /** Türkçe kaynak metni geçerli dile çevirir (EN yoksa Türkçe döner). */
  t: (trMetin: string) => string;
}

const Context = React.createContext<DilCtx | null>(null);
const DEPO_ANAHTAR = "egemops-dil";

export function DilProvider({
  children,
  baslangic,
}: {
  children: React.ReactNode;
  /** Sunucudan (cookie) gelen başlangıç dili — ilk render'da flash'ı önler. */
  baslangic?: Dil;
}) {
  const [dil, setDilState] = React.useState<Dil>(baslangic ?? "tr");

  // Cookie yoksa (ör. eski kullanıcı) localStorage tercihini benimse ve
  // sonraki SSR için cookie'ye yaz — böylece bir daha flash olmaz.
  React.useEffect(() => {
    if (baslangic) return;
    try {
      const s = localStorage.getItem(DEPO_ANAHTAR);
      if (s === "tr" || s === "en") {
        setDilState(s);
        document.documentElement.lang = s;
        document.cookie = `${DEPO_ANAHTAR}=${s}; path=/; max-age=31536000; samesite=lax`;
      }
    } catch {
      /* yoksay */
    }
  }, [baslangic]);

  const setDil = React.useCallback((d: Dil) => {
    setDilState(d);
    try {
      localStorage.setItem(DEPO_ANAHTAR, d);
    } catch {
      /* yoksay */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = d;
      document.cookie = `${DEPO_ANAHTAR}=${d}; path=/; max-age=31536000; samesite=lax`;
    }
  }, []);

  const t = React.useCallback(
    (trMetin: string) => (dil === "en" ? (EN[trMetin] ?? trMetin) : trMetin),
    [dil],
  );

  return (
    <Context.Provider value={{ dil, setDil, t }}>{children}</Context.Provider>
  );
}

/** Sağlayıcı yoksa Türkçe geçişli güvenli varsayılan döner. */
export function useDil(): DilCtx {
  return (
    React.useContext(Context) ?? {
      dil: "tr",
      setDil: () => {},
      t: (s: string) => s,
    }
  );
}
