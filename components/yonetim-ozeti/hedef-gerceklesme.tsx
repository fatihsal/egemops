"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useYonetimOzeti } from "@/lib/queries/yonetim-ozeti";

export function OzetHedefGerceklesme() {
  const { data, isLoading } = useYonetimOzeti();
  const h = data?.hedef;

  const dilim = h ? [{ v: h.yuzde }, { v: 100 - h.yuzde }] : [];

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Hedef Gerçekleşme</h3>
      </CardHeader>
      <CardContent className="flex flex-1 items-center gap-6">
        {isLoading || !h ? (
          <Skeleton className="h-[220px] w-full" />
        ) : (
          <>
            <div className="relative size-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dilim} dataKey="v" innerRadius={58} outerRadius={78} startAngle={90} endAngle={-270} stroke="none">
                    <Cell fill="#22c55e" />
                    <Cell fill="var(--muted)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-3xl font-bold tracking-tight tabular-nums text-emerald-600">%{h.yuzde}</span>
              </div>
            </div>

            <dl className="flex-1 space-y-3">
              <div className="border-b pb-3">
                <dt className="text-xs text-muted-foreground">Hedef İyileşme</dt>
                <dd className="font-heading text-lg font-bold tabular-nums">{h.hedefIyilesme}</dd>
              </div>
              <div className="border-b pb-3">
                <dt className="text-xs text-muted-foreground">Gerçekleşen</dt>
                <dd className="font-heading text-lg font-bold tabular-nums text-emerald-600">{h.gerceklesen}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Hedefe Kalan</dt>
                <dd className="font-heading text-lg font-bold tabular-nums">{h.hedefeKalan}</dd>
              </div>
            </dl>
          </>
        )}
      </CardContent>
    </Card>
  );
}
