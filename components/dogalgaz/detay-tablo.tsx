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
import { useDogalgazAnaliz } from "@/lib/queries/dogalgaz";
import { sayi, sayi2, sayiOndalik } from "@/lib/format";

const BOYUTLAR = ["5", "10", "25"];

export function DogalgazDetayTablo() {
  const { data, isLoading } = useDogalgazAnaliz();
  const [sayfa, setSayfa] = React.useState(1);
  const [boyut, setBoyut] = React.useState(5);

  const satirlar = data?.detay ?? [];
  const toplamSayfa = Math.max(1, Math.ceil(satirlar.length / boyut));
  const geciliSayfa = Math.min(sayfa, toplamSayfa);
  const bas = (geciliSayfa - 1) * boyut;
  const gorunen = satirlar.slice(bas, bas + boyut);

  return (
    <Card>
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Aylık Detaylı Veriler</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="whitespace-nowrap">Dönem</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Doğalgaz <span className="font-normal text-muted-foreground">(Sm³)</span></TableHead>
                    <TableHead className="text-right whitespace-nowrap">Doğalgaz TEP</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Üretim <span className="font-normal text-muted-foreground">(ton)</span></TableHead>
                    <TableHead className="text-right whitespace-nowrap">Sm³/ton</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Önceki Aya Göre</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Geçen Yıla Göre</TableHead>
                    <TableHead className="text-right">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gorunen.map((r) => (
                    <TableRow key={r.ay} className="transition-colors hover:bg-muted/40">
                      <TableCell className="font-medium whitespace-nowrap">{r.donem}</TableCell>
                      <TableCell className="text-right tabular-nums">{sayi(r.sm3)}</TableCell>
                      <TableCell className="text-right tabular-nums">{sayi2(r.tep)}</TableCell>
                      <TableCell className="text-right tabular-nums">{sayi(r.uretim)}</TableCell>
                      <TableCell className="text-right tabular-nums">{sayiOndalik(r.yogunluk)}</TableCell>
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
                          <Button variant="ghost" size="icon-sm" aria-label="Görüntüle" className="text-muted-foreground hover:text-foreground" onClick={() => toast(`${r.donem} detayı açılıyor`)}>
                            <Icon icon="solar:eye-bold-duotone" className="size-4.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" aria-label="Analiz" className="text-muted-foreground hover:text-foreground" onClick={() => toast(`${r.donem} grafiği açılıyor`)}>
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
                / {sayi(satirlar.length)} kayıt
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
