"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Degisim } from "@/components/kayit-detay/parcalar";
import { sayiOndalik } from "@/lib/format";
import type { EnerjiKayit } from "@/lib/types";

const f3 = (n: number) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export function UretimDetay({ kayit }: { kayit: EnerjiKayit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="solar:buildings-2-bold-duotone" className="size-5 text-muted-foreground" />
          Üretim Verisi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground">Üretim Miktarı</div>
            <div className="text-2xl font-bold tracking-tight">
              {sayiOndalik(kayit.uretimTon)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">ton</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Enerji Yoğunluğu</div>
            <div className="text-2xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
              {f3(kayit.enerjiYogunluk)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">TEP / ton</span>
            </div>
          </div>
        </div>

        {/* Gauge */}
        <div className="relative mx-auto h-[90px] w-[180px]">
          <Gauge deger={kayit.enerjiYogunluk} max={1} renk="#0d9488" className="h-full w-full" />
          <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 text-[10px] text-muted-foreground">
            <span>0</span>
            <span>1,0</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 border-t pt-3 text-sm">
          <span className="text-muted-foreground">
            Önceki Ay: {f3(kayit.oncekiYogunluk)} TEP / ton
          </span>
          <Degisim yuzde={kayit.yogunlukDegisim} />
        </div>
      </CardContent>
    </Card>
  );
}
