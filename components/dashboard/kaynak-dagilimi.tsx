"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useKaynakDagilimi } from "@/lib/queries/enerji";
import { useDonem } from "@/components/providers/donem-provider";
import { sayi } from "@/lib/format";

const RENKLER = ["var(--chart-1)", "var(--chart-2)", "var(--chart-4)"];

export function KaynakDagilimi() {
  const { donem } = useDonem();
  const { data, isLoading } = useKaynakDagilimi(donem);
  const toplam = data?.reduce((t, d) => t + d.deger, 0) ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Üretim Kaynakları</CardTitle>
        <CardDescription>Enerjinin geldiği kaynak kırılımı (kWh)</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[240px] w-full" />
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="h-[200px] w-full max-w-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="deger"
                    nameKey="etiket"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {data?.map((_, i) => (
                      <Cell key={i} fill={RENKLER[i % RENKLER.length]} />
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
                    formatter={(value, name) => [`${sayi(Number(value))} kWh`, String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="w-full space-y-2 text-sm">
              {data?.map((d, i) => {
                const yuzde = toplam ? Math.round((d.deger / toplam) * 100) : 0;
                return (
                  <li key={d.kaynak} className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: RENKLER[i % RENKLER.length] }}
                      aria-hidden
                    />
                    <span className="flex-1">{d.etiket}</span>
                    <span className="font-medium">{sayi(d.deger)}</span>
                    <span className="w-10 text-right text-muted-foreground">%{yuzde}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
