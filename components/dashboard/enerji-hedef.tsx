"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnerjiHedef } from "@/lib/queries/enerji";
import { BUGUN } from "@/lib/donem";
import { sayiOndalik } from "@/lib/format";

const BU_YIL = BUGUN.getFullYear();

export function EnerjiHedef() {
  const { data, isLoading } = useEnerjiHedef();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
            <Icon icon="solar:target-bold-duotone" className="size-5" />
          </span>
          <CardTitle>Enerji Performansı</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs text-muted-foreground">
                  {BU_YIL} Hedefi
                </div>
                <div className="text-2xl font-bold tracking-tight">
                  %{sayiOndalik(data?.hedef ?? 0)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Gerçekleşen</div>
                <div className="text-2xl font-bold tracking-tight">
                  %{sayiOndalik(data?.gerceklesen ?? 0)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${data?.ilerlemeYuzde ?? 0}%` }}
                />
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                %{data?.ilerlemeYuzde ?? 0}
              </span>
            </div>

            <div className="text-xs text-muted-foreground">{data?.mesaj}</div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
