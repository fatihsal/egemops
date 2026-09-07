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

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useElektrikGesAnaliz } from "@/lib/queries/elektrik-ges";
import { sayi, sayiKisa } from "@/lib/format";

const RENK = { gesOz: "#16a34a", verilen: "#86efac" };
const SERI = [
  { anahtar: "gesOz", etiket: "GES Öz Tüketimi", renk: RENK.gesOz },
  { anahtar: "sebekeyeVerilen", etiket: "Şebekeye Verilen", renk: RENK.verilen },
] as const;

export function GesUretimGrafik() {
  const { data, isLoading } = useElektrikGesAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="font-heading text-base font-medium">
            GES Üretim Dağılımı{" "}
            <span className="text-sm font-normal text-muted-foreground">(kWh)</span>
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            {SERI.map((s) => (
              <span key={s.anahtar} className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2 rounded-full" style={{ background: s.renk }} />
                {s.etiket}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[320px] w-full" />
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.aylik} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="kisa"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={48}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v: number) => sayiKisa(v)}
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
                  labelFormatter={(_, p) => p?.[0]?.payload?.donem ?? ""}
                  formatter={(value, name) => {
                    const seri = SERI.find((s) => s.anahtar === name);
                    return [`${sayi(Number(value))} kWh`, seri?.etiket ?? String(name)];
                  }}
                />
                <Bar dataKey="gesOz" stackId="g" fill={RENK.gesOz} maxBarSize={34} />
                <Bar dataKey="sebekeyeVerilen" stackId="g" fill={RENK.verilen} radius={[3, 3, 0, 0]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
