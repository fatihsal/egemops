"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useKayitOzeti } from "@/lib/queries/kayitlar";
import { useDil } from "@/components/providers/dil-provider";
import { sayi, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

function KpiKart({
  ikon,
  ikonSinif,
  etiket,
  deger,
  alt,
}: {
  ikon: string;
  ikonSinif: string;
  etiket: string;
  deger: string;
  alt: string;
}) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            ikonSinif,
          )}
        >
          <Icon icon={ikon} className="size-6" />
        </span>
        <div className="min-w-0">
          <div className="truncate text-xs text-muted-foreground">{etiket}</div>
          <div className="text-2xl font-bold leading-tight tracking-tight">
            {deger}
          </div>
          <div className="text-xs text-muted-foreground">{alt}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KayitKpi() {
  const { data, isLoading } = useKayitOzeti();
  const { t } = useDil();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} size="sm">
            <CardContent className="flex items-center gap-3">
              <Skeleton className="size-11 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-10" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      <KpiKart
        ikon="solar:documents-bold-duotone"
        ikonSinif="bg-primary/10 text-primary"
        etiket={t("Toplam Kayıt")}
        deger={sayi(data.toplam)}
        alt={data.toplamAralik}
      />
      <KpiKart
        ikon="solar:check-circle-bold-duotone"
        ikonSinif="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
        etiket={t("Onaylanan")}
        deger={sayi(data.onaylanan)}
        alt={`%${sayiOndalik(data.onaylananOran)}`}
      />
      <KpiKart
        ikon="solar:clock-circle-bold-duotone"
        ikonSinif="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300"
        etiket={t("Kontrol Bekleyen")}
        deger={sayi(data.kontrolBekleyen)}
        alt={`%${sayiOndalik(data.kontrolOran)}`}
      />
      <KpiKart
        ikon="solar:document-text-bold-duotone"
        ikonSinif="bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300"
        etiket={t("Taslak")}
        deger={sayi(data.taslak)}
        alt={`%${sayiOndalik(data.taslakOran)}`}
      />
      <KpiKart
        ikon="solar:danger-triangle-bold-duotone"
        ikonSinif="bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300"
        etiket={t("Eksik Veri")}
        deger={sayi(data.eksik)}
        alt={`%${sayiOndalik(data.eksikOran)}`}
      />
    </div>
  );
}
