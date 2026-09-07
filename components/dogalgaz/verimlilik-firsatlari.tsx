"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDogalgazAnaliz } from "@/lib/queries/dogalgaz";
import { cn } from "@/lib/utils";
import type { DogalgazFirsat } from "@/lib/types";

const DURUM_SINIF: Record<DogalgazFirsat["durum"], string> = {
  Fizibilite: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  Takip: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  Değerlendirme: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
};

export function DogalgazVerimlilikFirsatlari() {
  const { data, isLoading } = useDogalgazAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Verimlilik Fırsatları</h3>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading || !data ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <ul className="divide-y">
              {data.firsatlar.map((f) => (
                <li key={f.baslik}>
                  <button
                    type="button"
                    onClick={() => toast(`${f.baslik} açılıyor`)}
                    className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/40"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
                      <Icon icon="solar:lightbulb-bolt-bold-duotone" className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{f.baslik}</p>
                      <p className="truncate text-xs text-muted-foreground">{f.aciklama}</p>
                    </div>
                    <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", DURUM_SINIF[f.durum])}>
                      {f.durum}
                    </span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
            <Link
              href="/firsatlar"
              className="mt-auto flex items-center justify-center gap-1 pt-3 text-sm font-medium text-primary transition-opacity hover:opacity-80"
            >
              Tüm Fırsatları Görüntüle
              <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
