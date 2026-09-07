"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { cn } from "@/lib/utils";
import type { PerformansProje } from "@/lib/types";

const DURUM_SINIF: Record<PerformansProje["durum"], string> = {
  "Devam Ediyor": "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  Fizibilite: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  Teklif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

export function PerformansProjeler() {
  const { data, isLoading } = usePerformansAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Performansı Etkileyen Projeler</h3>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading || !data ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (
          <ul className="flex h-full flex-col justify-center divide-y">
            {data.projeler.map((p) => (
              <li key={p.baslik} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300">
                  <Icon icon="solar:widget-5-bold-duotone" className="size-5" />
                </span>
                <span className="flex-1 truncate text-sm font-medium">{p.baslik}</span>
                <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium", DURUM_SINIF[p.durum])}>
                  {p.durum}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
