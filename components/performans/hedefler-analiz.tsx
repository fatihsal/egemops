"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PerformansHedefRadial } from "@/components/performans/hedef-radial";
import { PerformansHedeflerTablo } from "@/components/performans/hedefler-tablo";
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { cn } from "@/lib/utils";

const num = (s: string) => Number(s.replace(/\./g, "").replace(",", "."));

export function PerformansHedeflerAnaliz() {
  const { data, isLoading } = usePerformansAnaliz();
  if (isLoading || !data) return <Skeleton className="h-[520px] w-full rounded-xl" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <PerformansHedefRadial />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:col-span-7">
          {data.hedefler.map((h) => {
            const baz = num(h.baz), hedef = num(h.hedef), gercek = num(h.gercek);
            const ilerleme = Math.min(100, Math.max(0, Math.round(((baz - gercek) / (baz - hedef)) * 100)));
            const asildi = gercek <= hedef;
            return (
              <Card key={h.gosterge} className="h-full">
                <CardContent className="flex h-full flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{h.gosterge}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-2xl font-bold tracking-tight tabular-nums text-teal-600 dark:text-teal-400">{h.gercek}</span>
                      <span className="text-xs text-muted-foreground">/ hedef {h.hedef}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className={cn("h-full rounded-full", asildi ? "bg-emerald-500" : "bg-teal-500")} style={{ width: `${ilerleme}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Baz {h.baz}</span>
                      <span className={cn("font-medium", asildi ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>%{ilerleme}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <PerformansHedeflerTablo />
    </div>
  );
}
