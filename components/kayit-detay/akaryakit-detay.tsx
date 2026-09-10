"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDil } from "@/components/providers/dil-provider";
import { sayi, sayi2 } from "@/lib/format";
import type { EnerjiKayit } from "@/lib/types";

function YakitSatir({
  etiket,
  deger,
  max,
}: {
  etiket: string;
  deger: number;
  max: number;
}) {
  const yuzde = max > 0 ? (deger / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-14 shrink-0 text-muted-foreground">{etiket}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-orange-500"
          style={{ width: `${yuzde}%` }}
        />
      </div>
      <span className="w-16 shrink-0 text-right font-medium tabular-nums">
        {sayi(deger)} L
      </span>
    </div>
  );
}

export function AkaryakitDetay({ kayit }: { kayit: EnerjiKayit }) {
  const { t } = useDil();
  const toplam = kayit.motorin + kayit.benzin + kayit.diger;
  const max = Math.max(kayit.motorin, kayit.benzin, kayit.diger, 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="solar:gas-station-bold-duotone" className="size-5 text-orange-600 dark:text-orange-400" />
          {t("Akaryakıt")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2.5">
          <YakitSatir etiket={t("Motorin")} deger={kayit.motorin} max={max} />
          <YakitSatir etiket={t("Benzin")} deger={kayit.benzin} max={max} />
          <YakitSatir etiket={t("Diğer")} deger={kayit.diger} max={max} />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <div className="text-xs text-muted-foreground">{t("Toplam Akaryakıt")}</div>
            <div className="text-lg font-bold tracking-tight tabular-nums">
              {sayi(toplam)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">L</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">{t("Akaryakıt TEP")}</div>
            <div className="text-lg font-bold tracking-tight text-orange-600 dark:text-orange-400">
              {sayi2(kayit.akaryakitTep)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">TEP</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
