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
import { SilmeOnay } from "@/components/ui/silme-onay";
import { DURUM_META, KAYNAK_ETIKET, KAYNAK_RENK, ONCELIK } from "@/components/firsatlar/stiller";
import { TumFirsatlarDrawer } from "@/components/firsatlar/tum-firsatlar-drawer";
import { FirsatFormDrawer } from "@/components/firsatlar/firsat-form-drawer";
import { useFirsatAnaliz } from "@/lib/queries/firsatlar";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import { firsatSil } from "@/lib/data/firsatlar";
import { sayi, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Firsat } from "@/lib/types";

export function FirsatOnceilkliTablo() {
  const { data, isLoading } = useFirsatAnaliz();
  const { t } = useDil();
  const qc = useQueryClient();

  async function sil(f: Firsat) {
    try {
      await firsatSil(f.id);
      toast.success(`${f.ad} ${t("silindi")}`);
      qc.invalidateQueries({ queryKey: queryKeys.firsatlar.analiz });
    } catch (e) {
      toast.error(t("Silme başarısız"), { description: e instanceof Error ? e.message : undefined });
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Öncelikli Fırsatlar")}</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {isLoading || !data ? (
          <Skeleton className="h-[320px] w-full" />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="whitespace-nowrap">{t("Öncelik")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Fırsat Adı")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Enerji Kaynağı")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Potansiyel Tasarruf")} <span className="font-normal text-muted-foreground">(TEP/yıl)</span></TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Yatırım")} <span className="font-normal text-muted-foreground">(€)</span></TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Geri Dönüş")} <span className="font-normal text-muted-foreground">({t("yıl")})</span></TableHead>
                    <TableHead className="whitespace-nowrap">{t("Durum")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("İlerleme")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("İşlem")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...data.firsatlar].sort((a, b) => b.tasarruf - a.tasarruf).slice(0, 5).map((f: Firsat) => {
                    const o = ONCELIK[f.oncelik];
                    const d = DURUM_META[f.durum];
                    return (
                      <TableRow key={f.id} className="odd:bg-muted/20 hover:bg-muted/50">
                        <TableCell>
                          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium", o.sinif)}>{t(o.etiket)}</span>
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">{t(f.ad)}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full" style={{ background: KAYNAK_RENK[f.kaynak] }} />
                            {t(KAYNAK_ETIKET[f.kaynak])}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">{sayiOndalik(f.tasarruf)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{sayi(f.yatirim)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{sayiOndalik(f.geriDonus)}</TableCell>
                        <TableCell>
                          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", d.sinif)}>{t(d.etiket)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <span className="block h-full rounded-full bg-teal-500" style={{ width: `${f.ilerleme}%` }} />
                            </span>
                            <span className="w-8 text-right text-xs font-medium tabular-nums text-muted-foreground">%{f.ilerleme}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-0.5">
                            <FirsatFormDrawer
                              firsat={f}
                              trigger={
                                <Button variant="ghost" size="icon-sm" aria-label={t("Düzenle")}>
                                  <Icon icon="solar:pen-2-bold-duotone" className="size-4 text-muted-foreground" />
                                </Button>
                              }
                            />
                            <SilmeOnay
                              baslik={`${f.ad} ${t("silinsin mi?")}`}
                              onConfirm={() => sil(f)}
                              trigger={
                                <Button variant="ghost" size="icon-sm" aria-label={t("Sil")}>
                                  <Icon icon="solar:trash-bin-trash-bold-duotone" className="size-4 text-red-500" />
                                </Button>
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <TumFirsatlarDrawer etiket={t("Tüm Fırsatları Görüntüle")} className="self-start" />
          </>
        )}
      </CardContent>
    </Card>
  );
}
