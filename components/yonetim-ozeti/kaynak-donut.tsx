"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useYonetimOzeti } from "@/lib/queries/yonetim-ozeti";
import { sayi, sayiOndalik } from "@/lib/format";
import type { OzetDonut } from "@/lib/types";

export function OzetKaynakDonut({ baslik, tur }: { baslik: string; tur: "tep" | "maliyet" }) {
  const { data, isLoading } = useYonetimOzeti();
  const veri: OzetDonut | undefined = data ? (tur === "tep" ? data.kaynakTep : data.maliyetDagilim) : undefined;
  const bicim = (n: number) => (tur === "tep" ? sayi(n) : sayiOndalik(n));

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{baslik}</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-5 sm:flex-row sm:gap-6">
        {isLoading || !veri ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <>
            <div className="relative size-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={veri.dilimler} dataKey="deger" nameKey="etiket" innerRadius={48} outerRadius={70} paddingAngle={2} stroke="var(--card)" strokeWidth={2} startAngle={90} endAngle={-270}>
                    {veri.dilimler.map((d) => <Cell key={d.anahtar} fill={d.renk} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(v, n) => [`${bicim(Number(v))} ${veri.birim}`, String(n)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-lg font-bold tracking-tight tabular-nums">{veri.merkez}</span>
                <span className="text-[11px] text-muted-foreground">{veri.birim}</span>
              </div>
            </div>
            <ul className="w-full flex-1 space-y-3 text-sm">
              {veri.dilimler.map((d) => (
                <li key={d.anahtar} className="flex items-center gap-2.5">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: d.renk }} />
                  <span className="flex-1 truncate text-muted-foreground">{d.etiket}</span>
                  <span className="font-medium tabular-nums">{bicim(d.deger)}</span>
                  <span className="w-14 text-right text-xs tabular-nums text-muted-foreground">%{sayiOndalik(d.yuzde)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
