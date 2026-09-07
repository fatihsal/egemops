"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDogalgazAnaliz } from "@/lib/queries/dogalgaz";
import { sayi, sayiKisa } from "@/lib/format";

const RENK = ["#7c3aed", "#2563eb", "#06b6d4", "#16a34a"];

export function DogalgazYillikKarsilastirma() {
  const { data, isLoading } = useDogalgazAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-base font-medium">Yıllık Doğalgaz Karşılaştırması</h3>
          <span className="text-sm font-normal text-muted-foreground">Sm³</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="space-y-4">
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.yillik} margin={{ left: 4, right: 8, top: 24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="yil" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayiKisa(v)} />
                  <Bar dataKey="sm3" radius={[4, 4, 0, 0]} maxBarSize={64}>
                    {data.yillik.map((_, i) => (
                      <Cell key={i} fill={RENK[i % RENK.length]} />
                    ))}
                    <LabelList
                      dataKey="sm3"
                      position="top"
                      offset={8}
                      className="fill-foreground"
                      fontSize={12}
                      fontWeight={600}
                      formatter={(v) => sayi(Number(v))}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Lejant */}
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-4 text-sm">
              {data.yillik.map((y, i) => (
                <li key={y.yil} className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: RENK[i % RENK.length] }} />
                  <span className="font-medium">{y.yil}</span>
                  <span className="ml-auto tabular-nums text-muted-foreground">{sayi(y.sm3)} Sm³</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
