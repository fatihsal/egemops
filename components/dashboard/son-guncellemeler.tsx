"use client";

import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGuncellemeler } from "@/lib/queries/enerji";

export function SonGuncellemeler() {
  const { data, isLoading } = useGuncellemeler();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Güncellemeler</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : (
          <ul className="divide-y">
            {data?.map((g, i) => (
              <li key={i}>
                <Sheet>
                  <SheetTrigger
                    render={
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 py-2.5 text-left text-sm transition-colors hover:text-primary"
                      />
                    }
                  >
                    <Icon
                      icon="solar:calendar-bold-duotone"
                      className="size-4.5 shrink-0 text-muted-foreground"
                    />
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {format(parseISO(g.tarih), "dd.MM.yyyy")}
                    </span>
                    <span className="flex-1 truncate">{g.aciklama}</span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
                    <SheetHeader className="border-b p-5">
                      <SheetTitle>Güncelleme Detayı</SheetTitle>
                      <SheetDescription>
                        {format(parseISO(g.tarih), "d MMMM yyyy", { locale: tr })}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 p-5 text-sm">
                      <p className="font-medium">{g.aciklama}</p>
                      <dl className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <dt className="text-muted-foreground">İşlemi yapan</dt>
                          <dd className="font-medium">Ahmet Yılmaz</dd>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                          <dt className="text-muted-foreground">Kaynak</dt>
                          <dd className="font-medium">Aylık Veri Girişi</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">Durum</dt>
                          <dd className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                            <Icon icon="solar:check-circle-bold-duotone" className="size-4" />
                            Tamamlandı
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </SheetContent>
                </Sheet>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
