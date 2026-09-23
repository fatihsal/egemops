"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import type { EnerjiKayit, KayitGecmis } from "@/lib/types";
import { belgeleriGetir, type KaynakBelge } from "@/lib/data/kaynak-belgeler";

function belgeIkon(tur: string | null): string {
  switch (tur) {
    case "PDF":
      return "vscode-icons:file-type-pdf2";
    case "Excel":
      return "vscode-icons:file-type-excel";
    case "Word":
      return "vscode-icons:file-type-word";
    case "Görsel":
      return "solar:gallery-bold-duotone";
    default:
      return "solar:file-bold-duotone";
  }
}

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
  const [belgeler, setBelgeler] = React.useState<KaynakBelge[]>([]);

  React.useEffect(() => {
    belgeleriGetir(kayit.yil, kayit.ay)
      .then(setBelgeler)
      .catch(() => setBelgeler([]));
  }, [kayit.yil, kayit.ay]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="solar:documents-bold-duotone" className="size-5 text-primary" />
          {t("Kaynak Belgeler")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {belgeler.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center text-muted-foreground">
            <Icon icon="solar:folder-open-bold-duotone" className="size-8 opacity-60" />
            <span className="text-sm">{t("Bu dönem için belge yok.")}</span>
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {belgeler.map((b) => (
              <div
                key={b.id}
                className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2"
              >
                <Icon icon={belgeIkon(b.tur)} className="size-7 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{b.ad}</div>
                  <div className="text-xs text-muted-foreground">{b.tur}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("Görüntüle")}
                  render={
                    <a href={b.url} target="_blank" rel="noopener noreferrer">
                      <Icon icon="solar:eye-bold-duotone" className="size-4 text-muted-foreground" />
                    </a>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
