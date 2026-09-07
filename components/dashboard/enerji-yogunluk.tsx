"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnerjiYogunluk } from "@/lib/queries/enerji";
import { BUGUN } from "@/lib/donem";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

const ONCEKI_YIL = BUGUN.getFullYear() - 1;
const f3 = (n: number) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export function EnerjiYogunluk() {
  const { data, isLoading } = useEnerjiYogunluk();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
            <Icon icon="solar:graph-up-bold-duotone" className="size-5" />
          </span>
          <CardTitle>Enerji Yoğunluğu</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight">
                {f3(data?.deger ?? 0)}
                <span className="ml-1 text-sm font-normal text-muted-foreground">
                  TEP / ton
                </span>
              </span>
              {/* düşüş iyidir → yeşil */}
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium",
                  (data?.degisimYuzde ?? 0) <= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                <span className="text-[9px] leading-none">
                  {(data?.degisimYuzde ?? 0) >= 0 ? "▲" : "▼"}
                </span>
                %{sayiOndalik(Math.abs(data?.degisimYuzde ?? 0))}
              </span>
              <span className="text-xs text-muted-foreground">vs {ONCEKI_YIL}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Geçen yıl: {f3(data?.gecenYil ?? 0)} TEP / ton
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
