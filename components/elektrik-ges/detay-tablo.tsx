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
import { useDil } from "@/components/providers/dil-provider";
import { sayi, sayi2, sayiOndalik } from "@/lib/format";
import type { ElektrikAylik } from "@/lib/types";

const BOYUTLAR = ["4", "8", "16"];

interface Kolon {
  anahtar: string;
  baslik: string;
  birim?: string;
  saga?: boolean;
  hucre: (r: ElektrikAylik) => React.ReactNode;
}

const KOLONLAR: Kolon[] = [
  { anahtar: "donem", baslik: "Dönem", hucre: (r) => <span className="font-medium whitespace-nowrap">{r.donem}</span> },
  { anahtar: "sebeke", baslik: "Şebeke Tüketimi", birim: "kWh", saga: true, hucre: (r) => sayi2(r.sebeke) },
  { anahtar: "gesUretim", baslik: "GES Üretimi", birim: "kWh", saga: true, hucre: (r) => sayi2(r.gesUretim) },
  { anahtar: "gesOz", baslik: "GES Öz Tüketimi", birim: "kWh", saga: true, hucre: (r) => sayi2(r.gesOz) },
  { anahtar: "verilen", baslik: "Şebekeye Verilen", birim: "kWh", saga: true, hucre: (r) => sayi2(r.sebekeyeVerilen) },
  { anahtar: "fabrika", baslik: "Fabrika Toplam", birim: "kWh", saga: true, hucre: (r) => <span className="font-medium">{sayi2(r.fabrikaToplam)}</span> },
  { anahtar: "karsilama", baslik: "GES Karşılama Oranı", birim: "%", saga: true, hucre: (r) => `%${sayiOndalik(r.gesKarsilama)}` },
  { anahtar: "tep", baslik: "Elektrik TEP", saga: true, hucre: (r) => sayi2(r.elektrikTep) },
  { anahtar: "yogunluk", baslik: "Elektrik Yoğunluğu", birim: "kWh/ton", saga: true, hucre: (r) => sayiOndalik(r.elektrikYogunluk) },
];

export function ElektrikDetayTablo() {
  const { data, isLoading } = useElektrikGesAnaliz();
  const { t } = useDil();
  const [sayfa, setSayfa] = React.useState(1);
  const [boyut, setBoyut] = React.useState(4);

  // Yalnızca gerçekleşen aylar (Ocak–Temmuz), en yeni önce.
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
                    {KOLONLAR.map((k) => (
                      <TableHead
                        key={k.anahtar}
                        className={k.saga ? "text-right whitespace-nowrap" : "whitespace-nowrap"}
                      >
                        {t(k.baslik)}
                        {k.birim ? (
                          <span className="ml-1 font-normal text-muted-foreground">({k.birim})</span>
                        ) : null}
                      </TableHead>
                    ))}
                    <TableHead className="text-right">{t("İşlem")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gorunen.map((r) => (
                    <TableRow key={r.ay} className="transition-colors hover:bg-muted/40">
                      {KOLONLAR.map((k) => (
                        <TableCell
                          key={k.anahtar}
                          className={k.saga ? "text-right tabular-nums" : ""}
                        >
                          {k.hucre(r)}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center justify-end gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={t("Görüntüle")}
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => toast(`${r.donem} detayı açılıyor`)}
                          >
                            <Icon icon="solar:eye-bold-duotone" className="size-4.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={t("Analiz")}
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => toast(`${r.donem} grafiği açılıyor`)}
                          >
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
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={t("Önceki")}
                  disabled={geciliSayfa <= 1}
                  onClick={() => setSayfa((s) => Math.max(1, s - 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: toplamSayfa }, (_, i) => i + 1).map((n) => (
                  <Button
                    key={n}
                    variant={n === geciliSayfa ? "default" : "ghost"}
                    size="icon-sm"
                    className="tabular-nums"
                    onClick={() => setSayfa(n)}
                  >
                    {n}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={t("Sonraki")}
                  disabled={geciliSayfa >= toplamSayfa}
                  onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t("Sayfa başına")}:</span>
                <Select
                  value={String(boyut)}
                  onValueChange={(v) => {
                    setBoyut(Number(v));
                    setSayfa(1);
                  }}
                >
                  <SelectTrigger size="sm" className="w-[68px] bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BOYUTLAR.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
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
