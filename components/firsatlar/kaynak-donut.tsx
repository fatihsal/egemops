"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KAYNAK_RENK } from "@/components/firsatlar/stiller";
import { useFirsatAnaliz } from "@/lib/queries/firsatlar";
import { sayiOndalik } from "@/lib/format";

export function FirsatKaynakDonut() {
  const { data, isLoading } = useFirsatAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Kaynak Bazlı Tasarruf Dağılımı</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-5">
        {isLoading || !data ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <>
            <div className="relative size-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.kaynakTasarruf} dataKey="tep" nameKey="etiket" innerRadius={58} outerRadius={84} paddingAngle={2} stroke="var(--card)" strokeWidth={2} startAngle={90} endAngle={-270}>
                    {data.kaynakTasarruf.map((k) => <Cell key={k.anahtar} fill={KAYNAK_RENK[k.anahtar]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(value, name) => [`${sayiOndalik(Number(value))} TEP`, String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-xl font-bold tracking-tight">{sayiOndalik(data.toplamTasarruf)}</span>
                <span className="text-xs text-muted-foreground">TEP / yıl</span>
              </div>
            </div>
            <ul className="w-full space-y-3 text-sm">
              {data.kaynakTasarruf.map((k) => (
                <li key={k.anahtar} className="flex items-center gap-2.5">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: KAYNAK_RENK[k.anahtar] }} />
                  <span className="flex-1 truncate text-muted-foreground">{k.etiket}</span>
                  <span className="font-medium tabular-nums">{sayiOndalik(k.tep)} TEP</span>
                  <span className="w-14 text-right font-semibold tabular-nums">%{sayiOndalik(k.yuzde)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
