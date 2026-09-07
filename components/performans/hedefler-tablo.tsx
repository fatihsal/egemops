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
import { cn } from "@/lib/utils";
import type { PerformansHedef } from "@/lib/types";

const DURUM: Record<PerformansHedef["durum"], { etiket: string; sinif: string }> = {
  hedefte: { etiket: "Hedefte", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  takip: { etiket: "Takip Gerekiyor", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  disi: { etiket: "Hedef Dışı", sinif: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
};

export function PerformansHedeflerTablo() {
  const { data, isLoading } = usePerformansAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Enerji Hedefleri</h3>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading || !data ? (
          <Skeleton className="h-[160px] w-full" />
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="whitespace-nowrap">Gösterge</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Baz (2024)</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Hedef (2026)</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Gerçek (2026)</TableHead>
                  <TableHead className="whitespace-nowrap">Durum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.hedefler.map((h) => {
                  const d = DURUM[h.durum];
                  return (
                    <TableRow key={h.gosterge} className="hover:bg-muted/40">
                      <TableCell className="font-medium whitespace-nowrap">{h.gosterge}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{h.baz}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{h.hedef}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{h.gercek}</TableCell>
                      <TableCell>
                        <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", d.sinif)}>{d.etiket}</span>
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
