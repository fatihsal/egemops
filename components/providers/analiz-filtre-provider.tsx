"use client";

import * as React from "react";

interface AnalizFiltreTip {
  yil: string;
  setYil: (y: string) => void;
}

const AnalizFiltreContext = React.createContext<AnalizFiltreTip | null>(null);

export function AnalizFiltreProvider({
  children,
  baslangicYil = "2026",
}: {
  children: React.ReactNode;
  baslangicYil?: string;
}) {
  const [yil, setYil] = React.useState(baslangicYil);
  return (
    <AnalizFiltreContext.Provider value={{ yil, setYil }}>
      {children}
    </AnalizFiltreContext.Provider>
  );
}

/** Sağlayıcı yoksa güvenli varsayılan döner (çökmez). */
export function useAnalizFiltre(): AnalizFiltreTip {
  return (
    React.useContext(AnalizFiltreContext) ?? {
      yil: "2026",
      setYil: () => {},
    }
  );
}

/**
 * Seçilen yıla göre kümülatif değer ölçeği. 2026 = güncel taban (1.0);
 * geçmiş yıllar enerji tüketiminin daha düşük olduğu varsayımıyla ölçeklenir.
 * (Mock: gerçek uygulamada veri katmanı yıla göre veri döndürür.)
 */
export function yilOlcek(yil: string): number {
  const harita: Record<string, number> = {
    "2026": 1,
    "2025": 0.92,
    "2024": 0.84,
  };
  return harita[yil] ?? 1;
}

/**
 * Ön-biçimli tr sayı metnini (ör. "838.217,40", "674,5 TEP") ölçekle;
 * ondalık hassasiyeti ve varsa sondaki birim metnini korur. Sayı yoksa
 * (ör. "—") olduğu gibi döner.
 */
export function olcekliDeger(metin: string, olcek: number): string {
  if (olcek === 1) return metin;
  const m = metin.match(/^\s*([\d.,]+)(.*)$/);
  if (!m) return metin;
  const [, sayiKismi, kalan] = m;
  const n = parseFloat(sayiKismi.replace(/\./g, "").replace(",", "."));
  if (Number.isNaN(n)) return metin;
  const ondalik = sayiKismi.includes(",")
    ? sayiKismi.split(",")[1].length
    : 0;
  const bicimli = (n * olcek).toLocaleString("tr-TR", {
    minimumFractionDigits: ondalik,
    maximumFractionDigits: ondalik,
  });
  return bicimli + kalan;
}
