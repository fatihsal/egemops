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
import { useYonetimOzeti } from "@/lib/queries/yonetim-ozeti";
import { sayi } from "@/lib/format";

const TUKETIM = "#14b8a6";
const URETIM = "#8b5cf6";

export function OzetTuketimUretim() {
  const { data, isLoading } = useYonetimOzeti();

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <h3 className="font-heading text-base font-medium">Aylık Enerji Tüketimi ve Üretim</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: TUKETIM }} /> Enerji Tüketimi (TEP)</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded-full" style={{ background: URETIM }} /> Üretim (ton)</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.tuketimUretim} margin={{ left: 4, right: 4, top: 12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="ay" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis yAxisId="sol" domain={[0, 2500]} tickLine={false} axisLine={false} fontSize={11} width={44} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi(v)} label={{ value: "TEP", position: "top", offset: 8, fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis yAxisId="sag" orientation="right" domain={[0, 10000]} tickLine={false} axisLine={false} fontSize={11} width={48} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi(v)} label={{ value: "Üretim (ton)", position: "top", offset: 8, fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  formatter={(v, n) => [`${sayi(Number(v))} ${n === "tuketim" ? "TEP" : "ton"}`, n === "tuketim" ? "Enerji Tüketimi" : "Üretim"]}
                />
                <Bar yAxisId="sol" dataKey="tuketim" fill={TUKETIM} radius={[4, 4, 0, 0]} maxBarSize={30} isAnimationActive={false} />
                <Line yAxisId="sag" type="monotone" dataKey="uretim" stroke={URETIM} strokeWidth={2.5} dot={{ r: 3, fill: URETIM }} activeDot={{ r: 5 }} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
