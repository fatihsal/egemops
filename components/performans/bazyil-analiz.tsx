"use client";

import { Icon } from "@iconify/react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
import { PerformansBazYil } from "@/components/performans/baz-yil-karti";
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { sayi2, sayiOndalik } from "@/lib/format";

const uc = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const num = (s: string) => Number(s.replace(/\./g, "").replace(",", "."));

export function PerformansBazYilAnaliz() {
  const { data, isLoading } = usePerformansAnaliz();
  if (isLoading || !data) return <Skeleton className="h-[520px] w-full rounded-xl" />;

  const tasarruf = data.kpiler.find((k) => k.anahtar === "tasarruf");

  return (
    <div className="space-y-6">
      <PerformansBazYil />

      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <Card className="h-full xl:col-span-8">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-heading text-base font-medium">Baz Yıl vs 2026 Gerçekleşen <span className="text-sm font-normal text-muted-foreground">(TEP/ton)</span></h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-slate-300" /> Baz Yıl (2024)</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-[3px] w-3.5 rounded-full bg-teal-600" /> 2026 Gerçekleşen</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.aylik} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bazDolgu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} domain={["dataMin - 0.02", "dataMax + 0.02"]} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi2(v)} />
                  <Tooltip
                    cursor={{ stroke: "var(--border)" }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    labelFormatter={(_, p) => p?.[0]?.payload?.donem ?? ""}
                    formatter={(value, name) => [`${uc(Number(value))} TEP/ton`, name === "bazEnPI" ? "Baz Yıl" : "Gerçekleşen"]}
                  />
                  <Area type="monotone" dataKey="bazEnPI" stroke="#94a3b8" strokeWidth={1.5} fill="url(#bazDolgu)" />
                  <Line type="monotone" dataKey="gercekEnPI" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3, fill: "#0d9488" }} activeDot={{ r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full xl:col-span-4">
          <CardHeader>
            <h3 className="font-heading text-base font-medium">Tasarruf Özeti</h3>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                <Icon icon="solar:leaf-bold-duotone" className="size-8" />
              </span>
              <div>
                <p className="flex items-baseline justify-center gap-1">
                  <span className="font-heading text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{tasarruf?.deger}</span>
                  <span className="text-sm text-muted-foreground">TEP</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Baz performansa göre toplam tasarruf</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* İyileşme tablosu */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-base font-medium">Baz Yıla Göre İyileşme</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="whitespace-nowrap">Gösterge</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Baz (2024)</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Gerçek (2026)</TableHead>
                  <TableHead className="text-right whitespace-nowrap">İyileşme</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.hedefler.map((h) => {
                  const iyilesme = Math.round(((num(h.gercek) - num(h.baz)) / num(h.baz)) * 1000) / 10;
                  return (
                    <TableRow key={h.gosterge} className="odd:bg-muted/20 hover:bg-muted/40">
                      <TableCell className="font-medium whitespace-nowrap">{h.gosterge}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{h.baz}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{h.gercek}</TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center justify-end gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="text-[9px] leading-none">▼</span>%{sayiOndalik(Math.abs(iyilesme))}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
