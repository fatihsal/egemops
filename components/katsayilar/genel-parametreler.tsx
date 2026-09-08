"use client";

import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KatsayiDuzenleDrawer } from "@/components/katsayilar/duzenle-drawer";
import { useKatsayiAnaliz } from "@/lib/queries/katsayilar";
import { queryKeys } from "@/lib/queries/keys";
import { cn } from "@/lib/utils";
import type { KatsayiAnaliz } from "@/lib/types";

export function GenelParametreler() {
  const { data, isLoading } = useKatsayiAnaliz();
  const qc = useQueryClient();

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="font-heading text-base font-medium">Genel Parametreler</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">EnPI ve hesaplamalarda kullanılan referans değerler</p>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.genel.map((p) => (
              <div key={p.id} className="group flex items-start gap-3 rounded-xl border p-4">
                <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", p.sinif)}>
                  <Icon icon={p.ikon} className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{p.ad}</p>
                  <p className="mt-0.5 font-heading text-lg font-bold tracking-tight tabular-nums">{p.deger}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{p.aciklama}</p>
                </div>
                <KatsayiDuzenleDrawer
                  baslik={p.ad}
                  aciklama="Parametre değerini güncelleyin."
                  alanlar={[{ anahtar: "deger", label: p.ad, deger: p.deger }]}
                  onKaydet={(d) => qc.setQueryData(queryKeys.katsayilar.analiz, (old?: KatsayiAnaliz) => old ? { ...old, genel: old.genel.map((x) => x.id === p.id ? { ...x, ...d } : x) } : old)}
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label="Düzenle" className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                      <Icon icon="solar:pen-2-bold-duotone" className="size-4 text-muted-foreground" />
                    </Button>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
