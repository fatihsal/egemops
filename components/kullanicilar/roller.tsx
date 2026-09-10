"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROL_META } from "@/components/kullanicilar/stiller";
import { useKullaniciAnaliz } from "@/lib/queries/kullanicilar";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

export function KullaniciRoller() {
  const { data, isLoading } = useKullaniciAnaliz();
  const { t } = useDil();
  const toplam = data?.roller.reduce((s, r) => s + r.adet, 0) ?? 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Roller & İzinler")}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading || !data ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
        ) : (
          data.roller.map((r) => {
            const m = ROL_META[r.rol];
            const yuzde = toplam ? Math.round((r.adet / toplam) * 100) : 0;
            return (
              <div key={r.rol} className="rounded-xl border p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium", m.sinif)}>{t(m.etiket)}</span>
                  <span className="text-sm font-semibold tabular-nums">{r.adet} <span className="text-xs font-normal text-muted-foreground">{t("kullanıcı")}</span></span>
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon icon="solar:lock-keyhole-minimalistic-linear" className="size-3.5" />
                  {t(m.aciklama)}
                </p>
                <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <span className="block h-full rounded-full bg-teal-500" style={{ width: `${yuzde}%` }} />
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
