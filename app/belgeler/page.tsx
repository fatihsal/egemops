import Link from "next/link";
import { Icon } from "@iconify/react";

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
        {/* Başlık + aksiyonlar */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">Enerji Yönetimi</Link>
              <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
              <span className="text-foreground">Belgeler</span>
            </nav>
            <h1 className="text-2xl font-semibold tracking-tight">Belgeler</h1>
            <p className="text-sm text-muted-foreground">
              Yasal belgeler, sertifikalar, sözleşmeler ve raporları tek merkezde arşivleyin, arayın ve dışa aktarın.
            </p>
          </div>

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
