"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { KAYNAK_ETIKET, KAYNAK_RENK } from "@/components/projeler/stiller";
import { useProjeAnaliz } from "@/lib/queries/projeler";
import type { ProjeDikkatMadde } from "@/lib/types";

function Madde({ d }: { d: ProjeDikkatMadde }) {
  return (
    <li className="flex gap-3 rounded-lg border border-amber-200/70 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
      <Icon icon="solar:danger-triangle-bold-duotone" className="size-5 shrink-0 text-amber-500" />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{d.proje}</p>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full" style={{ background: KAYNAK_RENK[d.kaynak] }} />
            {KAYNAK_ETIKET[d.kaynak]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{d.mesaj}</p>
      </div>
    </li>
  );
}

export function ProjeDikkat() {
  const { data, isLoading } = useProjeAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Dikkat Gerektirenler</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading || !data ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
        ) : (
          <>
            <ul className="space-y-2.5">
              {data.dikkat.map((d) => <Madde key={d.id} d={d} />)}
            </ul>

            <Sheet>
              <SheetTrigger
                render={
                  <button type="button" className="mt-auto inline-flex items-center gap-1 self-start text-sm font-medium text-primary transition-opacity hover:opacity-80" />
                }
              >
                Tümünü Görüntüle
                <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
              </SheetTrigger>
              <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
                <SheetHeader className="border-b p-5">
                  <SheetTitle>Dikkat Gerektiren Konular</SheetTitle>
                  <SheetDescription>{data.dikkat.length} açık konu · aksiyon bekleniyor</SheetDescription>
                </SheetHeader>
                <ul className="flex-1 space-y-2.5 overflow-y-auto p-4">
                  {data.dikkat.map((d) => <Madde key={d.id} d={d} />)}
                </ul>
              </SheetContent>
            </Sheet>
          </>
        )}
      </CardContent>
    </Card>
  );
}
