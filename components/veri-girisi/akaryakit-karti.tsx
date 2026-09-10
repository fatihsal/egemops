"use client";

import { KatlanabilirKart } from "@/components/veri-girisi/katlanabilir-kart";
import { VeriInput, KpiChip } from "@/components/veri-girisi/parcalar";
import { useDil } from "@/components/providers/dil-provider";

export function AkaryakitKarti() {
  const { t } = useDil();
  return (
    <KatlanabilirKart
      baslik={t("Akaryakıt")}
      ikon="solar:gas-station-bold-duotone"
      ikonSinif="bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <VeriInput etiket={t("Motorin (L)")} birim="L" deger="1.450,00" />
        <VeriInput etiket={t("Benzin (L)")} birim="L" deger="180,00" />
        <VeriInput etiket={t("Diğer (L)")} birim="L" deger="0,00" />
      </div>

      <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
        <KpiChip
          ikon="solar:gas-station-bold-duotone"
          ikonSinif="bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300"
          etiket={t("Toplam Akaryakıt")}
          deger="1.630,00"
          birim="L"
          degerSinif="text-orange-600 dark:text-orange-400"
        />
        <KpiChip
          ikon="solar:fuel-bold-duotone"
          ikonSinif="bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300"
          etiket={t("Akaryakıt TEP")}
          deger="1,39"
        />
      </div>
    </KatlanabilirKart>
  );
}
