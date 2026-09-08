
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
      {/* Filtreler */}
      <div className="flex flex-wrap items-center justify-end gap-3">
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
