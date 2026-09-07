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
import { useRaporAnaliz } from "@/lib/queries/raporlar";

const OLUSTURULAN = "#14b8a6"; // teal — line
const INDIRILEN = "#8b5cf6"; // violet — bar

function Nokta({ renk }: { renk: string }) {
  return <span className="size-2.5 rounded-full" style={{ background: renk }} />;
}

export function RaporTrend() {
  const { data, isLoading } = useRaporAnaliz();

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <h3 className="font-heading text-base font-medium">
          Rapor Trendi <span className="text-sm font-normal text-muted-foreground">(Son 6 Ay)</span>
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><Nokta renk={OLUSTURULAN} /> Oluşturulan Rapor</span>
          <span className="inline-flex items-center gap-1.5"><Nokta renk={INDIRILEN} /> İndirilen Rapor</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {isLoading || !data ? (
          <Skeleton className="min-h-[260px] w-full flex-1" />
        ) : (
          <div className="min-h-[260px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.trend} margin={{ left: 4, right: 8, top: 12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="etiket" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={28} stroke="var(--muted-foreground)" allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  formatter={(value, name) => [`${value} rapor`, name === "indirilen" ? "İndirilen" : "Oluşturulan"]}
                />
                <Bar dataKey="indirilen" name="indirilen" fill={INDIRILEN} radius={[4, 4, 0, 0]} maxBarSize={34} isAnimationActive={false} />
                <Line type="monotone" dataKey="olusturulan" name="olusturulan" stroke={OLUSTURULAN} strokeWidth={2.5} dot={{ r: 3, fill: OLUSTURULAN }} activeDot={{ r: 5 }} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
