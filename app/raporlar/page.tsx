import Link from "next/link";
import { Icon } from "@iconify/react";

import { RaporFiltreler } from "@/components/raporlar/filtreler";
import { RaporKpiKartlari } from "@/components/raporlar/kpi";
import { RaporKategorileri } from "@/components/raporlar/kategoriler";
import { EnCokIndirilen } from "@/components/raporlar/en-cok-indirilen";
import { RaporTrend } from "@/components/raporlar/trend";
import { SonRaporlar } from "@/components/raporlar/son-raporlar";
import { RaporListesi } from "@/components/raporlar/rapor-listesi";
import { RaporFiltreProvider } from "@/components/raporlar/filtre-store";

export default function RaporlarPage() {
  return (
    <RaporFiltreProvider>
      <div className="space-y-6">
        {/* Başlık + filtreler */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">Enerji Yönetimi</Link>
              <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
              <span className="text-foreground">Raporlar</span>
            </nav>
            <h1 className="text-2xl font-semibold tracking-tight">Raporlar</h1>
            <p className="text-sm text-muted-foreground">
              Enerji verilerinizi analiz edin ve ihtiyacınıza uygun raporları oluşturup dışa aktarın.
            </p>
          </div>

          <RaporFiltreler />
        </div>

        <RaporKpiKartlari />

        {/* Kategoriler + en çok indirilen */}
        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2"><RaporKategorileri /></div>
          <div className="xl:col-span-1"><EnCokIndirilen /></div>
        </div>

        {/* Trend + son oluşturulan */}
        <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
          <div className="xl:col-span-5"><RaporTrend /></div>
          <div className="xl:col-span-7"><SonRaporlar /></div>
        </div>

        {/* Rapor listesi */}
        <RaporListesi />
      </div>
    </RaporFiltreProvider>
  );
}
