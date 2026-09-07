"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerformansAnaliz } from "@/lib/queries/performans";
import { sayi } from "@/lib/format";
import type { PerformansWaterfall } from "@/lib/types";

// Adım renkleri (kaynak bazlı): beklenen · elektrik · doğalgaz · akaryakıt · gerçekleşen.
const RENKLER = ["#2563eb", "#06b6d4", "#8b5cf6", "#f59e0b", "#0d9488"];

interface Adim {
  etiket: string;
  base: number;
  gorunen: number;
  renk: string;
  etiketDeger: string;
}

function adimlariUret(veri: PerformansWaterfall[]): Adim[] {
  let running = 0;
  return veri.map((w, i) => {
    const renk = RENKLER[i % RENKLER.length];
    if (w.tur === "baz" || w.tur === "sonuc") {
      if (w.tur === "baz") running = w.deger;
      return { etiket: w.etiket, base: 0, gorunen: w.deger, renk, etiketDeger: sayi(w.deger) };
    }
    const before = running;
    const after = running + w.deger;
    running = after;
    return { etiket: w.etiket, base: Math.min(before, after), gorunen: Math.abs(w.deger), renk, etiketDeger: `${w.deger >= 0 ? "+" : "−"}${sayi(Math.abs(w.deger))}` };
  });
}

export function PerformansSapmaWaterfall() {
  const { data, isLoading } = usePerformansAnaliz();
  const adimlar = data ? adimlariUret(data.waterfall) : [];

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Performans Sapması <span className="text-sm font-normal text-muted-foreground">(TEP)</span></h3>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading || !data ? (
          <Skeleton className="h-[260px] w-full" />
        ) : (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adimlar} margin={{ left: 0, right: 8, top: 28, bottom: 0 }}>
                <XAxis dataKey="etiket" tickLine={false} axisLine={false} fontSize={11} interval={0} stroke="var(--muted-foreground)" />
                <YAxis hide domain={[0, "dataMax + 60"]} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  formatter={(_v, name, item) => name === "base" ? ["", ""] : [`${item?.payload?.etiketDeger} TEP`, item?.payload?.etiket]}
                />
                <Bar dataKey="base" stackId="w" fill="transparent" isAnimationActive={false} />
                <Bar dataKey="gorunen" stackId="w" radius={[3, 3, 0, 0]} maxBarSize={54} isAnimationActive={false}>
                  {adimlar.map((a, i) => <Cell key={i} fill={a.renk} />)}
                  <LabelList
                    dataKey="gorunen"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={(p: any) => {
                      const cx = Number(p.x ?? 0) + Number(p.width ?? 0) / 2;
                      return (
                        <text x={cx} y={Number(p.y ?? 0) - 8} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
                          {adimlar[p.index ?? 0]?.etiketDeger}
                        </text>
                      );
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
