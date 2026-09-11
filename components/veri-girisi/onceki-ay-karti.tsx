"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkline } from "@/components/common/sparkline";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

const KALEMLER = [
  { etiket: "Elektrik", ikon: "solar:bolt-bold-duotone", renk: "#3b82f6", deger: "70,24", degisim: "2,63", spark: [6, 6.3, 6.1, 6.6, 6.4, 7] },
  { etiket: "GES", ikon: "solar:sun-2-bold-duotone", renk: "#22c55e", deger: "20,12", degisim: "4,82", spark: [1.6, 1.7, 1.75, 1.8, 1.9, 2] },
  { etiket: "Doğalgaz", ikon: "solar:fire-bold-duotone", renk: "#8b5cf6", deger: "35,11", degisim: "2,59", spark: [3, 3.1, 3.05, 3.2, 3.3, 3.4] },
  { etiket: "Akaryakıt", ikon: "solar:gas-station-bold-duotone", renk: "#f97316", deger: "1,28", degisim: "8,59", spark: [0.9, 1, 1.05, 1.1, 1.2, 1.25] },
  { etiket: "Toplam", ikon: "solar:chart-2-bold-duotone", renk: "#0d9488", deger: "106,75", degisim: "2,58", spark: [95, 98, 100, 102, 104, 106], vurgu: true },
];

export function OncekiAyKarti() {
  const { t } = useDil();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:calendar-mark-bold-duotone" className="size-5 text-primary" />
            {t("Önceki Ay Karşılaştırması")}
          </CardTitle>
          <span className="text-xs font-medium text-muted-foreground">
            {t("Temmuz 2026")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {KALEMLER.map((k) => (
          <div
            key={k.etiket}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2 py-1.5",
              k.vurgu && "bg-teal-50/70 dark:bg-teal-950/40",
            )}
          >
            <Icon icon={k.ikon} className="size-5 shrink-0" style={{ color: k.renk }} />
            <span
              className={cn(
                "flex-1 truncate text-sm",
                k.vurgu && "font-semibold",
              )}
            >
              {t(k.etiket)}
            </span>
            <Sparkline data={k.spark} renk={k.renk} className="h-5 w-14 shrink-0" />
            <span
              className={cn(
                "w-14 shrink-0 text-right text-sm font-bold tabular-nums",
                k.vurgu && "text-teal-700 dark:text-teal-300",
              )}
            >
              {k.deger}
            </span>
            <span className="inline-flex w-14 shrink-0 items-center justify-end gap-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="text-[9px] leading-none">▲</span>
              {k.degisim}%
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
