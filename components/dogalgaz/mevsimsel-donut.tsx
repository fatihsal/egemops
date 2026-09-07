"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDogalgazAnaliz } from "@/lib/queries/dogalgaz";
import { sayi } from "@/lib/format";
import type { DogalgazMevsim } from "@/lib/types";

const RENK: Record<DogalgazMevsim["anahtar"], string> = {
  kis: "#2563eb",
  ilkbahar: "#16a34a",
  yaz: "#f59e0b",
  sonbahar: "#7c3aed",
};

export function DogalgazMevsimselDonut() {
  const { data, isLoading } = useDogalgazAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Mevsimsel Dağılım</h3>
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
                    data={data.mevsimsel}
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
                    {data.mevsimsel.map((m) => (
                      <Cell key={m.anahtar} fill={RENK[m.anahtar]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(value, name) => [`%${sayi(Number(value))}`, String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-xl font-bold tracking-tight">{sayi(data.toplamSm3)}</span>
                <span className="text-xs text-muted-foreground">Sm³</span>
              </div>
            </div>

            <ul className="w-full space-y-2.5 text-sm">
              {data.mevsimsel.map((m) => (
                <li key={m.anahtar} className="flex items-center gap-2.5">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: RENK[m.anahtar] }} aria-hidden />
                  <span className="flex-1">{m.etiket}</span>
                  <span className="font-semibold tabular-nums">%{m.yuzde}</span>
                  <span className="w-24 text-right text-xs tabular-nums text-muted-foreground">{sayi(m.sm3)} Sm³</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
