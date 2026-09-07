"use client";

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
import { DURUM_META, KAYNAK_ETIKET, KAYNAK_RENK, ONCELIK } from "@/components/firsatlar/stiller";
import { TumFirsatlarDrawer } from "@/components/firsatlar/tum-firsatlar-drawer";
import { useFirsatAnaliz } from "@/lib/queries/firsatlar";
import { sayi, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Firsat } from "@/lib/types";

export function FirsatOnceilkliTablo() {
  const { data, isLoading } = useFirsatAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Öncelikli Fırsatlar</h3>
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
                    <TableHead className="whitespace-nowrap">Öncelik</TableHead>
                    <TableHead className="whitespace-nowrap">Fırsat Adı</TableHead>
                    <TableHead className="whitespace-nowrap">Enerji Kaynağı</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Potansiyel Tasarruf <span className="font-normal text-muted-foreground">(TEP/yıl)</span></TableHead>
                    <TableHead className="text-right whitespace-nowrap">Yatırım <span className="font-normal text-muted-foreground">(€)</span></TableHead>
                    <TableHead className="text-right whitespace-nowrap">Geri Dönüş <span className="font-normal text-muted-foreground">(yıl)</span></TableHead>
                    <TableHead className="whitespace-nowrap">Durum</TableHead>
                    <TableHead className="whitespace-nowrap">İlerleme</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...data.firsatlar].sort((a, b) => b.tasarruf - a.tasarruf).slice(0, 5).map((f: Firsat) => {
                    const o = ONCELIK[f.oncelik];
                    const d = DURUM_META[f.durum];
                    return (
                      <TableRow key={f.id} className="odd:bg-muted/20 hover:bg-muted/50">
                        <TableCell>
                          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium", o.sinif)}>{o.etiket}</span>
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">{f.ad}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full" style={{ background: KAYNAK_RENK[f.kaynak] }} />
                            {KAYNAK_ETIKET[f.kaynak]}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">{sayiOndalik(f.tasarruf)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{sayi(f.yatirim)}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{sayiOndalik(f.geriDonus)}</TableCell>
                        <TableCell>
                          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", d.sinif)}>{d.etiket}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <span className="block h-full rounded-full bg-teal-500" style={{ width: `${f.ilerleme}%` }} />
                            </span>
                            <span className="w-8 text-right text-xs font-medium tabular-nums text-muted-foreground">%{f.ilerleme}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <TumFirsatlarDrawer etiket="Tüm Fırsatları Görüntüle" className="self-start" />
          </>
        )}
      </CardContent>
    </Card>
  );
}
