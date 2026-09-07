"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTepAnaliz } from "@/lib/queries/tep";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TepBazYilKarti() {
  const { data, isLoading } = useTepAnaliz();

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const b = data.bazYil;
  const arti = b.iyilesme >= 0;

  const satir = (etiket: string, deger: string) => (
    <div className="flex items-center justify-between gap-2 py-2 text-sm">
      <span className="text-muted-foreground">{etiket}</span>
      <span className="font-medium tabular-nums">{deger}</span>
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Baz Yıla Göre Performans</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center">
        <div className="divide-y">
          {satir("Baz Yıl", String(b.bazYil))}
          {satir("Baz Yıl TEP/ton", b.bazDeger)}
          {satir("2026 TEP/ton", b.guncelDeger)}
          <div className="flex items-center justify-between gap-2 py-2 text-sm">
            <span className="text-muted-foreground">İyileşme</span>
            <span
              className={cn(
                "inline-flex items-center gap-1 font-semibold",
                arti ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400",
              )}
            >
              <Icon icon={arti ? "solar:alt-arrow-up-bold" : "solar:alt-arrow-down-bold"} className="size-3.5" />
              %{sayiOndalik(Math.abs(b.iyilesme))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
