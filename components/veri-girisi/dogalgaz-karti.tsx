"use client";

import { Icon } from "@iconify/react";

import { KatlanabilirKart } from "@/components/veri-girisi/katlanabilir-kart";
import { VeriInput } from "@/components/veri-girisi/parcalar";
import { useDil } from "@/components/providers/dil-provider";

export function DogalgazKarti() {
  const { t } = useDil();
  return (
    <KatlanabilirKart
      baslik={t("Doğalgaz")}
      ikon="solar:fire-bold-duotone"
      ikonSinif="bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300"
    >
      <VeriInput etiket={t("Doğalgaz Tüketimi (Sm³)")} birim="Sm³" deger="43.921,18" />

      <div className="flex items-center gap-3 border-t pt-4">
        <span className="flex size-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
          <Icon icon="solar:fire-bold-duotone" className="size-6" />
        </span>
        <div>
          <div className="text-xs text-muted-foreground">{t("Doğalgaz TEP")}</div>
          <div className="text-2xl font-bold tracking-tight text-violet-600 dark:text-violet-400">
            36,02
          </div>
        </div>
      </div>
    </KatlanabilirKart>
  );
}
