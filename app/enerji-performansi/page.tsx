
import { PerformansFiltreler } from "@/components/performans/filtreler";
import { PerformansKpiKartlari } from "@/components/performans/kpi";
import { PerformansIcerik } from "@/components/performans/performans-icerik";

export default function EnerjiPerformansiPage() {
  return (
    <div className="space-y-6">
      {/* Filtreler */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <PerformansFiltreler />
      </div>

      <PerformansKpiKartlari />

      <PerformansIcerik />
    </div>
  );
}
