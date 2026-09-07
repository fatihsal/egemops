"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAkaryakitAnaliz } from "@/lib/queries/akaryakit";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AkaryakitKpi } from "@/lib/types";

const IKON: Record<string, { ikon: string; sinif: string }> = {
  toplam: { ikon: "solar:gas-station-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" },
  tep: { ikon: "solar:presentation-graph-bold-duotone", sinif: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300" },
  ortalama: { ikon: "solar:chart-2-bold-duotone", sinif: "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-300" },
  enYuksek: { ikon: "solar:graph-up-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" },
  enDusuk: { ikon: "solar:graph-down-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  aracBasi: { ikon: "solar:bus-bold-duotone", sinif: "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300" },
};

function KpiKart({ kpi }: { kpi: AkaryakitKpi }) {
  const ik = IKON[kpi.anahtar];
  const arti = (kpi.degisimYuzde ?? 0) >= 0;

  return (
    <Card size="sm" className="h-full">
      <CardContent className="flex h-full flex-col">
        <div className="flex items-start gap-2.5">
          {ik ? (
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", ik.sinif)}>
              <Icon icon={ik.ikon} className="size-6" />
            </span>
          ) : null}
          <span className="mt-0.5 min-h-[32px] flex-1 text-xs font-medium leading-tight text-muted-foreground">
            {kpi.baslik}
          </span>
        </div>

        <div className="mt-2.5 flex items-baseline gap-1">
          <span className="font-heading text-[26px] font-bold leading-none tracking-tight">{kpi.deger}</span>
          {kpi.birim ? <span className="text-sm font-medium text-muted-foreground">{kpi.birim}</span> : null}
        </div>

        <div className="mt-auto pt-3">
          {kpi.degisimYuzde !== undefined ? (
            <div className="space-y-0.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-semibold",
                  arti ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
                )}
              >
                <Icon icon={arti ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-down-bold"} className="size-3" />
                %{sayiOndalik(Math.abs(kpi.degisimYuzde))}
              </span>
              <p className="text-[11px] leading-tight text-muted-foreground">Geçen yılın aynı dönemine göre</p>
            </div>
          ) : kpi.altMetin ? (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              <Icon icon="solar:calendar-minimalistic-bold-duotone" className="size-3.5" />
              {kpi.altMetin}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function AkaryakitKpiKartlari() {
  const { data, isLoading } = useAkaryakitAnaliz();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} size="sm">
            <CardContent className="space-y-3">
              <Skeleton className="size-10 rounded-xl" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {data.kpiler.map((kpi) => (
        <KpiKart key={kpi.anahtar} kpi={kpi} />
      ))}
    </div>
  );
}
