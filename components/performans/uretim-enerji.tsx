"use client";

import {
  Bar,
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
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { useDil } from "@/components/providers/dil-provider";
import { sayi } from "@/lib/format";

export function PerformansUretimEnerji() {
  const { data, isLoading } = usePerformansAnaliz();
  const { t } = useDil();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-heading text-base font-medium">{t("Üretim – Enerji İlişkisi")}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-blue-500" /> {t("Üretim (ton)")}</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-[3px] w-3.5 rounded-full bg-teal-600" /> {t("Toplam TEP")}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data?.aylik} margin={{ left: 4, right: 4, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis yAxisId="sol" tickLine={false} axisLine={false} fontSize={12} width={44} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi(v)} />
                <YAxis yAxisId="sag" orientation="right" tickLine={false} axisLine={false} fontSize={12} width={40} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi(v)} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  labelFormatter={(_, p) => p?.[0]?.payload?.donem ?? ""}
                  formatter={(value, name) => name === "toplamTep" ? [`${sayi(Number(value))} TEP`, t("Toplam TEP")] : [`${sayi(Number(value))} ton`, t("Üretim")]}
                />
                <defs>
                  <linearGradient id="uretimDolgu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.75} />
                  </linearGradient>
                </defs>
                <Bar yAxisId="sol" dataKey="uretim" fill="url(#uretimDolgu)" radius={[3, 3, 0, 0]} maxBarSize={30} />
                <Line yAxisId="sag" type="monotone" dataKey="toplamTep" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3, fill: "#0d9488" }} activeDot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
