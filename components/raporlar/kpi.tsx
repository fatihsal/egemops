"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRaporAnaliz } from "@/lib/queries/raporlar";
import { cn } from "@/lib/utils";

const IKON: Record<string, { ikon: string; sinif: string }> = {
  olusturulan: { ikon: "solar:document-add-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  indirilen: { ikon: "solar:download-square-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  zamanlanan: { ikon: "solar:clock-circle-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" },
  sablon: { ikon: "solar:documents-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" },
  encok: { ikon: "solar:chart-2-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
  kapsam: { ikon: "solar:pie-chart-3-bold-duotone", sinif: "bg-pink-50 text-pink-600 dark:bg-pink-950 dark:text-pink-300" },
};

export function RaporKpiKartlari() {
  const { data, isLoading } = useRaporAnaliz();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="size-9 rounded-xl" />
              </div>
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3 w-24" />
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
        const metin = k.boyut === "metin";
        return (
          <Card key={k.anahtar} className="h-full">
            <CardContent className="flex h-full flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-muted-foreground">{k.baslik}</p>
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", ik?.sinif)}>
                  <Icon icon={ik?.ikon} className="size-5" />
                </span>
              </div>
              <p className={cn("font-heading font-bold tracking-tight", metin ? "text-sm leading-snug" : "text-2xl tabular-nums")}>
                {k.deger}
              </p>
              <p className="mt-auto text-[11px] text-muted-foreground">{k.altMetin}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
