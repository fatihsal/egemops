"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTepAnaliz } from "@/lib/queries/tep";
import {
  useAnalizFiltre,
  yilOlcek,
  olcekliDeger,
} from "@/components/providers/analiz-filtre-provider";
import { useDil } from "@/components/providers/dil-provider";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TepKpi } from "@/lib/types";

const IKON: Record<string, { ikon: string; sinif: string }> = {
  toplam: { ikon: "solar:pie-chart-2-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
  elektrik: { ikon: "solar:bolt-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  dogalgaz: { ikon: "solar:fire-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" },
  akaryakit: { ikon: "solar:gas-station-bold-duotone", sinif: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300" },
  yogunluk: { ikon: "solar:speedometer-max-bold-duotone", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
  degisim: { ikon: "solar:graph-up-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
};

function KpiKart({ kpi }: { kpi: TepKpi }) {
  const { yil } = useAnalizFiltre();
  const { t } = useDil();
  const olcek = kpi.birim === "%" ? 1 : yilOlcek(yil);
  const ik = IKON[kpi.anahtar];
  const arti = (kpi.degisimYuzde ?? 0) >= 0;
  const yon = (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold",
        arti ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
      )}
    >
      <Icon icon={arti ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-down-bold"} className="size-3.5" />
      %{sayiOndalik(Math.abs(kpi.degisimYuzde ?? 0))}
    </span>
  );

  return (
    <Card size="sm" className="h-full">
      <CardContent className="flex h-full flex-col">
        <div className="flex items-start gap-2.5">
          {ik ? (
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", ik.sinif)}>
              <Icon icon={ik.ikon} className="size-6" />
            </span>
          ) : null}
          <span className="mt-0.5 min-h-[32px] flex-1 text-xs font-medium leading-tight text-muted-foreground">
            {t(kpi.baslik)}
          </span>
        </div>

        {kpi.sadeDegisim ? (
          <div className="mt-auto pt-4">
            <div className="text-[22px] leading-none">{yon}</div>
            <p className="mt-1.5 text-[11px] leading-tight text-muted-foreground">{t("Geçen yılın aynı dönemine göre")}</p>
          </div>
        ) : (
          <>
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="font-heading text-[26px] font-bold leading-none tracking-tight">{olcekliDeger(kpi.deger ?? "", olcek)}</span>
              {kpi.birim ? <span className="text-sm font-medium text-muted-foreground">{kpi.birim}</span> : null}
            </div>
            <div className="mt-auto space-y-0.5 pt-3 text-xs">
              {yon}
              <p className="text-[11px] leading-tight text-muted-foreground">{t("Geçen yılın aynı dönemine göre")}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function TepKpiKartlari() {
  const { data, isLoading } = useTepAnaliz();

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
