"use client";

import { StatCard, StatCardSkeleton } from "@/components/common/stat-card";
import { useEnerjiKpi } from "@/lib/queries/enerji";
import { BUGUN } from "@/lib/donem";
import { sayi, sayi2, sayiOndalik } from "@/lib/format";
import type { EnerjiKpi as EnerjiKpiTip } from "@/lib/types";

// Değişimler bir önceki yılla karşılaştırılıyor.
const KARSILASTIRMA = `vs ${BUGUN.getFullYear() - 1}`;

// ⋮ menü "Detayı gör" hedefleri.
const DETAY: Record<string, string> = {
  toplamEnerji: "/tep-analizi",
  elektrik: "/elektrik-ges",
  ges: "/elektrik-ges",
  dogalgaz: "/dogalgaz",
  akaryakit: "/akaryakit",
  gesKatki: "/elektrik-ges",
};

// Her KPI için alanına uygun Solar (duotone) simge ve renk kutusu.
const IKON: Record<string, { ikon: string; sinif: string }> = {
  toplamEnerji: {
    ikon: "solar:bolt-circle-bold-duotone",
    sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  },
  elektrik: {
    ikon: "solar:bolt-bold-duotone",
    sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  },
  ges: {
    ikon: "solar:sun-2-bold-duotone",
    sinif: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-300",
  },
  dogalgaz: {
    ikon: "solar:fire-bold-duotone",
    sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
  },
  akaryakit: {
    ikon: "solar:gas-station-bold-duotone",
    sinif: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300",
  },
  gesKatki: {
    ikon: "solar:pie-chart-2-bold-duotone",
    sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300",
  },
};

// Birime göre değer gösterimi.
function gosterim(kpi: EnerjiKpiTip): { deger: string; birim?: string } {
  switch (kpi.birim) {
    case "%":
      return { deger: `%${sayi(kpi.deger)}` };
    case "TEP":
      return { deger: sayiOndalik(kpi.deger), birim: "TEP" };
    case "GWh":
      return { deger: sayi2(kpi.deger), birim: "GWh" };
    default:
      return { deger: sayi(kpi.deger), birim: kpi.birim };
  }
}

export function EnerjiKpi() {
  const { data, isLoading } = useEnerjiKpi();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-6">
      {data?.map((kpi) => {
        const g = gosterim(kpi);
        const ik = IKON[kpi.anahtar];
        return (
          <StatCard
            key={kpi.anahtar}
            baslik={kpi.baslik}
            deger={g.deger}
            birim={g.birim}
            degisimYuzde={kpi.degisimYuzde}
            degisimBirim={kpi.degisimBirim}
            karsilastirma={KARSILASTIRMA}
            ikon={ik?.ikon}
            ikonSinif={ik?.sinif}
            detayHref={DETAY[kpi.anahtar]}
          />
        );
      })}
    </div>
  );
}
