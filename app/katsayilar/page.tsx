import { Icon } from "@iconify/react";

import { KatsayiFiltreler } from "@/components/katsayilar/filtreler";
import { KatsayiKpiKartlari } from "@/components/katsayilar/kpi";
import { TepKatsayiTablo } from "@/components/katsayilar/tep-tablo";
import { EmisyonTablo } from "@/components/katsayilar/emisyon-tablo";
import { FiyatTablo } from "@/components/katsayilar/fiyat-tablo";
import { GenelParametreler } from "@/components/katsayilar/genel-parametreler";

export default function KatsayilarPage() {
  return (
    <div className="space-y-6">
      {/* Filtreler */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <KatsayiFiltreler />
      </div>

      <KatsayiKpiKartlari />

      {/* Katsayı tabloları — tam genişlik, üstten alta */}
      <TepKatsayiTablo />
      <EmisyonTablo />
      <FiyatTablo />
      <GenelParametreler />

      {/* Alt bilgi çubuğu */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-xs text-muted-foreground shadow-sm">
        <span className="inline-flex items-center gap-2">
          <Icon icon="solar:shield-check-bold-duotone" className="size-4 text-emerald-500" />
          Veri kaynağı: Enerji Verimliliği Tebliği (Resmi Gazete) · Katsayı değişiklikleri geçmiş dönem raporlarını etkilemez.
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon icon="solar:refresh-linear" className="size-4" />
          Son güncelleme: 12.08.2026 09:20
        </span>
      </div>
    </div>
  );
}
