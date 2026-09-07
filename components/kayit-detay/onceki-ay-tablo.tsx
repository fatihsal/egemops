"use client";

import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Degisim } from "@/components/kayit-detay/parcalar";
import { sayi2 } from "@/lib/format";
import type { EnerjiKayit } from "@/lib/types";

function oran(guncel: number, onceki: number | null): number | null {
  if (onceki === null || onceki === 0) return null;
  return Math.round(((guncel - onceki) / onceki) * 1000) / 10;
}

export function OncekiAyTablo({ kayit }: { kayit: EnerjiKayit }) {
  const satirlar = [
    { etiket: "Toplam Enerji", ikon: "solar:bolt-circle-bold-duotone", renk: "text-blue-500", guncel: kayit.toplamTep, onceki: kayit.oncekiTep },
    { etiket: "Elektrik", ikon: "solar:bolt-bold-duotone", renk: "text-blue-500", guncel: kayit.elektrikTep, onceki: kayit.oncekiElektrikTep },
    { etiket: "Doğalgaz", ikon: "solar:fire-bold-duotone", renk: "text-violet-500", guncel: kayit.dogalgazTep, onceki: kayit.oncekiDogalgazTep },
    { etiket: "Akaryakıt", ikon: "solar:gas-station-bold-duotone", renk: "text-orange-500", guncel: kayit.akaryakitTep, onceki: kayit.oncekiAkaryakitTep },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:calendar-mark-bold-duotone" className="size-5 text-primary" />
            Önceki Ay Karşılaştırması
          </CardTitle>
          {kayit.oncekiDonem ? (
            <span className="text-xs font-medium text-muted-foreground">
              {kayit.oncekiDonem}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Gösterge</TableHead>
              <TableHead className="text-right">{kayit.oncekiDonem ?? "—"}</TableHead>
              <TableHead className="text-right">{kayit.donem}</TableHead>
              <TableHead className="text-right">Değişim</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {satirlar.map((s) => (
              <TableRow key={s.etiket}>
                <TableCell>
                  <span className="flex items-center gap-2 font-medium">
                    <Icon icon={s.ikon} className={`size-4.5 ${s.renk}`} />
                    {s.etiket}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {s.onceki !== null ? `${sayi2(s.onceki)} TEP` : "—"}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {sayi2(s.guncel)} TEP
                </TableCell>
                <TableCell className="text-right">
                  {oran(s.guncel, s.onceki) !== null ? (
                    <Degisim yuzde={oran(s.guncel, s.onceki)!} className="justify-end" />
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
