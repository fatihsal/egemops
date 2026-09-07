"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAkaryakitAnaliz } from "@/lib/queries/akaryakit";
import { sayi } from "@/lib/format";
import type { AkaryakitTurDilim } from "@/lib/types";

const RENK: Record<AkaryakitTurDilim["anahtar"], string> = {
  motorin: "#475569",
  benzin: "#16a34a",
  diger: "#f59e0b",
};

export function AkaryakitTurDagilimiDonut() {
  const { data, isLoading } = useAkaryakitAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Yakıt Türü Dağılımı</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-6">
        {isLoading || !data ? (
          <Skeleton className="h-[240px] w-full" />
        ) : (
          <>
            <div className="relative size-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.turDagilimi}
                    dataKey="yuzde"
                    nameKey="etiket"
                    innerRadius={56}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="var(--card)"
                    strokeWidth={2}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {data.turDagilimi.map((t) => (
                      <Cell key={t.anahtar} fill={RENK[t.anahtar]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(value, name) => [`%${sayi(Number(value))}`, String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-xl font-bold tracking-tight">{sayi(data.toplamLitre)}</span>
                <span className="text-xs text-muted-foreground">Litre</span>
              </div>
            </div>

            <ul className="w-full space-y-2.5 text-sm">
              {data.turDagilimi.map((t) => (
                <li key={t.anahtar} className="flex items-center gap-2.5">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: RENK[t.anahtar] }} aria-hidden />
                  <span className="flex-1">{t.etiket}</span>
                  <span className="font-semibold tabular-nums">%{t.yuzde}</span>
                  <span className="w-24 text-right text-xs tabular-nums text-muted-foreground">{sayi(t.litre)} Litre</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
