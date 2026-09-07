"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadialOran } from "@/components/kayit-detay/parcalar";
import { sayi2, sayiOndalik } from "@/lib/format";
import type { EnerjiKayit } from "@/lib/types";

const AY_HARF = ["O", "Ş", "M", "N", "M", "H", "T", "A", "E", "E", "K", "A"];
const GES_TREND = [26, 24, 28, 30, 27, 33, 35, 31, 29, 32, 34, 31];

function Satir({ etiket, deger }: { etiket: string; deger: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{etiket}</span>
      <span className="font-semibold tabular-nums">{deger}</span>
    </div>
  );
}

export function ElektrikGesDetay({ kayit }: { kayit: EnerjiKayit }) {
  const enBuyuk = Math.max(...GES_TREND);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="solar:bolt-bold-duotone" className="size-5 text-blue-600 dark:text-blue-400" />
          Elektrik &amp; GES
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Değer listesi */}
          <div className="space-y-2.5">
            <Satir etiket="Şebeke Elektrik Tüketimi" deger={`${sayi2(kayit.sebekeElektrik)} kWh`} />
            <Satir etiket="GES Toplam Üretimi" deger={`${sayi2(kayit.gesUretim)} kWh`} />
            <Satir etiket="GES Öz Tüketimi" deger={`${sayi2(kayit.gesOzTuketim)} kWh`} />
            <Satir etiket="Şebekeye Verilen Enerji" deger={`${sayi2(kayit.sebekeyeVerilen)} kWh`} />
            <div className="border-t pt-2.5">
              <Satir etiket="Toplam Fabrika Elektrik Tüketimi" deger={`${sayi2(kayit.elektrik)} kWh`} />
            </div>
          </div>

          {/* Radial + trend */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <RadialOran deger={kayit.gesKarsilama} className="mx-auto size-28" yaziSinif="text-lg" />
              <div className="mt-1 text-xs text-muted-foreground">GES Katkı Oranı</div>
            </div>
            <div className="w-full">
              <div className="mb-1 text-xs text-muted-foreground">
                Aylık GES Katkı Oranı (%)
              </div>
              <svg viewBox="0 0 120 32" className="h-8 w-full" preserveAspectRatio="none">
                {GES_TREND.map((v, i) => {
                  const h = (v / enBuyuk) * 28;
                  return (
                    <rect
                      key={i}
                      x={i * 10 + 1}
                      y={30 - h}
                      width={7}
                      height={h}
                      rx={1}
                      className={i === GES_TREND.length - 1 ? "fill-primary" : "fill-primary/30"}
                    />
                  );
                })}
              </svg>
              <div className="mt-0.5 flex justify-between text-[9px] text-muted-foreground">
                {AY_HARF.map((a, i) => (
                  <span key={i}>{a}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2 KPI */}
        <div className="grid grid-cols-2 gap-4 border-t pt-4">
          <div>
            <div className="text-xs text-muted-foreground">Toplam Elektrik TEP</div>
            <div className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              {sayi2(kayit.elektrikTep)}
              <span className="ml-1 text-xs font-normal text-muted-foreground">TEP</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">GES Karşılama Oranı</div>
            <div className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              %{sayiOndalik(kayit.gesKarsilama)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
