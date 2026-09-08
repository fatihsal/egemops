"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KAYNAK_ETIKET } from "@/components/firsatlar/stiller";
import { useFirsatAnaliz } from "@/lib/queries/firsatlar";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { FirsatKaynak } from "@/lib/types";

const KAYNAK_STIL: Record<FirsatKaynak, { ikon: string; sinif: string }> = {
  elektrik: { ikon: "solar:bolt-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  dogalgaz: { ikon: "solar:fire-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" },
  akaryakit: { ikon: "solar:gas-station-bold-duotone", sinif: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300" },
};

export function FirsatEnYuksekListe() {
  const { data, isLoading } = useFirsatAnaliz();

  const sirali = [...(data?.firsatlar ?? [])].sort((a, b) => b.tasarruf - a.tasarruf).slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">En Yüksek Tasarruf Potansiyeline Sahip Fırsatlar</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {isLoading || !data ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (
          <>
            <ul className="divide-y">
              {sirali.map((f, i) => {
                const s = KAYNAK_STIL[f.kaynak];
                return (
                  <li key={f.id} className="flex items-center gap-3 py-3 first:pt-0">
                    <span className="w-4 shrink-0 text-center font-heading text-sm font-bold text-muted-foreground">{i + 1}</span>
                    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", s.sinif)}>
                      <Icon icon={s.ikon} className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{f.ad}</p>
                      <p className="text-xs text-muted-foreground">{KAYNAK_ETIKET[f.kaynak]}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-heading text-sm font-bold tabular-nums">{sayiOndalik(f.tasarruf)} <span className="text-xs font-normal text-muted-foreground">TEP / yıl</span></p>
                      <p className="text-[11px] text-muted-foreground">Tasarruf</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
