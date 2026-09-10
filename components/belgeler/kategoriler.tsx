"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KATEGORI_META } from "@/components/belgeler/stiller";
import { useBelgeFiltre } from "@/components/belgeler/filtre-store";
import { useBelgeAnaliz } from "@/lib/queries/belgeler";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

export function BelgeKategorileri() {
  const { data, isLoading } = useBelgeAnaliz();
  const { t } = useDil();
  const { set } = useBelgeFiltre();

  const sec = (etiket: string) => {
    set("kategori", etiket);
    document.getElementById("belge-listesi")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Kategoriler")}</h3>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.kategoriler.map((k) => {
              const m = KATEGORI_META[k.anahtar];
              return (
                <button
                  key={k.anahtar}
                  type="button"
                  onClick={() => sec(m.etiket)}
                  className="group flex items-start gap-3 rounded-xl border p-4 text-left transition-all hover:border-primary/40 hover:shadow-sm"
                >
                  <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", m.sinif)}>
                    <Icon icon={m.ikon} className="size-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{t(k.baslik)}</p>
                      <Icon icon="solar:alt-arrow-right-linear" className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{t(k.aciklama)}</p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{k.adet}</span> {t("belge")}
                      <span className="text-muted-foreground/50">·</span>
                      <span className="tabular-nums">{k.boyut}</span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
