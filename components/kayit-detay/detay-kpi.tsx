"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Degisim } from "@/components/kayit-detay/parcalar";
import { sayi2, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { EnerjiKayit } from "@/lib/types";

function KpiKart({
  ikon,
  ikonSinif,
  etiket,
  deger,
  birim,
  degisim,
  oncekiEtiket,
}: {
  ikon: string;
  ikonSinif: string;
  etiket: string;
  deger: string;
  birim: string;
  degisim: number | null;
  oncekiEtiket?: string;
}) {
  return (
    <Card size="sm">
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={cn("flex size-9 items-center justify-center rounded-lg", ikonSinif)}>
            <Icon icon={ikon} className="size-5" />
          </span>
          <span className="text-xs text-muted-foreground">{etiket}</span>
        </div>
        <div className="text-2xl font-bold tracking-tight">
          {deger}
          <span className="ml-1 text-sm font-normal text-muted-foreground">{birim}</span>
        </div>
        {degisim !== null ? (
          <Degisim yuzde={degisim} etiket={oncekiEtiket} />
        ) : (
          <span className="text-xs text-muted-foreground">İlk kayıt</span>
        )}
      </CardContent>
    </Card>
  );
}

function oran(guncel: number, onceki: number | null): number | null {
  if (onceki === null || onceki === 0) return null;
  return Math.round(((guncel - onceki) / onceki) * 1000) / 10;
}

export function DetayKpi({ kayit }: { kayit: EnerjiKayit }) {
  const onc = kayit.oncekiDonem
    ? `(${kayit.oncekiDonem.replace(/\s(\d{2})(\d{2})$/, " '$2")})`
    : undefined;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <KpiKart
        ikon="solar:bolt-circle-bold-duotone"
        ikonSinif="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
        etiket="Toplam Enerji"
        deger={sayi2(kayit.toplamTep)}
        birim="TEP"
        degisim={kayit.degisimYuzde}
        oncekiEtiket={onc}
      />
      <KpiKart
        ikon="solar:bolt-bold-duotone"
        ikonSinif="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
        etiket="Toplam Elektrik"
        deger={sayi2(kayit.elektrikTep)}
        birim="TEP"
        degisim={oran(kayit.elektrikTep, kayit.oncekiElektrikTep)}
        oncekiEtiket={onc}
      />
      <KpiKart
        ikon="solar:fire-bold-duotone"
        ikonSinif="bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300"
        etiket="Doğalgaz"
        deger={sayi2(kayit.dogalgazTep)}
        birim="TEP"
        degisim={oran(kayit.dogalgazTep, kayit.oncekiDogalgazTep)}
        oncekiEtiket={onc}
      />
      <KpiKart
        ikon="solar:gas-station-bold-duotone"
        ikonSinif="bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300"
        etiket="Akaryakıt"
        deger={sayi2(kayit.akaryakitTep)}
        birim="TEP"
        degisim={oran(kayit.akaryakitTep, kayit.oncekiAkaryakitTep)}
        oncekiEtiket={onc}
      />
      <KpiKart
        ikon="solar:speedometer-max-bold-duotone"
        ikonSinif="bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300"
        etiket="Enerji Yoğunluğu"
        deger={kayit.enerjiYogunluk.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
        birim="TEP / ton"
        degisim={kayit.yogunlukDegisim}
        oncekiEtiket={onc}
      />
      <Card size="sm">
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300">
              <Icon icon="solar:pie-chart-2-bold-duotone" className="size-5" />
            </span>
            <span className="text-xs text-muted-foreground">GES Karşılama Oranı</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
            %{sayiOndalik(kayit.gesKarsilama)}
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-teal-500"
              style={{ width: `${kayit.gesKarsilama}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
