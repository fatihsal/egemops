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
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { sayi2 } from "@/lib/format";

const uc = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const SERI = [
  { anahtar: "bazEnPI", etiket: "Baz Performans", renk: "#3b82f6", kesikli: true },
  { anahtar: "hedefEnPI", etiket: "Hedef", renk: "#22c55e", kesikli: true },
  { anahtar: "gercekEnPI", etiket: "Gerçekleşen", renk: "#14b8a6", kesikli: false },
] as const;

export function PerformansTrend() {
  const { data, isLoading } = usePerformansAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-heading text-base font-medium">
            Enerji Performans Trendi <span className="text-sm font-normal text-muted-foreground">(TEP/ton)</span>
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            {SERI.map((s) => (
              <span key={s.anahtar} className="inline-flex items-center gap-1.5">
                <span className="h-0 w-4 border-t-2" style={{ borderColor: s.renk, borderStyle: s.kesikli ? "dashed" : "solid" }} />
                {s.etiket}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[320px] w-full" />
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.aylik} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} domain={[0.1, 0.42]} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayi2(v)} />
                <Tooltip
                  cursor={{ stroke: "var(--border)" }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  labelFormatter={(_, p) => p?.[0]?.payload?.donem ?? ""}
                  formatter={(value, name) => {
                    const s = SERI.find((x) => x.anahtar === name);
                    return [`${uc(Number(value))} TEP/ton`, s?.etiket ?? String(name)];
                  }}
                />
                {SERI.map((s) => (
                  <Line
                    key={s.anahtar}
                    type="monotone"
                    dataKey={s.anahtar}
                    stroke={s.renk}
                    strokeWidth={s.kesikli ? 2 : 2.5}
                    strokeDasharray={s.kesikli ? "6 4" : undefined}
                    dot={s.kesikli ? false : { r: 3, fill: s.renk }}
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
