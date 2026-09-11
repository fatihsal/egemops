"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { YilAySecim } from "@/components/veri-girisi/yil-ay-secim";
import { useDil } from "@/components/providers/dil-provider";

export function DonemBar() {
  const { t } = useDil();
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <YilAySecim />

          <div className="hidden h-5 w-px bg-border sm:block" />

          <div className="flex items-center gap-2 text-sm">
            <Icon icon="solar:document-text-bold-duotone" className="size-5 text-amber-500" />
            <span className="text-muted-foreground">{t("Kayıt Durumu")}:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {t("Taslak")}
            </span>
          </div>

          <div className="hidden h-5 w-px bg-border sm:block" />

          <div className="flex items-center gap-2 text-sm">
            <Icon icon="solar:clock-circle-bold-duotone" className="size-5 text-primary" />
            <span className="text-muted-foreground">{t("Son Güncelleme")}:</span>
            <span className="font-semibold tabular-nums">26.08.2026 15:20</span>
          </div>
        </div>

        <Button
          className="w-full shrink-0 gap-1.5 bg-teal-600 text-white hover:bg-teal-700 sm:w-auto"
          onClick={() => toast(t("Enerji verisi görünümü"), { description: t("Dönem verileri yenilendi.") })}
        >
          <Icon icon="solar:database-bold-duotone" className="size-4" />
          {t("Enerji Verisi")}
        </Button>
      </CardContent>
    </Card>
  );
}
