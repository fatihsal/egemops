"use client";

import {
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
import { useYonetimOzeti } from "@/lib/queries/yonetim-ozeti";

const iki = (v: number) => v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 3 });

export function OzetPerformansTrend() {
  const { data, isLoading } = useYonetimOzeti();

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <h3 className="font-heading text-base font-medium">Enerji Performans Trendi</h3>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded-full bg-teal-500" /> Gerçekleşen</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded-full border-t-2 border-dashed border-emerald-500" /> Hedef</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded-full border-t-2 border-dashed border-slate-400" /> Baz Yıl (2024)</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.performansTrend} margin={{ left: 8, right: 8, top: 12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="ay" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis domain={[0.2, 0.36]} ticks={[0.2, 0.24, 0.28, 0.32, 0.36]} tickLine={false} axisLine={false} fontSize={11} width={40} stroke="var(--muted-foreground)" tickFormatter={(v: number) => iki(v)} label={{ value: "TEP/ton", position: "top", offset: 8, fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  formatter={(v, n) => [iki(Number(v)), n === "gerceklesen" ? "Gerçekleşen" : n === "hedef" ? "Hedef" : "Baz Yıl"]}
                />
                <Line type="monotone" dataKey="bazYil" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="hedef" stroke="#10b981" strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="gerceklesen" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 3, fill: "#14b8a6" }} activeDot={{ r: 5 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
