"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkline } from "@/components/common/sparkline";
import { useDil } from "@/components/providers/dil-provider";
import { sayi2 } from "@/lib/format";
import type { EnerjiKayit } from "@/lib/types";

const TREND = [33, 35, 34, 38, 36, 41, 44, 40, 37, 42, 45, 44];

export function DogalgazDetay({ kayit }: { kayit: EnerjiKayit }) {
  const { t } = useDil();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="solar:fire-bold-duotone" className="size-5 text-violet-600 dark:text-violet-400" />
          {t("Doğalgaz")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">{t("Doğalgaz Tüketimi")}</span>
          <span className="text-lg font-bold tracking-tight tabular-nums">
            {sayi2(kayit.dogalgaz)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">Sm³</span>
          </span>
        </div>
        <div className="flex items-baseline justify-between border-t pt-3">
          <span className="text-sm text-muted-foreground">{t("Doğalgaz TEP")}</span>
          <span className="text-lg font-bold tracking-tight text-violet-600 dark:text-violet-400">
            {sayi2(kayit.dogalgazTep)}
            <span className="ml-1 text-xs font-normal text-muted-foreground">TEP</span>
          </span>
        </div>

        <div className="border-t pt-3">
          <div className="mb-2 text-xs text-muted-foreground">
            {t("Son 12 Ay Tüketim (Sm³)")}
          </div>
          <Sparkline data={TREND} renk="#8b5cf6" className="h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
