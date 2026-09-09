"use client";

import * as React from "react";
import { Icon } from "@iconify/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useVeriGirisi } from "@/components/veri-girisi/form-store";

/** Etiketli, sağında birim kutusu olan sayısal veri girişi (doğrulamalı). */
export function VeriInput({
  etiket,
  birim,
  deger,
  className,
  zorunlu = true,
}: {
  etiket: string;
  birim: string;
  deger: string;
  className?: string;
  /** Boş bırakılabilir mi? Varsayılan: hayır (zorunlu). */
  zorunlu?: boolean;
}) {
  const { kaydet, sil, denendi } = useVeriGirisi();
  const id = React.useId();
  const [val, setVal] = React.useState(deger);
  const [dokunuldu, setDokunuldu] = React.useState(false);

  const bos = val.trim() === "";
  const sayi = Number(val.replace(/\./g, "").replace(",", "."));
  const sayiMi = !bos && !Number.isNaN(sayi);
  const negatif = sayiMi && sayi < 0;
  const gecerli = bos ? !zorunlu : sayiMi && !negatif;
  const hata = gecerli
    ? null
    : bos
      ? "Zorunlu alan"
      : !sayiMi
        ? "Geçerli bir sayı girin"
        : "Negatif olamaz";
  const goster = (dokunuldu || denendi) && !!hata;

  React.useEffect(() => {
    kaydet(id, { etiket, gecerli });
    return () => sil(id);
  }, [id, etiket, gecerli, kaydet, sil]);

  return (
    <div className={cn("min-w-0 space-y-1.5", className)}>
      <Label className="text-xs font-medium text-muted-foreground">
        {etiket}
      </Label>
      <div className="flex min-w-0">
        <Input
          value={val}
          inputMode="decimal"
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => setDokunuldu(true)}
          aria-invalid={goster || undefined}
          className={cn(
            "min-w-0 rounded-r-none border-r-0 font-medium tabular-nums",
            goster && "border-red-500 focus-visible:ring-red-500/30",
          )}
        />
        <span
          className={cn(
            "flex items-center rounded-r-md border border-input bg-muted px-3 text-xs font-medium text-muted-foreground",
            goster && "border-red-500",
          )}
        >
          {birim}
        </span>
      </div>
      {goster ? (
        <p className="text-[11px] font-medium text-red-600 dark:text-red-400">
          {hata}
        </p>
      ) : null}
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
