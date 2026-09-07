"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBelgeAnaliz } from "@/lib/queries/belgeler";
import { cn } from "@/lib/utils";

const IKON: Record<string, { ikon: string; sinif: string }> = {
  toplam: { ikon: "solar:folder-with-files-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  buAy: { ikon: "solar:cloud-upload-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  yaklasan: { ikon: "solar:clock-circle-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" },
  depolama: { ikon: "solar:database-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" },
};

export function BelgeKpiKartlari() {
  const { data, isLoading } = useBelgeAnaliz();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="flex gap-4"><Skeleton className="size-12 rounded-2xl" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-7 w-20" /><Skeleton className="h-3 w-28" /></div></CardContent></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {data.kpiler.map((k) => {
        const ik = IKON[k.anahtar];
        return (
          <Card key={k.anahtar} className="h-full">
            <CardContent className="flex items-center gap-4">
              <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl", ik?.sinif)}>
                <Icon icon={ik?.ikon} className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted-foreground">{k.baslik}</p>
                <p className="mt-0.5 flex items-baseline gap-1">
                  <span className="font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</span>
                  {k.birim ? <span className="text-sm font-medium text-muted-foreground">{k.birim}</span> : null}
                </p>
                {k.ilerleme != null ? (
                  <span className="mt-1.5 block h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-teal-500" style={{ width: `${k.ilerleme}%` }} />
                  </span>
                ) : null}
                <p className="mt-1 truncate text-[11px] text-muted-foreground">{k.altMetin}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
