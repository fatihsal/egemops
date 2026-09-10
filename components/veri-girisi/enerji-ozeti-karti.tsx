"use client";

import { Icon } from "@iconify/react";

import { Sparkline } from "@/components/common/sparkline";
import { useDil } from "@/components/providers/dil-provider";

const SATIRLAR = [
  { etiket: "Elektrik", deger: "72,09", renk: "#60a5fa", spark: [5, 5.6, 5.2, 6.1, 5.8, 6.4, 6.0, 6.3] },
  { etiket: "Doğalgaz", deger: "36,02", renk: "#818cf8", spark: [3, 3.3, 3.1, 2.8, 3.2, 3.0, 3.4, 3.6] },
  { etiket: "Akaryakıt", deger: "1,39", renk: "#fbbf24", spark: [1, 1.1, 1.05, 1.2, 1.15, 1.25, 1.3, 1.28] },
];

export function EnerjiOzetiKarti() {
  const { t } = useDil();
  return (
    <div className="overflow-hidden rounded-xl bg-[#0e1f3d] p-5 text-white shadow-lg ring-1 ring-white/10 dark:bg-[#0a1830]">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-sky-300">
          <Icon icon="solar:chart-2-bold-duotone" className="size-5" />
        </span>
        <h3 className="font-heading text-base font-semibold">
          {t("Ağustos 2026")} {t("Enerji Özeti")}
        </h3>
      </div>

      <div className="space-y-3">
        {SATIRLAR.map((s) => (
          <div key={s.etiket} className="flex items-center gap-3">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: s.renk }}
            />
            <span className="flex-1 text-sm text-white/70">{t(s.etiket)}</span>
            <Sparkline
              data={s.spark}
              renk={s.renk}
              className="h-5 w-16 opacity-90"
            />
            <span className="w-20 text-right text-sm font-semibold tabular-nums">
              {s.deger}
              <span className="ml-1 text-xs font-normal text-white/50">TEP</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex items-end justify-between">
          <span className="text-sm font-medium text-white/70">{t("TOPLAM")}</span>
          <span className="text-3xl font-bold tracking-tight">
            109,50
            <span className="ml-1 text-base font-normal text-white/60">TEP</span>
          </span>
        </div>
        <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
          <Icon icon="solar:arrow-right-up-bold-duotone" className="size-4" />
          {t("Geçen aya göre")} +%2,1
        </div>
      </div>
    </div>
  );
}
