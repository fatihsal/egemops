import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { VeriInput } from "@/components/veri-girisi/parcalar";

export function UretimKarti() {
  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Icon icon="solar:buildings-2-bold-duotone" className="size-5" />
          </span>
          <h3 className="font-heading text-base font-semibold">Üretim Verisi</h3>
        </div>

        <VeriInput etiket="Üretim Miktarı (ton)" birim="ton" deger="2.850,00" />

        <div className="flex items-center gap-3 border-t pt-4">
          <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
            <Icon icon="solar:leaf-bold-duotone" className="size-6" />
          </span>
          <div>
            <div className="text-xs text-muted-foreground">Enerji Yoğunluğu</div>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              0,038
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                TEP / ton
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
