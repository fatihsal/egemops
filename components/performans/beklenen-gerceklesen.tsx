"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkline } from "@/components/common/sparkline";
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { sayi } from "@/lib/format";

export function PerformansBeklenenGerceklesen() {
  const { data, isLoading } = usePerformansAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Beklenen ve Gerçekleşen Enerji</h3>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading || !data ? (
          <Skeleton className="h-[240px] w-full" />
        ) : (
          <div className="grid h-full grid-cols-1 items-center gap-6 sm:grid-cols-3">
            {[
              { etiket: "Beklenen", deger: data.beklenen.beklenen, renk: "#2563eb", trend: data.beklenen.beklenenTrend, sinif: "text-blue-600 dark:text-blue-400" },
              { etiket: "Gerçekleşen", deger: data.beklenen.gerceklesen, renk: "#0d9488", trend: data.beklenen.gerceklesenTrend, sinif: "text-teal-600 dark:text-teal-400" },
              { etiket: "Performans Kazancı", deger: data.beklenen.kazanc, renk: "#059669", trend: data.beklenen.kazancTrend, sinif: "text-emerald-600 dark:text-emerald-400" },
            ].map((k) => (
              <div key={k.etiket} className="space-y-2 text-center sm:text-left">
                <p className="text-xs text-muted-foreground">{k.etiket}</p>
                <p className="flex items-baseline justify-center gap-1 sm:justify-start">
                  <span className={`font-heading text-3xl font-bold tracking-tight tabular-nums ${k.sinif}`}>{sayi(k.deger)}</span>
                  <span className="text-sm text-muted-foreground">TEP</span>
                </p>
                <Sparkline data={k.trend} renk={k.renk} className="h-8 w-full" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
