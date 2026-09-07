"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjeAnaliz } from "@/lib/queries/projeler";
import { sayiOndalik } from "@/lib/format";

const RENK = ["#14b8a6", "#8b5cf6"];

export function ProjeTasarrufBar() {
  const { data, isLoading } = useProjeAnaliz();

  const grafikData = data
    ? [
        { etiket: "Planlanan Tasarruf", deger: data.tasarruf.planlanan },
        { etiket: "Doğrulanan Tasarruf", deger: data.tasarruf.dogrulanan },
      ]
    : [];

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">
          Planlanan / Doğrulanan Tasarruf <span className="text-sm font-normal text-muted-foreground">(TEP / yıl)</span>
        </h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {isLoading || !data ? (
          <Skeleton className="min-h-[260px] w-full flex-1" />
        ) : (
          <div className="min-h-[260px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={grafikData} margin={{ left: 4, right: 8, top: 28, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="etiket" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={36} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayiOndalik(v)} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  formatter={(value) => [`${sayiOndalik(Number(value))} TEP/yıl`, "Tasarruf"]}
                />
                <Bar dataKey="deger" radius={[4, 4, 0, 0]} maxBarSize={72} isAnimationActive={false}>
                  {grafikData.map((_, i) => <Cell key={i} fill={RENK[i]} />)}
                  <LabelList
                    dataKey="deger"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={(p: any) => {
                      const cx = Number(p.x ?? 0) + Number(p.width ?? 0) / 2;
                      return <text x={cx} y={Number(p.y ?? 0) - 8} textAnchor="middle" fontSize={14} fontWeight={700} fill="var(--foreground)">{sayiOndalik(Number(p.value ?? 0))}</text>;
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
