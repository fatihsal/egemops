import { AnalizFiltreProvider } from "@/components/providers/analiz-filtre-provider";
import { ElektrikFiltreler } from "@/components/elektrik-ges/filtreler";
import { ElektrikKpi } from "@/components/elektrik-ges/kpi";
import { ElektrikGesIcerik } from "@/components/elektrik-ges/elektrik-ges-icerik";

export default function ElektrikGesPage() {
  return (
    <AnalizFiltreProvider>
      <div className="space-y-6">
        {/* Filtreler */}
        <div className="flex flex-wrap items-center justify-end gap-3">
          <ElektrikFiltreler />
        </div>

        <ElektrikKpi />

        <ElektrikGesIcerik />
      </div>
    </AnalizFiltreProvider>
  );
}
