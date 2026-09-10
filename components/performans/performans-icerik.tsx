"use client";

import * as React from "react";

import { PerformansTrend } from "@/components/performans/performans-trend";
import { PerformansHedefRadial } from "@/components/performans/hedef-radial";
import { PerformansUretimEnerji } from "@/components/performans/uretim-enerji";
import { PerformansBeklenenGerceklesen } from "@/components/performans/beklenen-gerceklesen";
import { PerformansKaynak } from "@/components/performans/kaynak-performans";
import { PerformansProjeler } from "@/components/performans/projeler";
import { PerformansBazYil } from "@/components/performans/baz-yil-karti";
import { PerformansSapmaWaterfall } from "@/components/performans/sapma-waterfall";
import { PerformansHedeflerTablo } from "@/components/performans/hedefler-tablo";
import { PerformansDetayTablo } from "@/components/performans/detay-tablo";
import { PerformansEnpiAnaliz } from "@/components/performans/enpi-analiz";
import { PerformansBazYilAnaliz } from "@/components/performans/bazyil-analiz";
import { PerformansHedeflerAnaliz } from "@/components/performans/hedefler-analiz";
import { PerformansSapmaAnaliz } from "@/components/performans/sapma-analiz";
import { PerformansDetayVeriler } from "@/components/performans/detay-veriler";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

const SEKMELER = [
  { anahtar: "genel", etiket: "Genel Bakış" },
  { anahtar: "enpi", etiket: "EnPI Analizi" },
  { anahtar: "bazyil", etiket: "Baz Yıl" },
  { anahtar: "hedefler", etiket: "Hedefler" },
  { anahtar: "sapma", etiket: "Sapma Analizi" },
  { anahtar: "detay", etiket: "Detaylı Veriler" },
] as const;

type Sekme = (typeof SEKMELER)[number]["anahtar"];

export function PerformansIcerik() {
  const { t } = useDil();
  const [sekme, setSekme] = React.useState<Sekme>("genel");

  return (
    <div className="space-y-6">
      <div className="flex gap-1 overflow-x-auto border-b">
        {SEKMELER.map((s) => (
          <button
            key={s.anahtar}
            type="button"
            onClick={() => setSekme(s.anahtar)}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 px-3 pb-3 text-sm font-medium transition-colors",
              sekme === s.anahtar ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t(s.etiket)}
          </button>
        ))}
      </div>

      {sekme === "genel" ? (
        <div className="space-y-6">
          {/* Trend + radial */}
          <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
            <div className="xl:col-span-7"><PerformansTrend /></div>
            <div className="xl:col-span-5"><PerformansHedefRadial /></div>
          </div>

          {/* Üretim-enerji + beklenen/gerçekleşen */}
          <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
            <div className="xl:col-span-7"><PerformansUretimEnerji /></div>
            <div className="xl:col-span-5"><PerformansBeklenenGerceklesen /></div>
          </div>

          {/* Kaynak performans + projeler */}
          <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
            <div className="xl:col-span-7"><PerformansKaynak /></div>
            <div className="xl:col-span-5"><PerformansProjeler /></div>
          </div>

          {/* Baz yıl + sapma waterfall */}
          <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
            <div className="xl:col-span-4"><PerformansBazYil /></div>
            <div className="xl:col-span-8"><PerformansSapmaWaterfall /></div>
          </div>

          {/* Hedefler tablo + aylık performans tablo (alt alta) */}
          <PerformansHedeflerTablo />
          <PerformansDetayTablo />
        </div>
      ) : sekme === "enpi" ? (
        <PerformansEnpiAnaliz />
      ) : sekme === "bazyil" ? (
        <PerformansBazYilAnaliz />
      ) : sekme === "hedefler" ? (
        <PerformansHedeflerAnaliz />
      ) : sekme === "sapma" ? (
        <PerformansSapmaAnaliz />
      ) : (
        <PerformansDetayVeriler />
      )}
    </div>
  );
}
