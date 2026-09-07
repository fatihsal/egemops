import Link from "next/link";
import { Icon } from "@iconify/react";

import { ProjeFiltreler } from "@/components/projeler/filtreler";
import { ProjeKpiKartlari } from "@/components/projeler/kpi";
import { AktifProjeler } from "@/components/projeler/aktif-projeler";
import { ProjeYasamDongusu } from "@/components/projeler/yasam-dongusu";
import { ProjeGantt } from "@/components/projeler/gantt";
import { ProjeButceDonut } from "@/components/projeler/butce-donut";
import { ProjeTasarrufBar } from "@/components/projeler/tasarruf-bar";
import { ProjeSagligi } from "@/components/projeler/proje-sagligi";
import { ProjeDikkat } from "@/components/projeler/dikkat";
import { TumProjelerTablo } from "@/components/projeler/tum-projeler-tablo";
import { ProjeFiltreProvider } from "@/components/projeler/filtre-store";

export default function ProjelerPage() {
  return (
    <ProjeFiltreProvider>
    <div className="space-y-6">
      {/* Başlık + filtreler */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Enerji Yönetimi</Link>
            <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
            <span className="text-foreground">Enerji Projeleri</span>
          </nav>
          <h1 className="text-2xl font-semibold tracking-tight">Enerji Projeleri</h1>
          <p className="text-sm text-muted-foreground">
            Onaylanan enerji verimliliği projelerinin bütçe, termin, ilerleme ve gerçekleşen tasarruflarını takip edin.
          </p>
        </div>

        <ProjeFiltreler />
      </div>

      <ProjeKpiKartlari />

      {/* Proje takvimi + aktif projeler + yaşam döngüsü (üstten alta) */}
      <ProjeGantt />
      <AktifProjeler />
      <ProjeYasamDongusu />

      {/* Bütçe + tasarruf + sağlık + dikkat */}
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ProjeButceDonut />
        <ProjeTasarrufBar />
        <ProjeSagligi />
        <ProjeDikkat />
      </div>

      {/* Tüm projeler tablosu */}
      <TumProjelerTablo />
    </div>
    </ProjeFiltreProvider>
  );
}
