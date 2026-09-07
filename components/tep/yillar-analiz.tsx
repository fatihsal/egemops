"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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
import { Degisim } from "@/components/kayit-detay/parcalar";
import { useTepAnaliz } from "@/lib/queries/tep";
import { sayi2, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

const YIL_RENK = { y2023: "#94a3b8", y2024: "#2563eb", y2025: "#8b5cf6", y2026: "#14b8a6" };
const CIZGI = [
  { anahtar: "y2023", etiket: "2023", renk: YIL_RENK.y2023 },
  { anahtar: "y2024", etiket: "2024", renk: YIL_RENK.y2024 },
  { anahtar: "y2025", etiket: "2025", renk: YIL_RENK.y2025 },
  { anahtar: "y2026", etiket: "2026", renk: YIL_RENK.y2026 },
] as const;

function Yoy({ yuzde, puan }: { yuzde: number; puan?: boolean }) {
  const arti = yuzde >= 0;
  return (
    <span className={cn("inline-flex items-center justify-end gap-0.5 text-xs font-semibold", arti ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
      <span className="text-[9px] leading-none">{arti ? "▲" : "▼"}</span>
      {puan ? `${sayiOndalik(Math.abs(yuzde))} puan` : `%${sayiOndalik(Math.abs(yuzde))}`}
    </span>
  );
}

export function TepYillarAnaliz() {
  const { data, isLoading } = useTepAnaliz();
  if (isLoading || !data) return <Skeleton className="h-[520px] w-full rounded-xl" />;

  const oz = (m: string) => data.yillikOzet.find((x) => x.metrik === m)!;
  const elk = oz("Elektrik TEP"), dg = oz("Doğalgaz TEP"), ak = oz("Akaryakıt TEP");
  const mixVeri = [
    { yil: "2023", elektrik: elk.y2023, dogalgaz: dg.y2023, akaryakit: ak.y2023 },
    { yil: "2024", elektrik: elk.y2024, dogalgaz: dg.y2024, akaryakit: ak.y2024 },
    { yil: "2025", elektrik: elk.y2025, dogalgaz: dg.y2025, akaryakit: ak.y2025 },
    { yil: "2026", elektrik: elk.y2026, dogalgaz: dg.y2026, akaryakit: ak.y2026 },
  ];

  return (
    <div className="space-y-6">
      {/* Yıl kartları */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {data.yillik.map((y) => (
          <Card key={y.yil} className="h-full">
            <CardContent className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">{y.yil} Toplam</p>
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-heading text-2xl font-bold tracking-tight">{sayiOndalik(y.tep)}</span>
                  <span className="text-sm text-muted-foreground">TEP</span>
                </p>
                <div className="mt-1.5">
                  {y.yoy === null ? <span className="text-xs text-muted-foreground">Baz yıl</span> : <Degisim yuzde={y.yoy} etiket="önceki yıl" />}
                </div>
              </div>
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl font-heading text-sm font-bold" style={{ background: `${YIL_RENK[`y${y.yil}` as keyof typeof YIL_RENK]}1a`, color: YIL_RENK[`y${y.yil}` as keyof typeof YIL_RENK] }}>
                {y.yil}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Çoklu çizgi + yıllık mix */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <Card className="h-full xl:col-span-8">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-heading text-base font-medium">Yıllara Göre Aylık Toplam Enerji <span className="text-sm font-normal text-muted-foreground">(TEP)</span></h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                {CIZGI.map((c) => (
                  <span key={c.anahtar} className="inline-flex items-center gap-1.5"><span className="h-[3px] w-3.5 rounded-full" style={{ background: c.renk }} /> {c.etiket}</span>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.aylikKarsilastirma} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayiOndalik(v)} />
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(value, name) => {
                      const c = CIZGI.find((x) => x.anahtar === name);
                      return [value === null ? "—" : `${sayiOndalik(Number(value))} TEP`, c?.etiket ?? String(name)];
                    }}
                  />
                  {CIZGI.map((c) => (
                    <Line key={c.anahtar} type="monotone" dataKey={c.anahtar} stroke={c.renk} strokeWidth={2} dot={{ r: 2.5, fill: c.renk }} activeDot={{ r: 5 }} connectNulls />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full xl:col-span-4">
          <CardHeader>
            <div className="space-y-2.5">
              <h3 className="font-heading text-base font-medium">Yıllık Kaynak Kırılımı <span className="text-sm font-normal text-muted-foreground">(TEP)</span></h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-600" /> Elektrik</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-violet-500" /> Doğalgaz</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-orange-500" /> Akaryakıt</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mixVeri} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="yil" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayiOndalik(v)} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(value, name) => [`${sayiOndalik(Number(value))} TEP`, name === "elektrik" ? "Elektrik" : name === "dogalgaz" ? "Doğalgaz" : "Akaryakıt"]}
                  />
                  <Bar dataKey="elektrik" stackId="y" fill="#2563eb" maxBarSize={48} />
                  <Bar dataKey="dogalgaz" stackId="y" fill="#8b5cf6" maxBarSize={48} />
                  <Bar dataKey="akaryakit" stackId="y" fill="#f59e0b" radius={[3, 3, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yıllık özet tablosu */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-base font-medium">Yıllık Özet</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="whitespace-nowrap">Metrik</TableHead>
                  <TableHead className="text-right">2023</TableHead>
                  <TableHead className="text-right">2024</TableHead>
                  <TableHead className="text-right">2025</TableHead>
                  <TableHead className="text-right">2026</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Değişim (25→26)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.yillikOzet.map((m) => {
                  const bicim = (n: number) => (m.birim === "TEP/ton" ? sayi2(n) : sayiOndalik(n));
                  const vurgu = m.metrik === "Toplam TEP";
                  return (
                    <TableRow key={m.metrik} className={cn("odd:bg-muted/20 hover:bg-muted/40", vurgu && "!bg-primary/5 font-medium")}>
                      <TableCell className="whitespace-nowrap">
                        {m.metrik}
                        <span className="ml-1 font-normal text-muted-foreground">({m.birim})</span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{bicim(m.y2023)}</TableCell>
                      <TableCell className="text-right tabular-nums">{bicim(m.y2024)}</TableCell>
                      <TableCell className="text-right tabular-nums">{bicim(m.y2025)}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{bicim(m.y2026)}</TableCell>
                      <TableCell className="text-right"><Yoy yuzde={m.yoy} puan={m.yoyBirim === "puan"} /></TableCell>
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
