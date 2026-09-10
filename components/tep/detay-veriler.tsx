"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Degisim } from "@/components/kayit-detay/parcalar";
import { useTepAnaliz } from "@/lib/queries/tep";
import { useDil } from "@/components/providers/dil-provider";
import { sayi, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TepAylik } from "@/lib/types";

const BOYUTLAR = ["6", "12"];
const uc = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const grup = "border-l border-border/60";

function ToplamHucre({ deger, max }: { deger: number; max: number }) {
  return (
    <div className="ml-auto w-[92px] space-y-1">
      <div className="text-right font-semibold tabular-nums">{sayiOndalik(deger)}</div>
      <span className="block h-1 w-full overflow-hidden rounded-full bg-muted">
        <span className="block h-full rounded-full bg-teal-500" style={{ width: `${(deger / max) * 100}%` }} />
      </span>
    </div>
  );
}

export function TepDetayVeriler() {
  const { data, isLoading } = useTepAnaliz();
  const { t } = useDil();
  const [sayfa, setSayfa] = React.useState(1);
  const [boyut, setBoyut] = React.useState(6);

  const satirlar = React.useMemo(() => (data?.aylik ?? []).slice().reverse(), [data]);
  const maxToplam = Math.max(1, ...satirlar.map((r) => r.toplam));

  const toplamSayfa = Math.max(1, Math.ceil(satirlar.length / boyut));
  const geciliSayfa = Math.min(sayfa, toplamSayfa);
  const bas = (geciliSayfa - 1) * boyut;
  const gorunen = satirlar.slice(bas, bas + boyut);

  const topla = (f: (r: TepAylik) => number) => satirlar.reduce((t, r) => t + f(r), 0);
  const ort = (f: (r: TepAylik) => number) => (satirlar.length ? topla(f) / satirlar.length : 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-heading text-base font-medium">{t("Detaylı Veriler")}</h3>
            <p className="text-xs text-muted-foreground">{t("Tüm dönemlerin tam kırılımı · 12 dönem")}</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 bg-card" onClick={() => toast.success(t("Detaylı veriler Excel'e aktarıldı"))}>
            <Icon icon="vscode-icons:file-type-excel" className="size-4" />
            {t("Excel'e Aktar")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-0 hover:bg-transparent">
                    <TableHead rowSpan={2} className="align-bottom whitespace-nowrap">Dönem</TableHead>
                    <TableHead colSpan={3} className={cn("text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", grup)}>{t("Kaynak Kırılımı (TEP)")}</TableHead>
                    <TableHead colSpan={1} className={cn("text-center text-[11px] font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400", grup)}>{t("Toplam")}</TableHead>
                    <TableHead colSpan={2} className={cn("text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", grup)}>{t("Verimlilik")}</TableHead>
                    <TableHead colSpan={2} className={cn("text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", grup)}>{t("Değişim")}</TableHead>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className={cn("text-right whitespace-nowrap", grup)}>{t("Elektrik")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Doğalgaz")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Akaryakıt")}</TableHead>
                    <TableHead className={cn("text-right whitespace-nowrap", grup)}>{t("Toplam TEP")}</TableHead>
                    <TableHead className={cn("text-right whitespace-nowrap", grup)}>{t("Üretim")} <span className="font-normal text-muted-foreground">(ton)</span></TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("TEP / ton")}</TableHead>
                    <TableHead className={cn("text-right whitespace-nowrap", grup)}>{t("Önceki Ay")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Geçen Yıl")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gorunen.map((r) => (
                    <TableRow key={r.ay} className="odd:bg-muted/20 hover:bg-muted/50">
                      <TableCell className="font-medium whitespace-nowrap">{r.donem}</TableCell>
                      <TableCell className={cn("text-right tabular-nums text-muted-foreground", grup)}>{sayiOndalik(r.elektrik)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{sayiOndalik(r.dogalgaz)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{sayiOndalik(r.akaryakit)}</TableCell>
                      <TableCell className={grup}><ToplamHucre deger={r.toplam} max={maxToplam} /></TableCell>
                      <TableCell className={cn("text-right tabular-nums", grup)}>{sayi(r.uretim)}</TableCell>
                      <TableCell className="text-right tabular-nums">{uc(r.yogunluk)}</TableCell>
                      <TableCell className={cn("text-right", grup)}>
                        {r.oncekiAy === null ? <span className="text-xs text-muted-foreground">—</span> : <Degisim yuzde={r.oncekiAy} className="justify-end" />}
                      </TableCell>
                      <TableCell className="text-right">
                        {r.gecenYil === null ? <span className="text-xs text-muted-foreground">—</span> : <Degisim yuzde={r.gecenYil} className="justify-end" />}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <tfoot>
                  <TableRow className="border-t-2 bg-muted/40 font-medium hover:bg-muted/40">
                    <TableCell className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground">{t("Toplam / Ort.")}</TableCell>
                    <TableCell className={cn("text-right tabular-nums", grup)}>{sayiOndalik(topla((r) => r.elektrik))}</TableCell>
                    <TableCell className="text-right tabular-nums">{sayiOndalik(topla((r) => r.dogalgaz))}</TableCell>
                    <TableCell className="text-right tabular-nums">{sayiOndalik(topla((r) => r.akaryakit))}</TableCell>
                    <TableCell className={cn("text-right font-semibold tabular-nums", grup)}>{sayiOndalik(topla((r) => r.toplam))}</TableCell>
                    <TableCell className={cn("text-right tabular-nums", grup)}>{sayi(topla((r) => r.uretim))}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{uc(ort((r) => r.yogunluk))}</TableCell>
                    <TableCell className={cn("text-right text-muted-foreground", grup)}>—</TableCell>
                    <TableCell className="text-right text-muted-foreground">—</TableCell>
                  </TableRow>
                </tfoot>
              </Table>
            </div>

            {/* Sayfalama */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                <span className="tabular-nums">{sayi(bas + 1)}–{sayi(Math.min(bas + boyut, satirlar.length))}</span> / {sayi(satirlar.length)} {t("dönem")}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon-sm" aria-label={t("Önceki")} disabled={geciliSayfa <= 1} onClick={() => setSayfa((s) => Math.max(1, s - 1))}>
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: toplamSayfa }, (_, i) => i + 1).map((n) => (
                  <Button key={n} variant={n === geciliSayfa ? "default" : "ghost"} size="icon-sm" className="tabular-nums" onClick={() => setSayfa(n)}>{n}</Button>
                ))}
                <Button variant="outline" size="icon-sm" aria-label={t("Sonraki")} disabled={geciliSayfa >= toplamSayfa} onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t("Sayfa başına")}:</span>
                <Select value={String(boyut)} onValueChange={(v) => { setBoyut(Number(v)); setSayfa(1); }}>
                  <SelectTrigger size="sm" className="w-[68px] bg-card"><SelectValue /></SelectTrigger>
                  <SelectContent>{BOYUTLAR.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
