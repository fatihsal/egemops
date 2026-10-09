"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

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
import { useSop, useMakineler } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { CHECKLIST_TIP_META, MADDE_TURU_ETIKET } from "@/components/bakim/makineler/stiller";
import type { FotoGereksinim } from "@/lib/types/bakim";

const FOTO_ETIKET: Record<FotoGereksinim, string> = {
  zorunlu: "Zorunlu",
  opsiyonel: "Opsiyonel",
  yok: "—",
};
const FOTO_SINIF: Record<FotoGereksinim, string> = {
  zorunlu: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  opsiyonel: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  yok: "text-muted-foreground",
};

export function SopDetay() {
  const { t } = useDil();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data, isLoading } = useSop(id ?? "");
  const { data: makineler } = useMakineler();

  const [seciliVerId, setSeciliVerId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data) setSeciliVerId(data.aktifVersiyonId);
  }, [data?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const tm = CHECKLIST_TIP_META[data.tip];
  const makineAd = data.makineId ? makineler?.find((m) => m.id === data.makineId)?.ad ?? data.makineId : t("Tüm Makineler");
  const secili = data.versiyonlar.find((v) => v.id === seciliVerId) ?? data.versiyonlar[data.versiyonlar.length - 1];
  const aktifMi = secili.id === data.aktifVersiyonId;
  const toplamDk = secili.maddeler.reduce((s, m) => s + (m.tahminiDakika ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="outline" size="icon" className="mt-0.5 bg-card" nativeButton={false} render={<Link href="/bakim/sop" />} aria-label={t("Geri")}>
            <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
          </Button>
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-bold tracking-tight">{t(data.ad)}</h1>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", tm.sinif)}>
                <Icon icon={tm.ikon} className="size-3" />
                {t(tm.etiket)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon icon="solar:cpu-bolt-linear" className="size-4" />
                {data.makineId ? (
                  <Link href={`/bakim/makineler/${data.makineId}`} className="hover:text-blue-600 hover:underline dark:hover:text-blue-400">{makineAd}</Link>
                ) : makineAd}
              </span>
            </p>
          </div>
        </div>
        <Button variant="outline" className="h-9 gap-1.5 bg-card" onClick={() => toast(t("Bu özellik yakında eklenecek."))}>
          <Icon icon="solar:add-square-bold-duotone" className="size-4" />
          {t("Yeni Versiyon")}
        </Button>
      </div>

      {/* Versiyon seçici */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">{t("Versiyon")}:</span>
        {data.versiyonlar.slice().sort((a, b) => b.rev - a.rev).map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setSeciliVerId(v.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              v.id === secili.id ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "border-border bg-card hover:bg-muted",
            )}
          >
            Rev {v.rev}
            {v.id === data.aktifVersiyonId ? (
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{t("Aktif")}</span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Seçili versiyon bilgisi */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="inline-flex items-center gap-1.5"><Icon icon="solar:bookmark-bold-duotone" className="size-4 text-blue-500" /> <span className="font-semibold tabular-nums">Rev {secili.rev}</span>{aktifMi ? <span className="text-emerald-600 dark:text-emerald-400"> · {t("Aktif")}</span> : null}</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Icon icon="solar:calendar-linear" className="size-4" /> {secili.tarih}</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Icon icon="solar:checklist-minimalistic-linear" className="size-4" /> {secili.maddeler.length} {t("madde")}</span>
            {toplamDk > 0 ? <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Icon icon="solar:clock-circle-linear" className="size-4" /> ~{toplamDk} {t("dk")}</span> : null}
          </div>
          {secili.degisiklikNotu ? (
            <span className="max-w-md text-xs text-muted-foreground italic">“{t(secili.degisiklikNotu)}”</span>
          ) : null}
        </CardContent>
      </Card>

      {/* Maddeler */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">{t("No")}</TableHead>
                <TableHead>{t("Bölüm")}</TableHead>
                <TableHead>{t("Kontrol Maddesi")}</TableHead>
                <TableHead>{t("Tür")}</TableHead>
                <TableHead className="text-center">{t("Fotoğraf")}</TableHead>
                <TableHead className="text-center">{t("Süre")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {secili.maddeler.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium tabular-nums">{m.no}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">{t(m.bolum ?? "Genel")}</TableCell>
                  <TableCell>{t(m.baslik)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                      {t(MADDE_TURU_ETIKET[m.turu])}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium", FOTO_SINIF[m.fotoGereksinimi])}>
                      {t(FOTO_ETIKET[m.fotoGereksinimi])}
                    </span>
                  </TableCell>
                  <TableCell className="text-center tabular-nums text-muted-foreground">{m.tahminiDakika ? `${m.tahminiDakika} dk` : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Revizyon geçmişi */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-base font-medium">{t("Revizyon Geçmişi")}</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.versiyonlar.slice().sort((a, b) => b.rev - a.rev).map((v) => (
            <div key={v.id} className="flex items-start gap-3">
              <span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums", v.id === data.aktifVersiyonId ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground")}>
                R{v.rev}
              </span>
              <div className="min-w-0 flex-1 border-b border-dashed pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">Rev {v.rev}</span>
                  {v.id === data.aktifVersiyonId ? <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{t("Aktif")}</span> : null}
                  <span className="text-xs text-muted-foreground">· {v.tarih} · {v.maddeler.length} {t("madde")}</span>
                </div>
                {v.degisiklikNotu ? <p className="mt-0.5 text-xs text-muted-foreground">{t(v.degisiklikNotu)}</p> : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
