"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RadialOran } from "@/components/kayit-detay/parcalar";
import { useElektrikGesAnaliz } from "@/lib/queries/elektrik-ges";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ElektrikKpi } from "@/lib/types";

const IKON: Record<string, { ikon: string; sinif: string }> = {
  toplam: { ikon: "solar:bolt-circle-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  sebeke: { ikon: "solar:bolt-bold-duotone", sinif: "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300" },
  gesUretim: { ikon: "solar:sun-2-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
  gesOz: { ikon: "solar:battery-charge-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  tep: { ikon: "solar:presentation-graph-bold-duotone", sinif: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300" },
};

function Yon({ kpi }: { kpi: ElektrikKpi }) {
  const arti = kpi.degisimYuzde >= 0;
  const metin =
    kpi.degisimBirim === "puan"
      ? `${sayiOndalik(Math.abs(kpi.degisimYuzde))} puan`
      : `%${sayiOndalik(Math.abs(kpi.degisimYuzde))}`;
  return (
    <div className="mt-auto space-y-0.5 pt-3">
      <span
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold",
          arti
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400",
        )}
      >
        <Icon
          icon={arti ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-down-bold"}
          className="size-3"
        />
        {metin}
      </span>
      <p className="text-[11px] leading-tight text-muted-foreground">
        Geçen yılın aynı dönemine göre
      </p>
    </div>
  );
}

function KpiKart({ kpi }: { kpi: ElektrikKpi }) {
  const ik = IKON[kpi.anahtar];
  const gorsel = kpi.radyal !== undefined
    ? <RadialOran deger={kpi.radyal} renk="#0d9488" className="size-10 shrink-0" yaziSinif="text-[10px]" />
    : ik
      ? (
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", ik.sinif)}>
          <Icon icon={ik.ikon} className="size-6" />
        </span>
      )
      : null;

  return (
    <Card size="sm" className="h-full">
      <CardContent className="flex h-full flex-col">
        <div className="flex items-start gap-2.5">
          {gorsel}
          <span className="mt-0.5 min-h-[32px] flex-1 text-xs font-medium leading-tight text-muted-foreground">
            {kpi.baslik}
          </span>
        </div>

        <div className="mt-2.5 flex items-baseline gap-1">
          <span className="font-heading text-[26px] font-bold leading-none tracking-tight">
            {kpi.birim === "%" ? `%${kpi.deger}` : kpi.deger}
          </span>
          {kpi.birim && kpi.birim !== "%" ? (
            <span className="text-sm font-medium text-muted-foreground">{kpi.birim}</span>
          ) : null}
        </div>
        {kpi.altDeger ? (
          <p className="mt-1 text-xs text-muted-foreground">{kpi.altDeger}</p>
        ) : null}

        <Yon kpi={kpi} />
      </CardContent>
    </Card>
  );
}

export function ElektrikKpi() {
  const { data, isLoading } = useElektrikGesAnaliz();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} size="sm">
            <CardContent className="space-y-3">
              <Skeleton className="size-10 rounded-xl" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {data.kpiler.map((kpi) => (
        <KpiKart key={kpi.anahtar} kpi={kpi} />
      ))}
    </div>
  );
}
