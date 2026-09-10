"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PerformansBeklenenGerceklesen } from "@/components/performans/beklenen-gerceklesen";
import { PerformansSapmaWaterfall } from "@/components/performans/sapma-waterfall";
import { PerformansDetayTablo } from "@/components/performans/detay-tablo";
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { useDil } from "@/components/providers/dil-provider";

const uc = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export function PerformansSapmaAnaliz() {
  const { data, isLoading } = usePerformansAnaliz();
  const { t } = useDil();
  if (isLoading || !data) return <Skeleton className="h-[520px] w-full rounded-xl" />;

  return (
    <div className="space-y-6">
      <PerformansBeklenenGerceklesen />

      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
        <PerformansSapmaWaterfall />

        <Card className="h-full">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-heading text-base font-medium">{t("Aylık Sapma")} <span className="text-sm font-normal text-muted-foreground">(TEP/ton)</span></h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-amber-500" /> {t("Hedef üstü")}</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-emerald-500" /> {t("Hedef altı")}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.aylik} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={52} stroke="var(--muted-foreground)" tickFormatter={(v: number) => uc(v)} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    labelFormatter={(_, p) => p?.[0]?.payload?.donem ?? ""}
                    formatter={(value) => [`${Number(value) >= 0 ? "+" : "−"}${uc(Math.abs(Number(value)))} TEP/ton`, t("Sapma")]}
                  />
                  <Bar dataKey="sapma" radius={[2, 2, 0, 0]} maxBarSize={30}>
                    {data.aylik.map((r, i) => <Cell key={i} fill={r.sapma > 0 ? "#f59e0b" : "#10b981"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <PerformansDetayTablo />
    </div>
  );
}
