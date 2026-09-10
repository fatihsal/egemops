"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KATEGORI_META } from "@/components/raporlar/stiller";
import { useRaporFiltre } from "@/components/raporlar/filtre-store";
import { useRaporAnaliz } from "@/lib/queries/raporlar";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

export function RaporKategorileri() {
  const { data, isLoading } = useRaporAnaliz();
  const { t } = useDil();
  const { set } = useRaporFiltre();

  const kategoriSec = (etiket: string) => {
    set("kategori", etiket);
    document.getElementById("rapor-listesi")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Rapor Kategorileri")}</h3>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {data.kategoriler.map((k) => {
              const m = KATEGORI_META[k.anahtar];
              return (
                <button
                  key={k.anahtar}
                  type="button"
                  onClick={() => kategoriSec(m.etiket)}
                  className="group flex flex-col gap-3 rounded-xl border p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", m.sinif)}>
                      <Icon icon={m.ikon} className="size-6" />
                    </span>
                    <Icon icon="solar:alt-arrow-right-linear" className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{t(k.baslik)}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{t(k.aciklama)}</p>
                  </div>
                  <p className="mt-auto text-xs font-semibold text-foreground">{k.adet} {t("Rapor")}</p>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
