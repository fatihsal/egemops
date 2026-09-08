import { KatlanabilirKart } from "@/components/veri-girisi/katlanabilir-kart";
import { VeriInput, KpiChip } from "@/components/veri-girisi/parcalar";

export function ElektrikGesKarti() {
  return (
    <KatlanabilirKart
      baslik="Elektrik & GES"
      ikon="solar:bolt-bold-duotone"
      ikonSinif="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
    >
      {/* Girdiler */}
      <div className="grid gap-4 @min-[26rem]:grid-cols-2">
        <VeriInput etiket="Şebeke Elektrik Tüketimi (kWh)" birim="kWh" deger="598.217,40" />
        <VeriInput etiket="GES Toplam Üretimi (kWh)" birim="kWh" deger="295.000,00" />
        <VeriInput etiket="GES Öz Tüketimi (kWh)" birim="kWh" deger="240.000,00" />
        <VeriInput etiket="Şebekeye Verilen Enerji (kWh)" birim="kWh" deger="55.000,00" />
      </div>

      {/* KPI'lar */}
      <div className="grid gap-3 border-t pt-4 @min-[28rem]:grid-cols-3">
        <KpiChip
          ikon="solar:plug-circle-bold-duotone"
          ikonSinif="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
          etiket="Toplam Elektrik Tüketimi"
          deger="838.217,40"
          birim="kWh"
          degerSinif="text-blue-600 dark:text-blue-400"
        />
        <KpiChip
          ikon="solar:battery-charge-bold-duotone"
          ikonSinif="bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300"
          etiket="Toplam Elektrik TEP"
          deger="72,09"
        />
        <KpiChip
          ikon="solar:pie-chart-2-bold-duotone"
          ikonSinif="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300"
          etiket="GES Karşılama Oranı"
          deger="%28,6"
          degerSinif="text-amber-600 dark:text-amber-400"
        />
      </div>
    </KatlanabilirKart>
  );
}
