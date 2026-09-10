"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import type { EnerjiKayit, KayitGecmis } from "@/lib/types";

const GECMIS_IKON: Record<KayitGecmis["tur"], { ikon: string; renk: string }> = {
  onay: { ikon: "solar:check-circle-bold-duotone", renk: "text-emerald-500" },
  duzenleme: { ikon: "solar:pen-new-square-bold-duotone", renk: "text-amber-500" },
  ekleme: { ikon: "solar:document-text-bold-duotone", renk: "text-primary" },
};

export function NotlarKarti({ kayit }: { kayit: EnerjiKayit }) {
  const { t } = useDil();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="solar:notes-bold-duotone" className="size-5 text-primary" />
          {t("Notlar")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">{t(kayit.notlar)}</p>
      </CardContent>
    </Card>
  );
}

export function GecmisKarti({ kayit }: { kayit: EnerjiKayit }) {
  const { t } = useDil();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="solar:history-bold-duotone" className="size-5 text-primary" />
          {t("Kayıt Geçmişi")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-4 border-l pl-5">
          {kayit.gecmis.map((g, i) => {
            const ik = GECMIS_IKON[g.tur];
            return (
              <li key={i} className="relative">
                <span className="absolute top-0.5 -left-[27px] flex size-4 items-center justify-center rounded-full bg-card">
                  <Icon icon={ik.ikon} className={cn("size-4", ik.renk)} />
                </span>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground tabular-nums">{g.tarih}</div>
                    <div className="text-sm font-medium">{t(g.baslik)}</div>
                    {g.aciklama ? (
                      <div className="text-xs text-muted-foreground">{t("Açıklama")}: {t(g.aciklama)}</div>
                    ) : null}
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{t(g.kullanici)}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

export function BelgelerKarti({ kayit }: { kayit: EnerjiKayit }) {
  const { t } = useDil();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="solar:documents-bold-duotone" className="size-5 text-primary" />
          {t("Kaynak Belgeler")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-2">
          {kayit.belgeler.map((b) => (
            <div
              key={b.ad}
              className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2"
            >
              <Icon icon={b.ikon} className="size-7 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{b.ad}</div>
                <div className="text-xs text-muted-foreground">{b.tur}</div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("Görüntüle")}
                  onClick={() => toast(`${b.ad} ${t("açılıyor")}`)}
                >
                  <Icon icon="solar:eye-bold-duotone" className="size-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("İndir")}
                  onClick={() => toast.success(`${b.ad} ${t("indiriliyor")}`)}
                >
                  <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
