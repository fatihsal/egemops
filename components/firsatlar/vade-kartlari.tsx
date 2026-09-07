"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirsatAnaliz } from "@/lib/queries/firsatlar";
import { cn } from "@/lib/utils";

const IKON: Record<string, { ikon: string; sinif: string }> = {
  hizli: { ikon: "solar:clock-circle-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  orta: { ikon: "solar:chart-2-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  uzun: { ikon: "solar:target-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" },
  co2: { ikon: "solar:leaf-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
};

export function FirsatVadeKartlari() {
  const { data, isLoading } = useFirsatAnaliz();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="flex items-start gap-3"><Skeleton className="size-11 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-6 w-20" /></div></CardContent></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.vadeler.map((v) => {
        const ik = IKON[v.anahtar];
        return (
          <Card key={v.anahtar} className="h-full">
            <CardContent className="flex items-start gap-3">
              <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", ik?.sinif)}>
                <Icon icon={ik?.ikon} className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{v.baslik}</p>
                <p className="mt-0.5 flex items-baseline gap-1">
                  <span className="font-heading text-2xl font-bold tracking-tight tabular-nums">{v.deger}</span>
                  <span className="text-xs font-medium text-muted-foreground">{v.birim}</span>
                </p>
                <p className="mt-1 text-[11px] leading-tight text-muted-foreground">{v.aciklama}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
