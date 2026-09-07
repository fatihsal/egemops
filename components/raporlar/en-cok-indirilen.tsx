"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRaporFiltre } from "@/components/raporlar/filtre-store";
import { useRaporAnaliz } from "@/lib/queries/raporlar";

export function EnCokIndirilen() {
  const { data, isLoading } = useRaporAnaliz();
  const { sifirla } = useRaporFiltre();

  const tumunuGor = () => {
    sifirla();
    document.getElementById("rapor-listesi")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">En Çok İndirilen Raporlar</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading || !data ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : (
          <>
            <ul className="divide-y">
              {data.enCokIndirilen.map((r) => (
                <li key={r.sira} className="flex items-center gap-3 py-2.5 first:pt-0">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">{r.sira}</span>
                  <p className="min-w-0 flex-1 truncate text-sm font-medium">{r.ad}</p>
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">{r.adet} kez</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={tumunuGor}
              className="mt-auto inline-flex items-center gap-1 self-start text-sm font-medium text-primary transition-opacity hover:opacity-80"
            >
              Tüm Raporları Görüntüle
              <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
            </button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
