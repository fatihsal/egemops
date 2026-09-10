"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTepAnaliz } from "@/lib/queries/tep";
import { useDil } from "@/components/providers/dil-provider";
import { sayi, sayiOndalik } from "@/lib/format";
import type { TepKaynakDilim } from "@/lib/types";

const RENK: Record<TepKaynakDilim["anahtar"], string> = {
  elektrik: "#2563eb",
  dogalgaz: "#8b5cf6",
  akaryakit: "#f59e0b",
};

export function TepKaynakDagilimi() {
  const { data, isLoading } = useTepAnaliz();
  const { t } = useDil();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">
          {t("Enerji Kaynak Dağılımı")} <span className="text-sm font-normal text-muted-foreground">(TEP)</span>
        </h3>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading || !data ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-5">
            <div className="relative size-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.kaynaklar}
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
                    {data.kaynaklar.map((k) => (
                      <Cell key={k.anahtar} fill={RENK[k.anahtar]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(value, name) => [`%${sayiOndalik(Number(value))}`, String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-2xl font-bold tracking-tight">{sayiOndalik(data.toplamTep)}</span>
                <span className="text-xs text-muted-foreground">TEP</span>
              </div>
            </div>

            <ul className="w-full space-y-3 text-sm">
              {data.kaynaklar.map((k) => (
                <li key={k.anahtar} className="flex items-center gap-2.5">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: RENK[k.anahtar] }} aria-hidden />
                  <span className="flex-1 text-muted-foreground">{t(k.etiket)}</span>
                  <span className="font-medium tabular-nums">{sayiOndalik(k.tep)} TEP</span>
                  <span className="w-12 text-right font-semibold tabular-nums">%{sayiOndalik(k.yuzde)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
