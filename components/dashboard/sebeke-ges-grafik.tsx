"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSebekeGes } from "@/lib/queries/enerji";
import { sayi } from "@/lib/format";

const RENK = { sebeke: "#3b82f6", ges: "#22c55e" };
const ETIKET: Record<string, string> = { sebeke: "Şebeke", ges: "GES" };

export function SebekeGesGrafik() {
  const { data, isLoading } = useSebekeGes();

  const toplamSebeke = data?.reduce((t, d) => t + d.sebeke, 0) ?? 0;
  const toplamGes = data?.reduce((t, d) => t + d.ges, 0) ?? 0;
  const toplam = toplamSebeke + toplamGes;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>
            Şebeke / GES / Toplam Elektrik{" "}
            <span className="text-sm font-normal text-muted-foreground">
              (kWh)
            </span>
          </CardTitle>
          {!isLoading ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: RENK.sebeke }} />
                Şebeke <span className="font-semibold">{sayi(toplamSebeke)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ background: RENK.ges }} />
                GES <span className="font-semibold">{sayi(toplamGes)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                Toplam <span className="font-semibold text-foreground">{sayi(toplam)}</span>
              </span>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[360px] w-full" />
        ) : (
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ left: 12, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="ay"
                  tickFormatter={(v: string) => v.charAt(0)}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={64}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v: number) => sayi(v)}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                    color: "var(--popover-foreground)",
                  }}
                  formatter={(value, name) => [
                    `${sayi(Number(value))} kWh`,
                    ETIKET[String(name)] ?? String(name),
                  ]}
                />
                <Bar dataKey="sebeke" stackId="e" fill={RENK.sebeke} />
                <Bar dataKey="ges" stackId="e" fill={RENK.ges} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
