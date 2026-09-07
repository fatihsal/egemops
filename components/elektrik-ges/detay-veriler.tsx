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
import { useElektrikGesAnaliz } from "@/lib/queries/elektrik-ges";
import { sayi, sayi2, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ElektrikAylik } from "@/lib/types";

const BOYUTLAR = ["6", "12"];

function ozOran(r: ElektrikAylik) {
  return r.gesUretim ? (r.gesOz / r.gesUretim) * 100 : 0;
}

/** Yüzde değerini yatay çubuk + etiketle gösterir. */
function OranHucre({ deger, renk }: { deger: number; renk: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="w-11 text-right font-medium tabular-nums">%{sayiOndalik(deger)}</span>
      <span className="hidden h-1.5 w-12 overflow-hidden rounded-full bg-muted sm:block">
        <span className="block h-full rounded-full" style={{ width: `${Math.min(100, deger)}%`, background: renk }} />
      </span>
    </div>
  );
}

/** Büyük değeri, altında göreli büyüklük çubuğuyla gösterir. */
function ToplamHucre({ deger, max }: { deger: number; max: number }) {
  return (
    <div className="ml-auto w-[104px] space-y-1">
      <div className="text-right font-semibold tabular-nums">{sayi2(deger)}</div>
      <span className="block h-1 w-full overflow-hidden rounded-full bg-muted">
        <span className="block h-full rounded-full bg-blue-500" style={{ width: `${(deger / max) * 100}%` }} />
      </span>
    </div>
  );
}

export function ElektrikDetayVeriler() {
  const { data, isLoading } = useElektrikGesAnaliz();
  const [sayfa, setSayfa] = React.useState(1);
  const [boyut, setBoyut] = React.useState(6);

  // Tüm dönemler (12 ay), en yeni önce.
  const satirlar = React.useMemo(
    () => (data?.aylik ?? []).slice().reverse(),
    [data],
  );

  const maxFabrika = Math.max(1, ...satirlar.map((r) => r.fabrikaToplam));
  const zirveAy = satirlar.reduce<ElektrikAylik | null>(
    (z, r) => (!z || r.fabrikaToplam > z.fabrikaToplam ? r : z),
    null,
  );

  const toplamSayfa = Math.max(1, Math.ceil(satirlar.length / boyut));
  const geciliSayfa = Math.min(sayfa, toplamSayfa);
  const bas = (geciliSayfa - 1) * boyut;
  const gorunen = satirlar.slice(bas, bas + boyut);

  const topla = (f: (r: ElektrikAylik) => number) => satirlar.reduce((t, r) => t + f(r), 0);
  const ort = (f: (r: ElektrikAylik) => number) => (satirlar.length ? topla(f) / satirlar.length : 0);

  // Grup ayrımı için sol kenarlık uygulanacak sütunlar.
  const grupBaslangic = "border-l border-border/60";

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-heading text-base font-medium">Detaylı Veriler</h3>
            <p className="text-xs text-muted-foreground">Tüm dönemlerin tam kırılımı · 12 dönem</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 bg-card"
            onClick={() => toast.success("Detaylı veriler Excel'e aktarıldı")}
          >
            <Icon icon="vscode-icons:file-type-excel" className="size-4" />
            Excel&apos;e Aktar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  {/* Grup başlıkları */}
                  <TableRow className="border-b-0 hover:bg-transparent">
                    <TableHead rowSpan={2} className="align-bottom whitespace-nowrap">Dönem</TableHead>
                    <TableHead colSpan={3} className={cn("text-center text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400", grupBaslangic)}>
                      Elektrik Tüketimi (kWh)
                    </TableHead>
                    <TableHead colSpan={2} className={cn("text-center text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400", grupBaslangic)}>
                      GES Üretimi (kWh)
                    </TableHead>
                    <TableHead colSpan={2} className={cn("text-center text-[11px] font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400", grupBaslangic)}>
                      Verimlilik
                    </TableHead>
                    <TableHead colSpan={2} className={cn("text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", grupBaslangic)}>
                      Enerji
                    </TableHead>
                  </TableRow>
                  {/* Sütun başlıkları */}
                  <TableRow className="hover:bg-transparent">
                    <TableHead className={cn("text-right whitespace-nowrap", grupBaslangic)}>Şebeke</TableHead>
                    <TableHead className="text-right whitespace-nowrap">GES Öz</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Fabrika Toplam</TableHead>
                    <TableHead className={cn("text-right whitespace-nowrap", grupBaslangic)}>Üretim</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Şebekeye Verilen</TableHead>
                    <TableHead className={cn("text-right whitespace-nowrap", grupBaslangic)}>GES Karşılama</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Öz Tüketim</TableHead>
                    <TableHead className={cn("text-right whitespace-nowrap", grupBaslangic)}>Elektrik TEP</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Yoğunluk <span className="font-normal text-muted-foreground">(kWh/ton)</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gorunen.map((r) => {
                    const zirve = zirveAy?.ay === r.ay;
                    return (
                      <TableRow key={r.ay} className="odd:bg-muted/20 hover:bg-muted/50">
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{r.donem}</span>
                            {zirve ? (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                                <Icon icon="solar:arrow-up-bold" className="size-2.5" />
                                Zirve
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className={cn("text-right tabular-nums text-muted-foreground", grupBaslangic)}>{sayi2(r.sebeke)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{sayi2(r.gesOz)}</TableCell>
                        <TableCell>
                          <ToplamHucre deger={r.fabrikaToplam} max={maxFabrika} />
                        </TableCell>
                        <TableCell className={cn("text-right tabular-nums text-muted-foreground", grupBaslangic)}>{sayi2(r.gesUretim)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{sayi2(r.sebekeyeVerilen)}</TableCell>
                        <TableCell className={grupBaslangic}>
                          <OranHucre deger={r.gesKarsilama} renk="#0d9488" />
                        </TableCell>
                        <TableCell>
                          <OranHucre deger={ozOran(r)} renk="#16a34a" />
                        </TableCell>
                        <TableCell className={cn("text-right tabular-nums", grupBaslangic)}>{sayi2(r.elektrikTep)}</TableCell>
                        <TableCell className="text-right tabular-nums">{sayiOndalik(r.elektrikYogunluk)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <tfoot>
                  <TableRow className="border-t-2 bg-muted/40 font-medium hover:bg-muted/40">
                    <TableCell className="whitespace-nowrap text-xs uppercase tracking-wide text-muted-foreground">Toplam / Ort.</TableCell>
                    <TableCell className={cn("text-right tabular-nums", grupBaslangic)}>{sayi(topla((r) => r.sebeke))}</TableCell>
                    <TableCell className="text-right tabular-nums">{sayi(topla((r) => r.gesOz))}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">{sayi(topla((r) => r.fabrikaToplam))}</TableCell>
                    <TableCell className={cn("text-right tabular-nums", grupBaslangic)}>{sayi(topla((r) => r.gesUretim))}</TableCell>
                    <TableCell className="text-right tabular-nums">{sayi(topla((r) => r.sebekeyeVerilen))}</TableCell>
                    <TableCell className={cn("text-right tabular-nums text-muted-foreground", grupBaslangic)}>%{sayiOndalik(ort((r) => r.gesKarsilama))}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">%{sayiOndalik(ort(ozOran))}</TableCell>
                    <TableCell className={cn("text-right tabular-nums", grupBaslangic)}>{sayi2(topla((r) => r.elektrikTep))}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">{sayiOndalik(ort((r) => r.elektrikYogunluk))}</TableCell>
                  </TableRow>
                </tfoot>
              </Table>
            </div>

            {/* Sayfalama */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                <span className="tabular-nums">
                  {sayi(bas + 1)}–{sayi(Math.min(bas + boyut, satirlar.length))}
                </span>{" "}
                / {sayi(satirlar.length)} dönem
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon-sm" aria-label="Önceki" disabled={geciliSayfa <= 1} onClick={() => setSayfa((s) => Math.max(1, s - 1))}>
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: toplamSayfa }, (_, i) => i + 1).map((n) => (
                  <Button key={n} variant={n === geciliSayfa ? "default" : "ghost"} size="icon-sm" className="tabular-nums" onClick={() => setSayfa(n)}>
                    {n}
                  </Button>
                ))}
                <Button variant="outline" size="icon-sm" aria-label="Sonraki" disabled={geciliSayfa >= toplamSayfa} onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Sayfa başına:</span>
                <Select value={String(boyut)} onValueChange={(v) => { setBoyut(Number(v)); setSayfa(1); }}>
                  <SelectTrigger size="sm" className="w-[68px] bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BOYUTLAR.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
