
import { BelgeFiltreler } from "@/components/belgeler/filtreler";
import { BelgeKpiKartlari } from "@/components/belgeler/kpi";
import { BelgeKategorileri } from "@/components/belgeler/kategoriler";
import { BelgeDepolama } from "@/components/belgeler/depolama";
import { BelgeSureYaklasan } from "@/components/belgeler/sure-yaklasan";
import { BelgeListesi } from "@/components/belgeler/belge-listesi";
import { BelgeFiltreProvider } from "@/components/belgeler/filtre-store";

export default function BelgelerPage() {
  return (
    <BelgeFiltreProvider>
      <div className="space-y-6">
        {/* Filtreler */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <BelgeFiltreler />
        </div>

        <BelgeKpiKartlari />

        {/* Kategoriler — tam genişlik */}
        <BelgeKategorileri />

        {/* Depolama + süresi yaklaşan — ikili */}
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <BelgeDepolama />
          <BelgeSureYaklasan />
        </div>

        {/* Belge listesi — tam genişlik */}
        <BelgeListesi />
      </div>
    </BelgeFiltreProvider>
  );
}
