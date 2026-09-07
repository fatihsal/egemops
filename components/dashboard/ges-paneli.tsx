"use client";

import { Icon } from "@iconify/react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGesPerformans } from "@/lib/queries/enerji";
import { sayi2, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

interface SatirProps {
  ikon: string;
  ikonSinif: string;
  etiket: string;
  deger: string;
  birim: string;
}

function Satir({ ikon, ikonSinif, etiket, deger, birim }: SatirProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          ikonSinif,
        )}
      >
        <Icon icon={ikon} className="size-5" />
      </span>
      <span className="flex-1 text-sm text-muted-foreground">{etiket}</span>
      <span className="text-sm font-semibold">
        {deger}
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          {birim}
        </span>
      </span>
    </div>
  );
}

export function GesPaneli() {
  const { data, isLoading } = useGesPerformans();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  const arti = (data?.karsilamaDegisim ?? 0) >= 0;

  return (
    <div className="space-y-6">
      {/* GES Performansı */}
      <Card>
        <CardHeader>
          <CardTitle>GES Performansı</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Satir
            ikon="solar:sun-2-bold-duotone"
            ikonSinif="bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-300"
            etiket="Yıllık Üretim"
            deger={sayi2(data?.yillikUretim ?? 0)}
            birim="GWh"
          />
          <Satir
            ikon="solar:buildings-2-bold-duotone"
            ikonSinif="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
            etiket="Öz Tüketim"
            deger={sayi2(data?.ozTuketim ?? 0)}
            birim="GWh"
          />
          <Satir
            ikon="solar:plug-circle-bold-duotone"
            ikonSinif="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300"
            etiket="Şebekeye Verilen"
            deger={sayi2(data?.sebekeyeVerilen ?? 0)}
            birim="GWh"
          />
        </CardContent>
      </Card>

      {/* GES Karşılama Oranı */}
      <Card>
        <CardHeader>
          <CardTitle>GES Karşılama Oranı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mx-auto h-[150px] w-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="72%"
                outerRadius="100%"
                data={[{ ad: "oran", deger: data?.karsilamaOrani ?? 0 }]}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                <RadialBar
                  dataKey="deger"
                  cornerRadius={12}
                  fill="#14b8a6"
                  background={{ fill: "var(--muted)" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold">
                %{data?.karsilamaOrani ?? 0}
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-1 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-medium",
                arti
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              <span className="text-[9px] leading-none">{arti ? "▲" : "▼"}</span>
              {sayiOndalik(Math.abs(data?.karsilamaDegisim ?? 0))} puan
            </span>
            <span className="text-muted-foreground">vs 2025</span>
          </div>
        </CardContent>
      </Card>

      {/* Tahmini Tasarruf */}
      <Card>
        <CardHeader>
          <CardTitle>Tahmini Tasarruf</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
            <Icon icon="solar:leaf-bold-duotone" className="size-6" />
          </span>
          <div>
            <div className="text-xl font-bold tracking-tight">
              {sayiOndalik(data?.tahminiTasarruf ?? 0)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                TEP / yıl
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Yıllık potansiyel tasarruf
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
