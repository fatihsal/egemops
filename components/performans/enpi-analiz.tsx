"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RadialOran } from "@/components/kayit-detay/parcalar";
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { useDil } from "@/components/providers/dil-provider";
import { sayi2 } from "@/lib/format";
import { cn } from "@/lib/utils";

const uc = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const num = (s: string) => Number(s.replace(/\./g, "").replace(",", "."));

export function PerformansEnpiAnaliz() {
  const { data, isLoading } = usePerformansAnaliz();
  const { t } = useDil();
  if (isLoading || !data) return <Skeleton className="h-[520px] w-full rounded-xl" />;

  return (
    <div className="space-y-6">
      {/* Gösterge ilerleme kartları */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {data.hedefler.map((h) => {
          const baz = num(h.baz), hedef = num(h.hedef), gercek = num(h.gercek);
          const ilerleme = Math.round(((baz - gercek) / (baz - hedef)) * 100);
          const asildi = gercek <= hedef;
          return (
            <Card key={h.gosterge} className="h-full">
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{t(h.gosterge)}</p>
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", asildi ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300")}>
                    {asildi ? t("Hedef Aşıldı") : t("Takipte")}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-[11px] text-muted-foreground">{t("Baz")}</p><p className="mt-0.5 font-heading font-bold tabular-nums text-muted-foreground">{h.baz}</p></div>
                  <div><p className="text-[11px] text-muted-foreground">{t("Hedef")}</p><p className="mt-0.5 font-heading font-bold tabular-nums">{h.hedef}</p></div>
                  <div><p className="text-[11px] text-muted-foreground">{t("Gerçek")}</p><p className="mt-0.5 font-heading font-bold tabular-nums text-teal-600 dark:text-teal-400">{h.gercek}</p></div>
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", asildi ? "bg-emerald-500" : "bg-teal-500")} style={{ width: `${Math.min(100, Math.max(0, ilerleme))}%` }} />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{t("Hedefe ilerleme")}: %{Math.min(100, Math.max(0, ilerleme))}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hedef vs gerçek + radial */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <Card className="h-full xl:col-span-8">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-heading text-base font-medium">{t("Aylık EnPI: Hedef vs Gerçek")} <span className="text-sm font-normal text-muted-foreground">(TEP/ton)</span></h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="h-0 w-4 border-t-2 border-dashed border-green-500" /> {t("Hedef")}</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-[3px] w-3.5 rounded-full bg-teal-600" /> {t("Gerçekleşen")}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.aylik} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v: string) => t(v)} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} domain={["dataMin - 0.02", "dataMax + 0.02"]} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi2(v)} />
                  <Tooltip
                    cursor={{ stroke: "var(--border)" }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    labelFormatter={(_, p) => t(p?.[0]?.payload?.donem ?? "")}
                    formatter={(value, name) => [`${uc(Number(value))} TEP/ton`, name === "hedefEnPI" ? t("Hedef") : t("Gerçekleşen")]}
                  />
                  <Line type="monotone" dataKey="hedefEnPI" stroke="#22c55e" strokeWidth={2} strokeDasharray="6 4" dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="gercekEnPI" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3, fill: "#0d9488" }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full xl:col-span-4">
          <CardHeader>
            <h3 className="font-heading text-base font-medium">{t("Hedef İlerlemesi")}</h3>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <RadialOran deger={data.radial.oran} renk="#0d9488" className="size-40" yaziSinif="text-3xl" />
              <p className="text-center text-xs text-muted-foreground">{t("2026 hedefinin")} <span className="font-semibold text-foreground">%{data.radial.oran}</span>{t("'ü gerçekleşti")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Aylık sapma */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-base font-medium">{t("Aylık Sapma")} <span className="text-sm font-normal text-muted-foreground">({t("Gerçek − Hedef, TEP/ton")})</span></h3>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.aylik} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v: string) => t(v)} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={52} stroke="var(--muted-foreground)" tickFormatter={(v: number) => uc(v)} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  labelFormatter={(_, p) => t(p?.[0]?.payload?.donem ?? "")}
                  formatter={(value) => [`${Number(value) >= 0 ? "+" : "−"}${uc(Math.abs(Number(value)))} TEP/ton`, t("Sapma")]}
                />
                <Bar dataKey="sapma" radius={[2, 2, 0, 0]} maxBarSize={34}>
                  {data.aylik.map((r, i) => <Cell key={i} fill={r.sapma > 0 ? "#f59e0b" : "#10b981"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
