import Link from "next/link";
import { Icon } from "@iconify/react";

import { ElektrikFiltreler } from "@/components/elektrik-ges/filtreler";
import { ElektrikKpi } from "@/components/elektrik-ges/kpi";
import { ElektrikGesIcerik } from "@/components/elektrik-ges/elektrik-ges-icerik";

export default function ElektrikGesPage() {
  return (
    <div className="space-y-6">
      {/* Başlık + filtreler */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Enerji Yönetimi
            </Link>
            <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
            <span className="text-foreground">Elektrik &amp; GES Analizi</span>
          </nav>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Elektrik &amp; GES Analizi
            <Icon
              icon="solar:info-circle-bold-duotone"
              className="size-5 text-muted-foreground"
            />
          </h1>
          <p className="text-sm text-muted-foreground">
            Elektrik tüketimi, GES üretimi ve enerji akışını analiz edin.
          </p>
        </div>

        <ElektrikFiltreler />
      </div>

      <ElektrikKpi />

      <ElektrikGesIcerik />
    </div>
  );
}
