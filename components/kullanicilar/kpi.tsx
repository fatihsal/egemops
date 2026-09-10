"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useKullaniciAnaliz } from "@/lib/queries/kullanicilar";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

const IKON: Record<string, { ikon: string; sinif: string }> = {
  toplam: { ikon: "solar:users-group-rounded-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  aktif: { ikon: "solar:user-check-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
  davet: { ikon: "solar:letter-bold-duotone", sinif: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" },
  yonetici: { ikon: "solar:shield-user-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
};

export function KullaniciKpiKartlari() {
  const { data, isLoading } = useKullaniciAnaliz();
  const { t } = useDil();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="flex gap-4"><Skeleton className="size-12 rounded-2xl" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-7 w-16" /><Skeleton className="h-3 w-28" /></div></CardContent></Card>
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
                <p className="truncate text-xs text-muted-foreground">{t(k.baslik)}</p>
                <p className="mt-0.5 font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{t(k.altMetin)}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
