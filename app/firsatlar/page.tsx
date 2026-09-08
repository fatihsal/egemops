
import { FirsatFiltreler } from "@/components/firsatlar/filtreler";
import { FirsatKpiKartlari } from "@/components/firsatlar/kpi";
import { FirsatDurumDonut } from "@/components/firsatlar/durum-donut";
import { FirsatPotansiyelBar } from "@/components/firsatlar/potansiyel-bar";
import { FirsatKaynakDonut } from "@/components/firsatlar/kaynak-donut";
import { FirsatOnceilkliTablo } from "@/components/firsatlar/oncelikli-tablo";
import { FirsatEnYuksekListe } from "@/components/firsatlar/en-yuksek-liste";
import { FirsatVadeKartlari } from "@/components/firsatlar/vade-kartlari";

export default function FirsatlarPage() {
  return (
    <div className="space-y-6">
      {/* Filtreler */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <FirsatFiltreler />
      </div>

      <FirsatKpiKartlari />

      {/* Durum + potansiyel + kaynak dağılımı */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
        <FirsatDurumDonut />
        <FirsatPotansiyelBar />
        <FirsatKaynakDonut />
      </div>

      {/* Öncelikli fırsatlar + en yüksek tasarruf */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8"><FirsatOnceilkliTablo /></div>
        <div className="xl:col-span-4"><FirsatEnYuksekListe /></div>
      </div>

      {/* Vade / etki potansiyeli kartları */}
      <FirsatVadeKartlari />
    </div>
  );
}
