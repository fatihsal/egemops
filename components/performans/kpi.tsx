"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { useDil } from "@/components/providers/dil-provider";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PerformansKpi } from "@/lib/types";

const IKON: Record<string, { ikon: string; sinif: string }> = {
  mevcut: { ikon: "solar:speedometer-max-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  bazYil: { ikon: "solar:calendar-minimalistic-bold-duotone", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  hedef: { ikon: "solar:target-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  kalan: { ikon: "solar:speedometer-low-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" },
  iyilesme: { ikon: "solar:graph-up-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
  tasarruf: { ikon: "solar:leaf-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
};

function KpiKart({ kpi }: { kpi: PerformansKpi }) {
  const { t } = useDil();
  const ik = IKON[kpi.anahtar];
  const dusus = (kpi.degisimYuzde ?? 0) < 0;

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
            {t(kpi.baslik)}
          </span>
        </div>

        <div className="mt-2.5 flex items-baseline gap-1">
          <span className="font-heading text-[26px] font-bold leading-none tracking-tight">{kpi.deger}</span>
          {kpi.birim ? <span className="text-sm font-medium text-muted-foreground">{kpi.birim}</span> : null}
        </div>

        <div className="mt-auto pt-2.5">
          {kpi.progress !== undefined ? (
            <div className="space-y-1.5">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${kpi.progress}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground">{t("Hedefin %{p}'ü").replace("{p}", String(kpi.progress))}</p>
            </div>
          ) : kpi.degisimYuzde !== undefined ? (
            <span className="inline-flex items-center gap-1 text-xs">
              <span className={cn("inline-flex items-center gap-0.5 font-semibold", dusus ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                <Icon icon={dusus ? "solar:alt-arrow-down-bold" : "solar:alt-arrow-up-bold"} className="size-3" />
                %{sayiOndalik(Math.abs(kpi.degisimYuzde))}
              </span>
              {kpi.altMetin ? <span className="text-muted-foreground">{t(kpi.altMetin)}</span> : null}
            </span>
          ) : kpi.altMetin ? (
            <p className={cn("text-[11px] leading-tight", kpi.amber ? "font-medium text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
              {t(kpi.altMetin)}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function PerformansKpiKartlari() {
  const { data, isLoading } = usePerformansAnaliz();

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
