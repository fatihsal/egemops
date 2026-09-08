"use client";

import { DonemProvider } from "@/components/providers/donem-provider";
import { DonemSecici } from "@/components/dashboard/donem-secici";
import { VeriDurumu } from "@/components/dashboard/veri-durumu";
import { EnerjiKpi } from "@/components/dashboard/enerji-kpi";
import { YillikTepGrafik } from "@/components/dashboard/yillik-tep-grafik";
import { EnerjiKaynakDagilimi } from "@/components/dashboard/enerji-kaynak-dagilimi";
import { SebekeGesGrafik } from "@/components/dashboard/sebeke-ges-grafik";
import { GesPaneli } from "@/components/dashboard/ges-paneli";
import { EnerjiYogunluk } from "@/components/dashboard/enerji-yogunluk";
import { EnerjiHedef } from "@/components/dashboard/enerji-hedef";
import { EnerjiFirsatlari } from "@/components/dashboard/enerji-firsatlari";
import { VeriDurumKarti } from "@/components/dashboard/veri-durum-karti";
import { SonGuncellemeler } from "@/components/dashboard/son-guncellemeler";

export function EnerjiDashboard() {
  return (
    <DonemProvider>
      <div className="space-y-6">
        {/* Araç çubuğu: dönem seçici (sol) · veri durumu (sağ) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DonemSecici />
          <VeriDurumu />
        </div>

        <EnerjiKpi />

        {/* Sol 2/3: TEP ve Şebeke/GES alt alta (eşit boyut) ·
            Sağ 1/3: donut + GES paneli */}
        <div className="grid gap-6 xl:grid-cols-3 [&>*]:min-w-0">
          <div className="space-y-6 xl:col-span-2">
            <YillikTepGrafik />
            <SebekeGesGrafik />
          </div>
          <div className="space-y-6">
            <EnerjiKaynakDagilimi />
            <GesPaneli />
          </div>
        </div>

        {/* Alt satır 1: yoğunluk · performans · fırsatlar */}
        <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
          <EnerjiYogunluk />
          <EnerjiHedef />
          <EnerjiFirsatlari />
        </div>

        {/* Alt satır 2: veri durumu · son güncellemeler */}
        <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
          <VeriDurumKarti />
          <div className="lg:col-span-2">
            <SonGuncellemeler />
          </div>
        </div>
      </div>
    </DonemProvider>
  );
}
