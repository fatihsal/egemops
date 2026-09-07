"use client";

import { Icon } from "@iconify/react";
import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTepAnaliz } from "@/lib/queries/tep";
import { sayi, sayi2, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

const RENK = "#0d9488";
const uc = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export function TepYogunlukAnaliz() {
  const { data, isLoading } = useTepAnaliz();
  if (isLoading || !data) return <Skeleton className="h-[520px] w-full rounded-xl" />;

  const aylar = data.aylik.slice(0, 7);
  const ort = aylar.reduce((t, a) => t + a.yogunluk, 0) / aylar.length;
  const yogKpi = data.kpiler.find((k) => k.anahtar === "yogunluk");
  const bz = data.bazYil;
  const yogSatir = data.yillikOzet.find((m) => m.metrik === "Enerji Yoğunluğu")!;
  const yillikVeri = [
    { yil: "2023", deger: yogSatir.y2023 },
    { yil: "2024", deger: yogSatir.y2024 },
    { yil: "2025", deger: yogSatir.y2025 },
    { yil: "2026", deger: yogSatir.y2026 },
  ];

  const kartlar = [
    { etiket: "Güncel Yoğunluk", deger: yogKpi?.deger ?? uc(aylar[6].yogunluk), birim: "TEP/ton", ikon: "solar:speedometer-max-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300", alt: "Temmuz 2026" },
    { etiket: "Ortalama Yoğunluk", deger: uc(ort), birim: "TEP/ton", ikon: "solar:chart-2-bold-duotone", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", alt: "YTD ortalama" },
    { etiket: `Baz Yıl (${bz.bazYil})`, deger: bz.bazDeger, birim: "TEP/ton", ikon: "solar:flag-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300", alt: "Referans değer" },
    { etiket: "Baz Yıla Göre İyileşme", deger: `%${sayiOndalik(Math.abs(bz.iyilesme))}`, birim: "", ikon: "solar:graph-down-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", alt: "Daha az = daha iyi", vurgu: true },
  ];

  return (
    <div className="space-y-6">
      {/* KPI kartları */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kartlar.map((k) => (
          <Card key={k.etiket} size="sm" className="h-full">
            <CardContent className="flex items-start gap-3">
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", k.sinif)}>
                <Icon icon={k.ikon} className="size-6" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{k.etiket}</p>
                <p className={cn("mt-0.5 font-heading text-lg font-bold tracking-tight tabular-nums", k.vurgu && "text-emerald-600 dark:text-emerald-400")}>
                  {k.deger} {k.birim ? <span className="text-xs font-normal text-muted-foreground">{k.birim}</span> : null}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{k.alt}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Aylık trend + yıllık yoğunluk */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <Card className="h-full xl:col-span-8">
          <CardHeader>
            <h3 className="font-heading text-base font-medium">Aylık Enerji Yoğunluğu <span className="text-sm font-normal text-muted-foreground">(TEP / ton)</span></h3>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aylar} margin={{ left: 8, right: 8, top: 12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} domain={["dataMin - 0.02", "dataMax + 0.02"]} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi2(v)} />
                  <Tooltip
                    cursor={{ stroke: "var(--border)" }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    labelFormatter={(_, p) => p?.[0]?.payload?.donem ?? ""}
                    formatter={(value) => [`${uc(Number(value))} TEP/ton`, "Yoğunluk"]}
                  />
                  <Line type="monotone" dataKey="yogunluk" stroke={RENK} strokeWidth={2.5} dot={{ r: 3.5, fill: RENK }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full xl:col-span-4">
          <CardHeader>
            <h3 className="font-heading text-base font-medium">Yıllık Yoğunluk <span className="text-sm font-normal text-muted-foreground">(TEP / ton)</span></h3>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yillikVeri} margin={{ left: 8, right: 8, top: 12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="yil" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} domain={[0, "dataMax + 0.04"]} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi2(v)} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(value) => [`${uc(Number(value))} TEP/ton`, "Yoğunluk"]}
                  />
                  <Bar dataKey="deger" radius={[4, 4, 0, 0]} maxBarSize={52}>
                    {yillikVeri.map((v, i) => (
                      <Cell key={i} fill={v.yil === "2026" ? RENK : "#99f6e4"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Üretim vs yoğunluk */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-heading text-base font-medium">Üretim ve Enerji Yoğunluğu</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-slate-400" /> Üretim (ton)</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-[3px] w-3.5 rounded-full bg-teal-600" /> Yoğunluk (TEP/ton)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={aylar} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis yAxisId="sol" tickLine={false} axisLine={false} fontSize={12} width={44} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi(v)} />
                <YAxis yAxisId="sag" orientation="right" tickLine={false} axisLine={false} fontSize={12} width={44} domain={["dataMin - 0.02", "dataMax + 0.02"]} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi2(v)} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  labelFormatter={(_, p) => p?.[0]?.payload?.donem ?? ""}
                  formatter={(value, name) => name === "yogunluk" ? [`${uc(Number(value))} TEP/ton`, "Yoğunluk"] : [`${sayi(Number(value))} ton`, "Üretim"]}
                />
                <Bar yAxisId="sol" dataKey="uretim" fill="#cbd5e1" radius={[3, 3, 0, 0]} maxBarSize={40} />
                <Line yAxisId="sag" type="monotone" dataKey="yogunluk" stroke={RENK} strokeWidth={2.5} dot={{ r: 3, fill: RENK }} activeDot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
