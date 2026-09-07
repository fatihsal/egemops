"use client";

import { Icon } from "@iconify/react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DURUM_META, KAYNAK_ETIKET, KAYNAK_RENK, ONCELIK } from "@/components/firsatlar/stiller";
import { useFirsatAnaliz } from "@/lib/queries/firsatlar";
import { sayi, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TumFirsatlarDrawer({ etiket, className }: { etiket: string; className?: string }) {
  const { data } = useFirsatAnaliz();
  const sirali = [...(data?.firsatlar ?? [])].sort((a, b) => b.tasarruf - a.tasarruf);
  const toplamTasarruf = sirali.reduce((t, f) => t + f.tasarruf, 0);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            type="button"
            className={cn("inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-80", className)}
          />
        }
      >
        {etiket}
        <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-xl">
        <SheetHeader className="border-b p-5">
          <SheetTitle>Tüm Fırsatlar</SheetTitle>
          <SheetDescription>
            {sirali.length} fırsat · toplam {sayiOndalik(toplamTasarruf)} TEP/yıl potansiyel tasarruf
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {sirali.map((f) => {
            const o = ONCELIK[f.oncelik];
            const d = DURUM_META[f.durum];
            return (
              <div key={f.id} className="flex items-center gap-3 rounded-xl border p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{f.ad}</p>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", o.sinif)}>{o.etiket}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full" style={{ background: KAYNAK_RENK[f.kaynak] }} />
                      {KAYNAK_ETIKET[f.kaynak]}
                    </span>
                    <span className="font-medium text-foreground tabular-nums">{sayiOndalik(f.tasarruf)} TEP/yıl</span>
                    <span className="tabular-nums">Yatırım {sayi(f.yatirim)} €</span>
                    <span className="tabular-nums">{sayiOndalik(f.geriDonus)} yıl</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap", d.sinif)}>{d.etiket}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-teal-500" style={{ width: `${f.ilerleme}%` }} />
                    </span>
                    <span className="w-8 text-right text-[11px] tabular-nums text-muted-foreground">%{f.ilerleme}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
