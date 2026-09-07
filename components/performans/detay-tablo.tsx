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
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { sayi } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PerformansAylik } from "@/lib/types";

const uc = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

const PERF: Record<PerformansAylik["performans"], { etiket: string; sinif: string }> = {
  takip: { etiket: "Takip Gerekiyor", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  hedefte: { etiket: "Hedefte", sinif: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" },
  iyi: { etiket: "İyi", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
};

export function PerformansDetayTablo() {
  const { data, isLoading } = usePerformansAnaliz();
  const satirlar = (data?.aylik ?? []).slice(0, 7);

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Aylık Performans Verileri</h3>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="whitespace-nowrap">Dönem</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Üretim <span className="font-normal text-muted-foreground">(ton)</span></TableHead>
                  <TableHead className="text-right whitespace-nowrap">Baz EnPI</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Hedef EnPI</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Gerçek EnPI</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Sapma</TableHead>
                  <TableHead className="whitespace-nowrap">Performans</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {satirlar.map((r) => {
                  const p = PERF[r.performans];
                  const artiSapma = r.sapma > 0;
                  return (
                    <TableRow key={r.ay} className="odd:bg-muted/20 hover:bg-muted/50">
                      <TableCell className="font-medium whitespace-nowrap">{r.ay}</TableCell>
                      <TableCell className="text-right tabular-nums">{sayi(r.uretim)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{uc(r.bazEnPI)}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{uc(r.hedefEnPI)}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{uc(r.gercekEnPI)}</TableCell>
                      <TableCell className={cn("text-right font-medium tabular-nums", artiSapma ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                        {artiSapma ? "+" : "−"}{uc(Math.abs(r.sapma))}
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", p.sinif)}>{p.etiket}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
