import { AnalizFiltreProvider } from "@/components/providers/analiz-filtre-provider";
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
    <AnalizFiltreProvider>
    <div className="space-y-6">
      {/* Filtreler */}
      <div className="flex flex-wrap items-center justify-end gap-3">
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
    </AnalizFiltreProvider>
  );
}
