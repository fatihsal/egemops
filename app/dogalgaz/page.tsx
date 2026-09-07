import Link from "next/link";
import { Icon } from "@iconify/react";

import { ElektrikFiltreler } from "@/components/elektrik-ges/filtreler";
import { DogalgazKpiKartlari } from "@/components/dogalgaz/kpi";
import { DogalgazTuketimGrafik } from "@/components/dogalgaz/tuketim-grafik";
import { DogalgazYillikKarsilastirma } from "@/components/dogalgaz/yillik-karsilastirma";
import { DogalgazYogunlukGrafik } from "@/components/dogalgaz/yogunluk-grafik";
import { DogalgazMevsimselDonut } from "@/components/dogalgaz/mevsimsel-donut";
import { DogalgazYtdKarti } from "@/components/dogalgaz/ytd-karti";
import { DogalgazVerimlilikFirsatlari } from "@/components/dogalgaz/verimlilik-firsatlari";
import { DogalgazDetayTablo } from "@/components/dogalgaz/detay-tablo";

export default function DogalgazPage() {
  return (
    <div className="space-y-6">
      {/* Başlık + filtreler */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Enerji Yönetimi
            </Link>
            <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
            <span className="text-foreground">Doğalgaz Analizi</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Doğalgaz Analizi
            <Icon icon="solar:info-circle-bold-duotone" className="size-5 text-muted-foreground" />
          </h1>
          <p className="text-sm text-muted-foreground">
            Doğalgaz tüketimi, TEP karşılığı ve verimlilik eğilimlerini analiz edin.
          </p>
        </div>

        <ElektrikFiltreler />
      </div>

      <DogalgazKpiKartlari />

      {/* Ana grafik + yıllık karşılaştırma */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <DogalgazTuketimGrafik />
        </div>
        <div className="xl:col-span-5">
          <DogalgazYillikKarsilastirma />
        </div>
      </div>

      {/* Doğalgaz yoğunluğu — tam genişlik */}
      <DogalgazYogunlukGrafik />

      {/* Mevsimsel + YTD + verimlilik fırsatları */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
        <DogalgazMevsimselDonut />
        <DogalgazYtdKarti />
        <DogalgazVerimlilikFirsatlari />
      </div>

      {/* Aylık detaylı veriler */}
      <DogalgazDetayTablo />
    </div>
  );
}
