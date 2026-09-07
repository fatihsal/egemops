"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useElektrikGesAnaliz } from "@/lib/queries/elektrik-ges";
import { sayi, sayi2 } from "@/lib/format";
import type { ElektrikKaynakDilim } from "@/lib/types";

const RENK: Record<ElektrikKaynakDilim["anahtar"], string> = {
  sebeke: "#2563eb",
  gesOz: "#16a34a",
  verilen: "#86efac",
};

export function ElektrikKaynakDagilimi() {
  const { data, isLoading } = useElektrikGesAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Elektrik Kaynak Dağılımı</h3>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading || !data ? (
          <Skeleton className="h-[320px] w-full" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-6">
            <div className="relative size-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.kaynaklar}
                    dataKey="yuzde"
                    nameKey="etiket"
                    innerRadius={58}
                    outerRadius={86}
                    paddingAngle={2}
                    stroke="var(--card)"
                    strokeWidth={2}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {data.kaynaklar.map((k) => (
                      <Cell key={k.anahtar} fill={RENK[k.anahtar]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                      color: "var(--popover-foreground)",
                    }}
                    formatter={(value, name) => [`%${sayi(Number(value))}`, String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-2xl font-bold tracking-tight">
                  {sayi2(data.toplamElektrikGwh)}
                </span>
                <span className="text-xs text-muted-foreground">GWh toplam</span>
              </div>
            </div>

            <ul className="w-full space-y-3 text-sm">
              {data.kaynaklar.map((k) => (
                <li key={k.anahtar} className="flex items-center gap-2.5">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ background: RENK[k.anahtar] }}
                    aria-hidden
                  />
                  <span className="flex-1 text-muted-foreground">{k.etiket}</span>
                  <span className="font-medium tabular-nums">{sayi2(k.gwh)} GWh</span>
                  <span className="w-12 text-right font-semibold tabular-nums">%{k.yuzde}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
