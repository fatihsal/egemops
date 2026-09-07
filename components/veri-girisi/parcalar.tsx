import { Icon } from "@iconify/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Etiketli, sağında birim kutusu olan veri girişi. */
export function VeriInput({
  etiket,
  birim,
  deger,
  className,
}: {
  etiket: string;
  birim: string;
  deger: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-medium text-muted-foreground">
        {etiket}
      </Label>
      <div className="flex">
        <Input
          defaultValue={deger}
          className="rounded-r-none border-r-0 font-medium tabular-nums"
        />
        <span className="flex items-center rounded-r-md border border-input bg-muted px-3 text-xs font-medium text-muted-foreground">
          {birim}
        </span>
      </div>
    </div>
  );
}

/** Kartların altındaki görsel KPI göstergesi (ikon + etiket + değer). */
export function KpiChip({
  ikon,
  ikonSinif,
  etiket,
  deger,
  birim,
  degerSinif,
}: {
  ikon: string;
  ikonSinif: string;
  etiket: string;
  deger: string;
  birim?: string;
  degerSinif?: string;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          ikonSinif,
        )}
      >
        <Icon icon={ikon} className="size-4" />
      </span>
      <div className="min-w-0">
        <div className="flex min-h-[30px] items-start text-xs leading-tight text-muted-foreground">
          {etiket}
        </div>
        <div
          className={cn(
            "mt-0.5 whitespace-nowrap text-sm font-bold tracking-tight",
            degerSinif,
          )}
        >
          {deger}
          {birim ? (
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              {birim}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
