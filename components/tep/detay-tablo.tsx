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
import { sayi, sayi2 } from "@/lib/format";

const BOYUTLAR = ["4", "10", "25"];

const uc = (n: number) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export function TepDetayTablo() {
  const { data, isLoading } = useTepAnaliz();
  const { t } = useDil();
  const [sayfa, setSayfa] = React.useState(1);
  const [boyut, setBoyut] = React.useState(4);

  // Gerçekleşen aylar (Ocak–Temmuz), en yeni önce.
  const satirlar = React.useMemo(
    () => (data?.aylik ?? []).slice(0, 7).slice().reverse(),
    [data],
  );

  const toplamSayfa = Math.max(1, Math.ceil(satirlar.length / boyut));
  const geciliSayfa = Math.min(sayfa, toplamSayfa);
  const bas = (geciliSayfa - 1) * boyut;
  const gorunen = satirlar.slice(bas, bas + boyut);

  return (
    <Card>
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Aylık Detaylı Veriler")}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="whitespace-nowrap">{t("Dönem")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Elektrik TEP")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Doğalgaz TEP")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Akaryakıt TEP")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Toplam TEP")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Üretim")} <span className="font-normal text-muted-foreground">(ton)</span></TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("TEP / ton")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Önceki Ay")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Geçen Yıl")}</TableHead>
                    <TableHead className="text-right">{t("İşlem")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gorunen.map((r) => (
                    <TableRow key={r.ay} className="odd:bg-muted/20 hover:bg-muted/50">
                      <TableCell className="font-medium whitespace-nowrap">{r.donem}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{sayi2(r.elektrik)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{sayi2(r.dogalgaz)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{sayi2(r.akaryakit)}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{sayi2(r.toplam)}</TableCell>
                      <TableCell className="text-right tabular-nums">{sayi(r.uretim)}</TableCell>
                      <TableCell className="text-right tabular-nums">{uc(r.yogunluk)}</TableCell>
                      <TableCell className="text-right">
                        {r.oncekiAy === null ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <Degisim yuzde={r.oncekiAy} className="justify-end" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {r.gecenYil === null ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <Degisim yuzde={r.gecenYil} className="justify-end" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-0.5">
                          <Button variant="ghost" size="icon-sm" aria-label={t("Görüntüle")} className="text-muted-foreground hover:text-foreground" onClick={() => toast(`${r.donem} detayı açılıyor`)}>
                            <Icon icon="solar:eye-bold-duotone" className="size-4.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" aria-label={t("Analiz")} className="text-muted-foreground hover:text-foreground" onClick={() => toast(`${r.donem} grafiği açılıyor`)}>
                            <Icon icon="solar:chart-2-bold-duotone" className="size-4.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Sayfalama */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                <span className="tabular-nums">
                  {sayi(bas + 1)}–{sayi(Math.min(bas + boyut, satirlar.length))}
                </span>{" "}
                / {sayi(satirlar.length)} {t("kayıt")}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon-sm" aria-label={t("Önceki")} disabled={geciliSayfa <= 1} onClick={() => setSayfa((s) => Math.max(1, s - 1))}>
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: toplamSayfa }, (_, i) => i + 1).map((n) => (
                  <Button key={n} variant={n === geciliSayfa ? "default" : "ghost"} size="icon-sm" className="tabular-nums" onClick={() => setSayfa(n)}>
                    {n}
                  </Button>
                ))}
                <Button variant="outline" size="icon-sm" aria-label={t("Sonraki")} disabled={geciliSayfa >= toplamSayfa} onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t("Sayfa başına")}:</span>
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
