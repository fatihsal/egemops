"use client";

import * as React from "react";

import { varsayilanDonem, type Donem } from "@/lib/donem";

interface DonemContextTip {
  donem: Donem;
  setDonem: (d: Donem) => void;
}

const DonemContext = React.createContext<DonemContextTip | null>(null);

export function DonemProvider({ children }: { children: React.ReactNode }) {
  const [donem, setDonem] = React.useState<Donem>(varsayilanDonem);
  return (
    <DonemContext.Provider value={{ donem, setDonem }}>
      {children}
    </DonemContext.Provider>
  );
}

/** Seçili dönemi okumak/değiştirmek için. */
export function useDonem(): DonemContextTip {
  const ctx = React.useContext(DonemContext);
  if (!ctx) {
    throw new Error("useDonem, DonemProvider içinde kullanılmalı.");
  }
  return ctx;
}
