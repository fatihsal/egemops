import { AnalizFiltreProvider } from "@/components/providers/analiz-filtre-provider";
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
    <AnalizFiltreProvider>
    <div className="space-y-6">
      {/* Filtreler */}
      <div className="flex flex-wrap items-center justify-end gap-3">
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
    </AnalizFiltreProvider>
  );
}
