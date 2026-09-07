"use client";

import { Droplets, Flame, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTurTuketim } from "@/lib/queries/enerji";
import { useDonem } from "@/components/providers/donem-provider";
import { donemEtiket } from "@/lib/donem";
import { sayi } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { EnerjiTuru } from "@/lib/types";

const IKON: Record<EnerjiTuru, LucideIcon> = {
  elektrik: Zap,
  dogalgaz: Flame,
  su: Droplets,
};

const IKON_RENK: Record<EnerjiTuru, string> = {
  elektrik: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  dogalgaz: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  su: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
};

export function TurTuketim() {
  const { donem } = useDonem();
  const { data, isLoading } = useTurTuketim(donem);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enerji Türleri</CardTitle>
        <CardDescription>{donemEtiket(donem)} · tür bazında tüketim</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))
          : data?.map((t) => {
              const Ikon = IKON[t.tur];
              const arti = t.degisimYuzde >= 0;
              const Ok = arti ? ArrowUpRight : ArrowDownRight;
              return (
                <div
                  key={t.tur}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      IKON_RENK[t.tur],
                    )}
                  >
                    <Ikon className="size-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-muted-foreground">{t.etiket}</div>
                    <div className="font-semibold">
                      {sayi(t.deger)}{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        {t.birim}
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-medium",
                      arti
                        ? "text-red-600 dark:text-red-400"
                        : "text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    <Ok className="size-3.5" />
                    {Math.abs(t.degisimYuzde).toFixed(1)}%
                  </span>
                </div>
              );
            })}
      </CardContent>
    </Card>
  );
}
