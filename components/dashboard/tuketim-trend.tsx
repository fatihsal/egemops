"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTuketimSerisi } from "@/lib/queries/enerji";
import { useDonem } from "@/components/providers/donem-provider";
import { donemEtiket } from "@/lib/donem";
import { sayi } from "@/lib/format";
import { cn } from "@/lib/utils";

const SERILER = [
  { anahtar: "tuketim", etiket: "Tüketim", renk: "var(--chart-2)" },
  { anahtar: "uretim", etiket: "Öz Üretim", renk: "var(--chart-1)" },
] as const;

type SeriAnahtar = (typeof SERILER)[number]["anahtar"];

export function TuketimTrend() {
  const { donem } = useDonem();
  const { data, isLoading } = useTuketimSerisi(donem);

  // Tıklanarak gizlenen seriler.
  const [gizli, setGizli] = React.useState<Set<SeriAnahtar>>(new Set());

  function seriyeBas(anahtar: SeriAnahtar) {
    setGizli((onceki) => {
      const yeni = new Set(onceki);
      if (yeni.has(anahtar)) yeni.delete(anahtar);
      else yeni.add(anahtar);
      return yeni;
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <CardTitle>Elektrik Tüketim & Üretim</CardTitle>
            <CardDescription>{donemEtiket(donem)} · kWh</CardDescription>
          </div>
          {/* Tıklanabilir seri göster/gizle */}
          <div className="flex items-center gap-1.5">
            {SERILER.map((s) => {
              const kapali = gizli.has(s.anahtar);
              return (
                <button
                  key={s.anahtar}
                  type="button"
                  onClick={() => seriyeBas(s.anahtar)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors",
                    kapali
                      ? "text-muted-foreground opacity-60"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ background: kapali ? "var(--muted-foreground)" : s.renk }}
                    aria-hidden
                  />
                  {s.etiket}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: -8, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  {SERILER.map((s) => (
                    <linearGradient key={s.anahtar} id={`dolgu-${s.anahtar}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={s.renk} stopOpacity={0.5} />
                      <stop offset="95%" stopColor={s.renk} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="etiket"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  minTickGap={24}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={44}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v: number) => sayi(v)}
                />
                <Tooltip
                  cursor={{ stroke: "var(--border)" }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                    color: "var(--popover-foreground)",
                  }}
                  formatter={(value, name) => {
                    const seri = SERILER.find((s) => s.anahtar === name);
                    return [`${sayi(Number(value))} kWh`, seri?.etiket ?? String(name)];
                  }}
                />
                {SERILER.filter((s) => !gizli.has(s.anahtar)).map((s) => (
                  <Area
                    key={s.anahtar}
                    type="monotone"
                    dataKey={s.anahtar}
                    stroke={s.renk}
                    strokeWidth={2}
                    fill={`url(#dolgu-${s.anahtar})`}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
