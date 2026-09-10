"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnerjiFirsat } from "@/lib/queries/enerji";
import { useDil } from "@/components/providers/dil-provider";

export function EnerjiFirsatlari() {
  const { data, isLoading } = useEnerjiFirsat();
  const { t } = useDil();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
            <Icon icon="solar:lightbulb-bolt-bold-duotone" className="size-5" />
          </span>
          <CardTitle>{t("Enerji Fırsatları")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-muted-foreground">
                {t("Toplam Açık Fırsat")}
              </div>
              <div className="text-2xl font-bold tracking-tight">
                {data?.toplamAcik}
              </div>
              <Link
                href="/firsatlar"
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {t("Fırsatları Görüntüle")}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">{t("Devam Eden")}</span>
                <span className="font-semibold">{data?.devamEden}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">{t("Tamamlanan")}</span>
                <span className="font-semibold">{data?.tamamlanan}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
