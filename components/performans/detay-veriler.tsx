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
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { sayi } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PerformansAylik } from "@/lib/types";

const BOYUTLAR = ["6", "12"];
const uc = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const grup = "border-l border-border/60";

const PERF: Record<PerformansAylik["performans"], { etiket: string; sinif: string }> = {
  takip: { etiket: "Takip Gerekiyor", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  hedefte: { etiket: "Hedefte", sinif: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" },
  iyi: { etiket: "İyi", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
};

export function PerformansDetayVeriler() {
  const { data, isLoading } = usePerformansAnaliz();
  const [sayfa, setSayfa] = React.useState(1);
  const [boyut, setBoyut] = React.useState(6);

  const satirlar = data?.aylik ?? [];
  const toplamSayfa = Math.max(1, Math.ceil(satirlar.length / boyut));
  const geciliSayfa = Math.min(sayfa, toplamSayfa);
  const bas = (geciliSayfa - 1) * boyut;
  const gorunen = satirlar.slice(bas, bas + boyut);

  const topla = (f: (r: PerformansAylik) => number) => satirlar.reduce((t, r) => t + f(r), 0);
  const ort = (f: (r: PerformansAylik) => number) => (satirlar.length ? topla(f) / satirlar.length : 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-heading text-base font-medium">Detaylı Veriler</h3>
            <p className="text-xs text-muted-foreground">Tüm dönemlerin tam kırılımı · 12 dönem</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 bg-card" onClick={() => toast.success("Detaylı veriler Excel'e aktarıldı")}>
            <Icon icon="vscode-icons:file-type-excel" className="size-4" />
            Excel&apos;e Aktar
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
                    <TableHead colSpan={2} className={cn("text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", grup)}>Üretim & Enerji</TableHead>
                    <TableHead colSpan={3} className={cn("text-center text-[11px] font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400", grup)}>EnPI (TEP/ton)</TableHead>
                    <TableHead colSpan={2} className={cn("text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", grup)}>Sonuç</TableHead>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className={cn("text-right whitespace-nowrap", grup)}>Üretim <span className="font-normal text-muted-foreground">(ton)</span></TableHead>
                    <TableHead className="text-right whitespace-nowrap">Toplam TEP</TableHead>
                    <TableHead className={cn("text-right", grup)}>Baz</TableHead>
                    <TableHead className="text-right">Hedef</TableHead>
                    <TableHead className="text-right">Gerçek</TableHead>
                    <TableHead className={cn("text-right", grup)}>Sapma</TableHead>
                    <TableHead className="whitespace-nowrap">Performans</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gorunen.map((r) => {
                    const p = PERF[r.performans];
                    const arti = r.sapma > 0;
                    return (
                      <TableRow key={r.ay} className="odd:bg-muted/20 hover:bg-muted/50">
                        <TableCell className="font-medium whitespace-nowrap">{r.donem}</TableCell>
                        <TableCell className={cn("text-right tabular-nums", grup)}>{sayi(r.uretim)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{sayi(r.toplamTep)}</TableCell>
                        <TableCell className={cn("text-right tabular-nums text-muted-foreground", grup)}>{uc(r.bazEnPI)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{uc(r.hedefEnPI)}</TableCell>
                        <TableCell className="text-right font-medium tabular-nums">{uc(r.gercekEnPI)}</TableCell>
                        <TableCell className={cn("text-right font-medium tabular-nums", grup, arti ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                          {arti ? "+" : "−"}{uc(Math.abs(r.sapma))}
                        </TableCell>
                        <TableCell>
                          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", p.sinif)}>{p.etiket}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <tfoot>
                  <TableRow className="border-t-2 bg-muted/40 font-medium hover:bg-muted/40">
                    <TableCell className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground">Toplam / Ort.</TableCell>
                    <TableCell className={cn("text-right tabular-nums", grup)}>{sayi(topla((r) => r.uretim))}</TableCell>
                    <TableCell className="text-right tabular-nums">{sayi(topla((r) => r.toplamTep))}</TableCell>
                    <TableCell className={cn("text-right tabular-nums text-muted-foreground", grup)}>{uc(ort((r) => r.bazEnPI))}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{uc(ort((r) => r.hedefEnPI))}</TableCell>
                    <TableCell className="text-right tabular-nums">{uc(ort((r) => r.gercekEnPI))}</TableCell>
                    <TableCell className={cn("text-right text-muted-foreground", grup)}>—</TableCell>
                    <TableCell className="text-muted-foreground">—</TableCell>
                  </TableRow>
                </tfoot>
              </Table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                <span className="tabular-nums">{sayi(bas + 1)}–{sayi(Math.min(bas + boyut, satirlar.length))}</span> / {sayi(satirlar.length)} dönem
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon-sm" aria-label="Önceki" disabled={geciliSayfa <= 1} onClick={() => setSayfa((s) => Math.max(1, s - 1))}>
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: toplamSayfa }, (_, i) => i + 1).map((n) => (
                  <Button key={n} variant={n === geciliSayfa ? "default" : "ghost"} size="icon-sm" className="tabular-nums" onClick={() => setSayfa(n)}>{n}</Button>
                ))}
                <Button variant="outline" size="icon-sm" aria-label="Sonraki" disabled={geciliSayfa >= toplamSayfa} onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Sayfa başına:</span>
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
