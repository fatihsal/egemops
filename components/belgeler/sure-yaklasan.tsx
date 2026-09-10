"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KATEGORI_META } from "@/components/belgeler/stiller";
import { useBelgeAnaliz } from "@/lib/queries/belgeler";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

export function BelgeSureYaklasan() {
  const { data, isLoading } = useBelgeAnaliz();
  const { t } = useDil();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Süresi Yaklaşan Belgeler")}</h3>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (
          <ul className="space-y-2.5">
            {data.sureYaklasan.map((s) => {
              const m = KATEGORI_META[s.kategori];
              const acil = s.kalanGun <= 15;
              return (
                <li key={s.id} className="flex items-center gap-3 rounded-lg border border-amber-200/70 bg-amber-50/40 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                  <Icon icon="solar:clock-circle-bold-duotone" className={cn("size-5 shrink-0", acil ? "text-red-500" : "text-amber-500")} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t(s.ad)}</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="size-1.5 rounded-full" style={{ background: m.nokta }} />
                      {t(m.etiket)} · <span className="tabular-nums">{s.tarih}</span>
                    </p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap", acil ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300")}>
                    {s.kalanGun} {t("gün")}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
