"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirsatAnaliz } from "@/lib/queries/firsatlar";
import { cn } from "@/lib/utils";

const IKON: Record<string, { ikon: string; sinif: string }> = {
  toplam: { ikon: "solar:lightbulb-bolt-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  tasarruf: { ikon: "solar:leaf-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
  yatirim: { ikon: "solar:database-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  geriDonus: { ikon: "solar:graph-up-bold-duotone", sinif: "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300" },
  gerceklesen: { ikon: "solar:pulse-bold-duotone", sinif: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300" },
  uygulama: { ikon: "solar:speedometer-max-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
};

export function FirsatKpiKartlari() {
  const { data, isLoading } = useFirsatAnaliz();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4">
              <Skeleton className="size-14 rounded-2xl" />
              <div className="flex-1 space-y-2"><Skeleton className="h-3 w-28" /><Skeleton className="h-7 w-24" /><Skeleton className="h-3 w-32" /></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.kpiler.map((k) => {
        const ik = IKON[k.anahtar];
        return (
          <Card key={k.anahtar} className="h-full">
            <CardContent className="flex items-center gap-4">
              <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl", ik?.sinif)}>
                <Icon icon={ik?.ikon} className="size-7" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-muted-foreground">{k.baslik}</p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</span>
                  {k.birim ? <span className="text-sm font-medium text-muted-foreground">{k.birim}</span> : null}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{k.altMetin}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
