"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAkaryakitAnaliz } from "@/lib/queries/akaryakit";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

function Fark({ yuzde }: { yuzde: number }) {
  const arti = yuzde >= 0;
  return (
    <span
      className={cn(
        "inline-flex w-14 items-center justify-end gap-0.5 text-xs font-semibold",
        arti ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
      )}
    >
      <span className="text-[9px] leading-none">{arti ? "▲" : "▼"}</span>
      %{sayiOndalik(Math.abs(yuzde))}
    </span>
  );
}

export function AkaryakitYtdKarti() {
  const { data, isLoading } = useAkaryakitAnaliz();

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const o = data.ytd;
  const satirlar = [
    { etiket: "Toplam Akaryakıt", deger: o.toplamLitre, birim: "Litre", degisim: o.toplamDegisim },
    { etiket: "Toplam TEP", deger: o.tep, birim: "TEP", degisim: o.tepDegisim },
    { etiket: "Ortalama", deger: o.ortalama, birim: "Litre", degisim: o.ortalamaDegisim },
    { etiket: "Araç Başına", deger: o.aracBasi, birim: "L/araç", degisim: o.aracBasiDegisim },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Yılbaşından Bu Yana (YTD)</h3>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="flex h-full flex-col justify-between divide-y">
          {satirlar.map((k) => (
            <li key={k.etiket} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <span className="text-sm text-muted-foreground">{k.etiket}</span>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-lg font-bold tracking-tight tabular-nums">{k.deger}</span>
                <span className="w-14 text-xs text-muted-foreground">{k.birim}</span>
                <Fark yuzde={k.degisim} />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
