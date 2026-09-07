"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjeAnaliz } from "@/lib/queries/projeler";
import { cn } from "@/lib/utils";

const IKON: Record<string, { ikon: string; sinif: string }> = {
  aktif: { ikon: "solar:folder-with-files-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  butce: { ikon: "solar:wallet-money-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  harcama: { ikon: "solar:database-bold-duotone", sinif: "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300" },
  planlanan: { ikon: "solar:leaf-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
  dogrulanan: { ikon: "solar:graph-up-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" },
  zamaninda: { ikon: "solar:clock-circle-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" },
};

export function ProjeKpiKartlari() {
  const { data, isLoading } = useProjeAnaliz();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-3">
              <Skeleton className="size-11 rounded-xl" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {data.kpiler.map((k) => {
        const ik = IKON[k.anahtar];
        return (
          <Card key={k.anahtar} className="h-full">
            <CardContent className="flex h-full flex-col gap-3">
              <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", ik?.sinif)}>
                <Icon icon={ik?.ikon} className="size-6" />
              </span>
              <p className="text-xs text-muted-foreground">{k.baslik}</p>
              <p className="flex items-baseline gap-1">
                <span className="font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</span>
                {k.birim ? <span className="text-xs font-medium text-muted-foreground">{k.birim}</span> : null}
              </p>
              <div className="mt-auto space-y-1.5">
                {k.ilerleme != null ? (
                  <span className="block h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-teal-500" style={{ width: `${k.ilerleme}%` }} />
                  </span>
                ) : null}
                <p className="text-[11px] leading-tight text-muted-foreground">{k.altMetin}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
