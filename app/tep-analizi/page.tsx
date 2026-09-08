
import { ElektrikFiltreler } from "@/components/elektrik-ges/filtreler";
import { TepKpiKartlari } from "@/components/tep/kpi";
import { TepIcerik } from "@/components/tep/tep-icerik";

export default function TepAnaliziPage() {
  return (
    <div className="space-y-6">
      {/* Filtreler */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <ElektrikFiltreler />
      </div>

      <TepKpiKartlari />

      <TepIcerik />
    </div>
  );
}
