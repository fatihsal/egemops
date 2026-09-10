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
import { useDogalgazAnaliz } from "@/lib/queries/dogalgaz";
import { useDil } from "@/components/providers/dil-provider";
import { sayiOndalik } from "@/lib/format";

const RENK = "#7c3aed";

export function DogalgazYogunlukGrafik() {
  const { data, isLoading } = useDogalgazAnaliz();
  const { t } = useDil();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <h3 className="font-heading text-base font-medium">{t("Doğalgaz Yoğunluğu")}</h3>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-[3px] w-3.5 rounded-full" style={{ background: RENK }} /> 2026
            </span>
          </div>
          <span className="text-sm font-normal text-muted-foreground">Sm³/ton</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.yogunlukSeri} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} domain={[0, "dataMax + 6"]} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayiOndalik(v)} />
                <Tooltip
                  cursor={{ stroke: "var(--border)" }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  formatter={(value) => [value === null ? "—" : `${sayiOndalik(Number(value))} Sm³/ton`, t("Yoğunluk")]}
                />
                <Line type="monotone" dataKey="gercek" stroke={RENK} strokeWidth={2.5} dot={{ r: 3, fill: RENK }} activeDot={{ r: 5 }} connectNulls={false} />
                <Line type="monotone" dataKey="tahmin" stroke={RENK} strokeWidth={2} strokeDasharray="5 4" strokeOpacity={0.6} dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
