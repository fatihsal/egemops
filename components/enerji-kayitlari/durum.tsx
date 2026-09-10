"use client";

import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import type { KayitDurum, VeriKalite } from "@/lib/types";

const DURUM: Record<KayitDurum, { etiket: string; sinif: string }> = {
  onaylandi: {
    etiket: "ONAYLANDI",
    sinif:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  kontrol: {
    etiket: "KONTROL BEKLİYOR",
    sinif: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  taslak: {
    etiket: "TASLAK",
    sinif: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  },
};

export function KayitDurumBadge({ durum }: { durum: KayitDurum }) {
  const { t } = useDil();
  const d = DURUM[durum];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        d.sinif,
      )}
    >
      {t(d.etiket)}
    </span>
  );
}

const KALITE: Record<VeriKalite, { renk: string; baslik: string }> = {
  tam: { renk: "bg-emerald-500", baslik: "Veri tam" },
  kontrol: { renk: "bg-amber-500", baslik: "Kontrol gerekli" },
  eksik: { renk: "bg-red-500", baslik: "Eksik / hatalı" },
};

export function VeriKaliteNokta({ kalite }: { kalite: VeriKalite }) {
  const { t } = useDil();
  const k = KALITE[kalite];
  return (
    <span
      className={cn("inline-block size-2.5 rounded-full", k.renk)}
      title={t(k.baslik)}
      aria-label={t(k.baslik)}
    />
  );
}
