"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

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
import { DURUM_META } from "@/components/projeler/stiller";
import { useYonetimOzeti } from "@/lib/queries/yonetim-ozeti";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

export function OzetAktifProjeler() {
  const { data, isLoading } = useYonetimOzeti();

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <h3 className="font-heading text-base font-medium">Aktif Projeler</h3>
        <Link href="/projeler" className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-80">
          Tümünü Gör <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[180px] w-full" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Proje Adı</TableHead>
                  <TableHead className="whitespace-nowrap">Durum</TableHead>
                  <TableHead className="whitespace-nowrap">İlerleme</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Beklenen Tasarruf <span className="font-normal text-muted-foreground">(TEP/yıl)</span></TableHead>
                  <TableHead className="whitespace-nowrap">Termin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.projeler.map((p) => {
                  const d = DURUM_META[p.durum];
                  return (
                    <TableRow key={p.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium whitespace-nowrap">{p.ad}</TableCell>
                      <TableCell>
                        <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", d.sinif)}>{d.etiket}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <span className="block h-full rounded-full bg-teal-500" style={{ width: `${p.ilerleme}%` }} />
                          </span>
                          <span className="w-8 text-right text-xs font-medium tabular-nums text-muted-foreground">%{p.ilerleme}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{sayiOndalik(p.tasarruf)}</TableCell>
                      <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{p.termin}</TableCell>
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
