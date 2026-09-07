"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirsatAnaliz } from "@/lib/queries/firsatlar";
import type { FirsatDurum } from "@/lib/types";

export const DURUM_RENK: Record<FirsatDurum, string> = {
  fizibilite: "#8b5cf6",
  teklif: "#3b82f6",
  onaylandi: "#f59e0b",
  uygulama: "#14b8a6",
  tamamlandi: "#22c55e",
};

export function FirsatDurumDonut() {
  const { data, isLoading } = useFirsatAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Fırsat Durum Dağılımı</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-5">
        {isLoading || !data ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <>
            <div className="relative size-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.durumDagilimi} dataKey="adet" nameKey="etiket" innerRadius={58} outerRadius={84} paddingAngle={2} stroke="var(--card)" strokeWidth={2} startAngle={90} endAngle={-270}>
                    {data.durumDagilimi.map((d) => <Cell key={d.anahtar} fill={DURUM_RENK[d.anahtar]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(value, name) => [`${value} fırsat`, String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-2xl font-bold tracking-tight">{data.toplamFirsat}</span>
                <span className="text-xs text-muted-foreground">Toplam</span>
              </div>
            </div>
            <ul className="w-full space-y-2.5 text-sm">
              {data.durumDagilimi.map((d) => (
                <li key={d.anahtar} className="flex items-center gap-2.5">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: DURUM_RENK[d.anahtar] }} />
                  <span className="flex-1 truncate text-muted-foreground">{d.etiket}</span>
                  <span className="font-medium tabular-nums">{d.adet}</span>
                  <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">%{d.yuzde}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
