import Link from "next/link";
import { Icon } from "@iconify/react";

import { ElektrikFiltreler } from "@/components/elektrik-ges/filtreler";
import { AkaryakitKpiKartlari } from "@/components/akaryakit/kpi";
import { AkaryakitTuketimGrafik } from "@/components/akaryakit/tuketim-grafik";
import { AkaryakitYillikKarsilastirma } from "@/components/akaryakit/yillik-karsilastirma";
import { AkaryakitKullanimGrafik } from "@/components/akaryakit/kullanim-grafik";
import { AkaryakitTurDagilimiDonut } from "@/components/akaryakit/tur-dagilimi-donut";
import { AkaryakitYtdKarti } from "@/components/akaryakit/ytd-karti";
import { AkaryakitVerimlilikFirsatlari } from "@/components/akaryakit/verimlilik-firsatlari";
import { AkaryakitDetayTablo } from "@/components/akaryakit/detay-tablo";

export default function AkaryakitPage() {
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
            <span className="text-foreground">Akaryakıt</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Akaryakıt
            <Icon icon="solar:info-circle-bold-duotone" className="size-5 text-muted-foreground" />
          </h1>
          <p className="text-sm text-muted-foreground">
            Motorin/benzin/diğer kırılımı, araç ve jeneratör bazında tüketim ve trend analizi.
          </p>
        </div>

        <ElektrikFiltreler />
      </div>

      <AkaryakitKpiKartlari />

      {/* Ana grafik + yıllık karşılaştırma */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <AkaryakitTuketimGrafik />
        </div>
        <div className="xl:col-span-5">
          <AkaryakitYillikKarsilastirma />
        </div>
      </div>

      {/* Araç & jeneratör bazında tüketim — tam genişlik */}
      <AkaryakitKullanimGrafik />

      {/* Yakıt türü + YTD + verimlilik fırsatları */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
        <AkaryakitTurDagilimiDonut />
        <AkaryakitYtdKarti />
        <AkaryakitVerimlilikFirsatlari />
      </div>

      {/* Aylık detaylı veriler */}
      <AkaryakitDetayTablo />
    </div>
  );
}
