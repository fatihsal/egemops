"use client";

import * as React from "react";

import { ElektrikTuketimGrafik } from "@/components/elektrik-ges/tuketim-grafik";
import { GesUretimGrafik } from "@/components/elektrik-ges/ges-uretim-grafik";
import { ElektrikKaynakDagilimi } from "@/components/elektrik-ges/kaynak-dagilimi";
import { ElektrikOzetKartlari } from "@/components/elektrik-ges/ozet-kartlari";
import { ElektrikDetayTablo } from "@/components/elektrik-ges/detay-tablo";
import { AylikAnaliz } from "@/components/elektrik-ges/aylik-analiz";
import { YillarAnaliz } from "@/components/elektrik-ges/yillar-analiz";
import { GesPerformansi } from "@/components/elektrik-ges/ges-performansi";
import { ElektrikDetayVeriler } from "@/components/elektrik-ges/detay-veriler";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

const SEKMELER = [
  { anahtar: "genel", etiket: "Genel Bakış" },
  { anahtar: "aylik", etiket: "Aylık Analiz" },
  { anahtar: "yillar", etiket: "Yıllar Arası Karşılaştırma" },
  { anahtar: "ges", etiket: "GES Performansı" },
  { anahtar: "detay", etiket: "Detaylı Veriler" },
] as const;

type Sekme = (typeof SEKMELER)[number]["anahtar"];

export function ElektrikGesIcerik() {
  const { t } = useDil();
  const [sekme, setSekme] = React.useState<Sekme>("genel");

  return (
    <div className="space-y-6">
      {/* Sekmeler */}
      <div className="flex gap-1 overflow-x-auto border-b">
        {SEKMELER.map((s) => (
          <button
            key={s.anahtar}
            type="button"
            onClick={() => setSekme(s.anahtar)}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 px-3 pb-3 text-sm font-medium transition-colors",
              sekme === s.anahtar
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t(s.etiket)}
          </button>
        ))}
      </div>

      {sekme === "genel" ? (
        <div className="space-y-6">
          {/* Ana grafik — tam genişlik */}
          <ElektrikTuketimGrafik />

          {/* GES üretim akışı + kaynak dağılımı */}
          <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
            <div className="xl:col-span-8">
              <GesUretimGrafik />
            </div>
            <div className="xl:col-span-4">
              <ElektrikKaynakDagilimi />
            </div>
          </div>

          {/* Analiz özet kartları */}
          <ElektrikOzetKartlari />

          {/* Detaylı tablo */}
          <ElektrikDetayTablo />
        </div>
      ) : sekme === "aylik" ? (
        <AylikAnaliz />
      ) : sekme === "yillar" ? (
        <YillarAnaliz />
      ) : sekme === "ges" ? (
        <GesPerformansi />
      ) : (
        <ElektrikDetayVeriler />
      )}
    </div>
  );
}
