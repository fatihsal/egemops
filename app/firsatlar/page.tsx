import Link from "next/link";
import { Icon } from "@iconify/react";

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
      {/* Başlık + filtreler */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Enerji Yönetimi</Link>
            <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
            <span className="text-foreground">Enerji Fırsatları</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight">Enerji Fırsatları</h1>
          <p className="text-sm text-muted-foreground">
            Enerji verimliliği fırsatlarını görüntüleyin, potansiyel tasarrufları analiz edin ve uygulama ilerlemesini takip edin.
          </p>
        </div>

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
