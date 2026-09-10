"use client";

import { format, parseISO } from "date-fns";
import { tr, enUS } from "date-fns/locale";
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
import { useDil } from "@/components/providers/dil-provider";

export function SonGuncellemeler() {
  const { data, isLoading } = useGuncellemeler();
  const { t, dil } = useDil();
  const dtLocale = dil === "en" ? enUS : tr;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Son Güncellemeler")}</CardTitle>
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
                    <span className="flex-1 truncate">{t(g.aciklama)}</span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
                    <SheetHeader className="border-b p-5">
                      <SheetTitle>{t("Güncelleme Detayı")}</SheetTitle>
                      <SheetDescription>
                        {format(parseISO(g.tarih), "d MMMM yyyy", { locale: dtLocale })}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 p-5 text-sm">
                      <p className="font-medium">{t(g.aciklama)}</p>
                      <dl className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-2">
                          <dt className="text-muted-foreground">{t("İşlemi yapan")}</dt>
                          <dd className="font-medium">Ahmet Yılmaz</dd>
                        </div>
                        <div className="flex items-center justify-between border-b pb-2">
                          <dt className="text-muted-foreground">{t("Kaynak")}</dt>
                          <dd className="font-medium">{t("Aylık Veri Girişi")}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-muted-foreground">{t("Durum")}</dt>
                          <dd className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                            <Icon icon="solar:check-circle-bold-duotone" className="size-4" />
                            {t("Tamamlandı")}
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
