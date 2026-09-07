"use client";

import * as React from "react";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjeAnaliz } from "@/lib/queries/projeler";
import { cn } from "@/lib/utils";

export function ProjeYasamDongusu() {
  const { data, isLoading } = useProjeAnaliz();

  return (
    <Card>
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Proje Yaşam Döngüsü</h3>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <div className="flex items-start">
            {data.asamalar.map((a, i) => {
              const aktif = a.adet > 0;
              return (
                <React.Fragment key={a.anahtar}>
                  <div className="flex min-w-[72px] flex-1 flex-col items-center gap-1.5 text-center">
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full ring-1 transition-colors",
                        aktif
                          ? "bg-teal-50 text-teal-600 ring-teal-600/20 dark:bg-teal-950 dark:text-teal-300"
                          : "bg-muted text-muted-foreground/50 ring-transparent",
                      )}
                    >
                      <Icon icon={a.ikon} className="size-5" />
                    </span>
                    <span className={cn("font-heading text-lg font-bold tabular-nums", aktif ? "text-foreground" : "text-muted-foreground/60")}>
                      {a.adet}
                    </span>
                    <span className="text-[11px] leading-tight text-muted-foreground">{a.etiket}</span>
                  </div>
                  {i < data.asamalar.length - 1 ? (
                    <Icon icon="solar:alt-arrow-right-linear" className="mt-3 size-4 shrink-0 text-muted-foreground/40" />
                  ) : null}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
