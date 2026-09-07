"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { sayiOndalik } from "@/lib/format";

export function PerformansBazYil() {
  const { data, isLoading } = usePerformansAnaliz();

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
    );
  }

  const b = data.bazYil;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon icon="solar:calendar-minimalistic-bold-duotone" className="size-5 text-teal-600 dark:text-teal-400" />
          <h3 className="font-heading text-base font-medium">Baz Yıla Göre Performans</h3>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
          <div>
            <p className="text-[11px] text-muted-foreground">Baz Yıl</p>
            <p className="mt-1 font-heading text-2xl font-bold tracking-tight">{b.bazYil}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Baz EnPI</p>
            <p className="mt-1 font-heading text-2xl font-bold tracking-tight tabular-nums">{b.bazEnPI}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">2026 EnPI</p>
            <p className="mt-1 font-heading text-2xl font-bold tracking-tight tabular-nums text-teal-600 dark:text-teal-400">{b.guncelEnPI}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">İyileşme</p>
            <p className="mt-1 inline-flex items-baseline gap-1 font-heading text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              <Icon icon="solar:alt-arrow-down-bold" className="size-4 self-center" />
              %{sayiOndalik(Math.abs(b.iyilesme))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
