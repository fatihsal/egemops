"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useYonetimOzeti } from "@/lib/queries/yonetim-ozeti";

export function OzetSistemDurumu() {
  const { data, isLoading } = useYonetimOzeti();

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <h3 className="font-heading text-base font-medium">Sistem Durumu</h3>
        <Link href="/ayarlar" className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-80">
          Tümünü Gör <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}</div>
        ) : (
          <ul className="divide-y">
            {data.sistem.map((s) => (
              <li key={s.alan} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Icon
                  icon={s.iyi ? "solar:check-circle-bold-duotone" : "solar:danger-circle-bold-duotone"}
                  className={s.iyi ? "size-5 shrink-0 text-emerald-500" : "size-5 shrink-0 text-red-500"}
                />
                <span className="flex-1 text-sm">{s.alan}</span>
                <span className="text-sm font-medium text-muted-foreground">{s.durum}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
