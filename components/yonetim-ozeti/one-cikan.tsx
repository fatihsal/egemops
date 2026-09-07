"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useYonetimOzeti } from "@/lib/queries/yonetim-ozeti";
import { cn } from "@/lib/utils";

export function OzetOneCikan() {
  const { data, isLoading } = useYonetimOzeti();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Öne Çıkan Gelişmeler</h3>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (
          <ul className="space-y-4">
            {data.oneCikan.map((o) => (
              <li key={o.anahtar} className="flex gap-3">
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", o.sinif)}>
                  <Icon icon={o.ikon} className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{o.baslik}</p>
                  <p className="text-xs text-muted-foreground">{o.aciklama}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
