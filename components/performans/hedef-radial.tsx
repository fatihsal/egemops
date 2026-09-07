"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RadialOran } from "@/components/kayit-detay/parcalar";
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { sayiOndalik } from "@/lib/format";

export function PerformansHedefRadial() {
  const { data, isLoading } = usePerformansAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">2026 Hedef Gerçekleşme</h3>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading || !data ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
            <RadialOran deger={data.radial.oran} renk="#0d9488" className="size-40 shrink-0" yaziSinif="text-3xl" />
            <ul className="w-full space-y-4 text-sm sm:max-w-[220px]">
              <li className="flex items-center justify-between gap-2 border-b pb-3">
                <span className="text-muted-foreground">Hedef İyileşme</span>
                <span className="font-heading text-base font-bold text-teal-600 dark:text-teal-400">%{data.radial.hedefIyilesme}</span>
              </li>
              <li className="flex items-center justify-between gap-2 border-b pb-3">
                <span className="text-muted-foreground">Gerçekleşen</span>
                <span className="font-heading text-base font-bold text-teal-600 dark:text-teal-400">%{sayiOndalik(data.radial.gerceklesen)}</span>
              </li>
              <li className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Hedefe kalan</span>
                <span className="font-heading text-base font-bold text-amber-600 dark:text-amber-400">
                  {data.radial.hedefeKalan} <span className="text-xs font-normal text-muted-foreground">TEP/ton</span>
                </span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
