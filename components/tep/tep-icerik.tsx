"use client";

import * as React from "react";

import { TepTuketimGrafik } from "@/components/tep/tuketim-grafik";
import { TepYillikGrafik } from "@/components/tep/yillik-grafik";
import { TepKaynakDagilimi } from "@/components/tep/kaynak-dagilimi";
import { TepYtdKarti } from "@/components/tep/ytd-karti";
import { TepDegisimWaterfall } from "@/components/tep/degisim-waterfall";
import { TepYogunlukGrafik } from "@/components/tep/yogunluk-grafik";
import { TepBazYilKarti } from "@/components/tep/baz-yil-karti";
import { TepUcNoktaKarti } from "@/components/tep/uc-nokta-karti";
import { TepDetayTablo } from "@/components/tep/detay-tablo";
import { TepAylikAnaliz } from "@/components/tep/aylik-analiz";
import { TepYillarAnaliz } from "@/components/tep/yillar-analiz";
import { TepYogunlukAnaliz } from "@/components/tep/yogunluk-analiz";
import { TepDetayVeriler } from "@/components/tep/detay-veriler";
import { cn } from "@/lib/utils";

const SEKMELER = [
  { anahtar: "genel", etiket: "Genel Bakış" },
  { anahtar: "aylik", etiket: "Aylık Analiz" },
  { anahtar: "yillar", etiket: "Yıllar Arası Karşılaştırma" },
  { anahtar: "yogunluk", etiket: "Yoğunluk Analizi" },
  { anahtar: "detay", etiket: "Detaylı Veriler" },
] as const;

type Sekme = (typeof SEKMELER)[number]["anahtar"];

export function TepIcerik() {
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
            {s.etiket}
          </button>
        ))}
      </div>

      {sekme === "genel" ? (
        <div className="space-y-6">
          {/* Ana grafik + yıllık + kaynak dağılımı */}
          <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
            {/* Ana grafik — yatayda geniş (yıllığın yerini de kaplar) */}
            <div className="xl:col-span-9">
              <TepTuketimGrafik />
            </div>
            <div className="xl:col-span-3">
              <TepKaynakDagilimi />
            </div>
          </div>

          {/* YTD + değişim + yoğunluk */}
          <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
            <TepYtdKarti />
            <TepDegisimWaterfall />
            <TepYogunlukGrafik />
          </div>

          {/* Yıllık + baz yıl + en yüksek + en düşük */}
          <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <TepYillikGrafik />
            <TepBazYilKarti />
            <TepUcNoktaKarti tur="yuksek" />
            <TepUcNoktaKarti tur="dusuk" />
          </div>

          {/* Detaylı tablo */}
          <TepDetayTablo />
        </div>
      ) : sekme === "aylik" ? (
        <TepAylikAnaliz />
      ) : sekme === "yillar" ? (
        <TepYillarAnaliz />
      ) : sekme === "yogunluk" ? (
        <TepYogunlukAnaliz />
      ) : (
        <TepDetayVeriler />
      )}
    </div>
  );
}
