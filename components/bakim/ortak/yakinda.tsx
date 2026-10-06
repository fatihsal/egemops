"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { useDil } from "@/components/providers/dil-provider";

/** Bakım modülü iskelet dönemi için ekran yer tutucusu. */
export function Yakinda({
  baslik,
  aciklama,
  ikon = "solar:wrench-bold-duotone",
}: {
  baslik: string;
  aciklama?: string;
  ikon?: string;
}) {
  const { t } = useDil();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">{t(baslik)}</h1>
        {aciklama ? <p className="mt-1 text-sm text-muted-foreground">{t(aciklama)}</p> : null}
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
            <Icon icon={ikon} className="size-7" />
          </span>
          <p className="text-sm font-medium">{t("Bu ekran yakında geliştirilecek.")}</p>
          <p className="max-w-sm text-xs text-muted-foreground">
            {t("Bakım Yönetimi modülü aşama aşama ekleniyor. Menüden diğer ekranlara göz atabilirsiniz.")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
