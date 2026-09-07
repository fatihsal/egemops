import Link from "next/link";
import { Icon } from "@iconify/react";

import { PerformansFiltreler } from "@/components/performans/filtreler";
import { PerformansKpiKartlari } from "@/components/performans/kpi";
import { PerformansIcerik } from "@/components/performans/performans-icerik";

export default function EnerjiPerformansiPage() {
  return (
    <div className="space-y-6">
      {/* Başlık + filtreler */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Enerji Yönetimi</Link>
            <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
            <span className="text-foreground">Enerji Performansı</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Enerji Performansı
            <Icon icon="solar:info-circle-bold-duotone" className="size-5 text-muted-foreground" />
          </h1>
          <p className="text-sm text-muted-foreground">
            Enerji performans göstergelerini, baz yıl karşılaştırmalarını, hedefleri ve sapmaları takip edin.
          </p>
        </div>

        <PerformansFiltreler />
      </div>

      <PerformansKpiKartlari />

      <PerformansIcerik />
    </div>
  );
}
