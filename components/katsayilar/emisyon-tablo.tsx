"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KatsayiDuzenleDrawer } from "@/components/katsayilar/duzenle-drawer";
import { useKatsayiAnaliz } from "@/lib/queries/katsayilar";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import { cn } from "@/lib/utils";
import type { EmisyonFaktor, KatsayiAnaliz } from "@/lib/types";

const KAPSAM_STIL: Record<string, string> = {
  "Kapsam 1": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "Kapsam 2": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

export function EmisyonTablo() {
  const { data, isLoading } = useKatsayiAnaliz();
  const { t } = useDil();
  const qc = useQueryClient();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <h3 className="font-heading text-base font-medium">{t("CO₂ Emisyon Faktörleri")}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("Karbon ayak izi hesaplarında kullanılan emisyon faktörleri")}</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-card" onClick={() => toast(t("Yeni emisyon faktörü ekleniyor"))}>
          <Icon icon="solar:add-circle-linear" className="size-4" />
          {t("Faktör Ekle")}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[240px] w-full" />
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="whitespace-nowrap">{t("Enerji Kaynağı")}</TableHead>
                  <TableHead className="whitespace-nowrap">{t("Birim")}</TableHead>
                  <TableHead className="text-right whitespace-nowrap">{t("Emisyon Faktörü")}</TableHead>
                  <TableHead className="whitespace-nowrap">{t("Kapsam")}</TableHead>
                  <TableHead className="text-right whitespace-nowrap">{t("İşlem")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.emisyon.map((r) => (
                  <TableRow key={r.id} className="odd:bg-muted/20 hover:bg-muted/50">
                    <TableCell className="whitespace-nowrap font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: r.renk }} />
                        {t(r.ad)}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{r.birim}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums whitespace-nowrap">{r.faktor}</TableCell>
                    <TableCell>
                      <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", KAPSAM_STIL[r.kapsam])}>{t(r.kapsam)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <KatsayiDuzenleDrawer
                        baslik={`${t(r.ad)} — ${t("Emisyon Faktörü")}`}
                        aciklama={t("Emisyon faktörünü ve kapsamı güncelleyin.")}
                        alanlar={[
                          { anahtar: "faktor", label: `${t("Emisyon Faktörü")} (${r.birim})`, deger: r.faktor },
                          { anahtar: "kapsam", label: t("Kapsam"), deger: r.kapsam },
                        ]}
                        onKaydet={(d) => qc.setQueryData(queryKeys.katsayilar.analiz, (old?: KatsayiAnaliz) => old ? { ...old, emisyon: old.emisyon.map((x) => x.id === r.id ? { ...x, ...d } as EmisyonFaktor : x) } : old)}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label={t("Düzenle")}>
                            <Icon icon="solar:pen-2-bold-duotone" className="size-4 text-muted-foreground" />
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
