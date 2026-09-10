"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTepAnaliz } from "@/lib/queries/tep";
import { useDil } from "@/components/providers/dil-provider";
import { sayi2 } from "@/lib/format";

const RENK = "#14b8a6";

export function TepYogunlukGrafik() {
  const { data, isLoading } = useTepAnaliz();
  const { t } = useDil();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">
          {t("Enerji Yoğunluğu")} <span className="text-sm font-normal text-muted-foreground">(TEP / ton)</span>
        </h3>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading ? (
          <Skeleton className="h-[220px] w-full" />
        ) : (
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.yogunlukSeri} margin={{ left: 4, right: 8, top: 12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={40}
                  domain={["dataMin - 0.02", "dataMax + 0.02"]}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v: number) => sayi2(v)}
                />
                <Tooltip
                  cursor={{ stroke: "var(--border)" }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  formatter={(value) => [`${sayi2(Number(value))} TEP/ton`, t("Yoğunluk")]}
                />
                <Line type="monotone" dataKey="deger" stroke={RENK} strokeWidth={2.5} dot={{ r: 3, fill: RENK }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
