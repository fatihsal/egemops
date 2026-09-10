"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { useDil } from "@/components/providers/dil-provider";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { KaynakPerformans } from "@/lib/types";

const STIL: Record<KaynakPerformans["anahtar"], { ikon: string; sinif: string }> = {
  elektrik: { ikon: "solar:bolt-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  dogalgaz: { ikon: "solar:fire-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" },
};

export function PerformansKaynak() {
  const { data, isLoading } = usePerformansAnaliz();
  const { t } = useDil();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-1 items-stretch gap-6 sm:grid-cols-2">
      {data.kaynaklar.map((k) => {
        const s = STIL[k.anahtar];
        return (
          <Card key={k.anahtar} className="h-full">
            <CardContent className="flex h-full items-center gap-4">
              <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", s.sinif)}>
                <Icon icon={s.ikon} className="size-7" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{t(k.etiket)}</p>
                <p className="mt-0.5 flex items-baseline gap-1">
                  <span className="font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</span>
                  <span className="text-sm text-muted-foreground">{k.birim}</span>
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{t("Baz Yıl")}: {k.bazDeger}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-0.5 self-start text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <Icon icon="solar:alt-arrow-down-bold" className="size-3.5" />
                %{sayiOndalik(Math.abs(k.iyilesme))}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
