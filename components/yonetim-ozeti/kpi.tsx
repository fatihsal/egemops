"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useYonetimOzeti } from "@/lib/queries/yonetim-ozeti";
import { cn } from "@/lib/utils";
import type { OzetKpi } from "@/lib/types";

const IKON: Record<string, { ikon: string; sinif: string }> = {
  tuketim: { ikon: "solar:bolt-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" },
  uretim: { ikon: "solar:settings-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  yogunluk: { ikon: "solar:chart-2-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  hedef: { ikon: "solar:target-bold-duotone", sinif: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300" },
  tasarruf: { ikon: "solar:leaf-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
  maliyet: { ikon: "solar:database-bold-duotone", sinif: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300" },
};

function Degisim({ k }: { k: OzetKpi }) {
  if (k.degisim == null) return null;
  const artis = k.degisim > 0;
  const iyi = (artis && k.iyiYon === "artis") || (!artis && k.iyiYon === "azalis");
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", iyi ? "text-emerald-600" : "text-red-500")}>
      <Icon icon={artis ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-down-bold"} className="size-3.5" />
      %{Math.abs(k.degisim).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
    </span>
  );
}

export function OzetKpiKartlari() {
  const { data, isLoading } = useYonetimOzeti();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}><CardContent className="flex gap-3"><Skeleton className="size-11 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-6 w-16" /><Skeleton className="h-3 w-24" /></div></CardContent></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.kpiler.map((k) => {
        const ik = IKON[k.anahtar];
        return (
          <Card key={k.anahtar} className="h-full">
            <CardContent className="flex gap-3">
              <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", ik?.sinif)}>
                <Icon icon={ik?.ikon} className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted-foreground">{k.baslik}</p>
                <p className="mt-0.5 flex items-baseline gap-1">
                  <span className="font-heading text-xl font-bold tracking-tight tabular-nums">{k.deger}</span>
                  {k.birim ? <span className="text-xs font-medium text-muted-foreground">{k.birim}</span> : null}
                </p>
                {k.ilerleme != null ? (
                  <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-teal-500" style={{ width: `${k.ilerleme}%` }} />
                  </span>
                ) : (
                  <div className="mt-0.5"><Degisim k={k} /></div>
                )}
                <p className="mt-1 truncate text-[11px] text-muted-foreground">{k.altMetin}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
