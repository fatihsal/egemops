import { KatlanabilirKart } from "@/components/veri-girisi/katlanabilir-kart";
import { VeriInput, KpiChip } from "@/components/veri-girisi/parcalar";

export function AkaryakitKarti() {
  return (
    <KatlanabilirKart
      baslik="Akaryakıt"
      ikon="solar:gas-station-bold-duotone"
      ikonSinif="bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <VeriInput etiket="Motorin (L)" birim="L" deger="1.450,00" />
        <VeriInput etiket="Benzin (L)" birim="L" deger="180,00" />
        <VeriInput etiket="Diğer (L)" birim="L" deger="0,00" />
      </div>

      <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
        <KpiChip
          ikon="solar:gas-station-bold-duotone"
          ikonSinif="bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300"
          etiket="Toplam Akaryakıt"
          deger="1.630,00"
          birim="L"
          degerSinif="text-orange-600 dark:text-orange-400"
        />
        <KpiChip
          ikon="solar:fuel-bold-duotone"
          ikonSinif="bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300"
          etiket="Akaryakıt TEP"
          deger="1,39"
        />
      </div>
    </KatlanabilirKart>
  );
}
