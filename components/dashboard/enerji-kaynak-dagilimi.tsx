"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnerjiKaynakDagilimi } from "@/lib/queries/enerji";
import { sayi, sayi2, sayiOndalik } from "@/lib/format";
import type { KaynakTuru } from "@/lib/types";

const RENK: Record<KaynakTuru, string> = {
  elektrik: "#3b82f6",
  dogalgaz: "#8b5cf6",
  akaryakit: "#f97316",
};

export function EnerjiKaynakDagilimi() {
  const { data, isLoading } = useEnerjiKaynakDagilimi();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enerji Kaynaklarının Dağılımı</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[240px] w-full" />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="size-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data?.kaynaklar}
                      dataKey="yuzde"
                      nameKey="etiket"
                      innerRadius={42}
                      outerRadius={66}
                      paddingAngle={2}
                      stroke="var(--card)"
                      strokeWidth={2}
                    >
                      {data?.kaynaklar.map((k) => (
                        <Cell key={k.tur} fill={RENK[k.tur]} />
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
                      formatter={(value, name) => [`%${sayi(Number(value))}`, String(name)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <ul className="w-full space-y-3 text-sm">
                {data?.kaynaklar.map((k) => (
                  <li key={k.tur} className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: RENK[k.tur] }}
                      aria-hidden
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{k.etiket}</span>
                        <span className="font-semibold">%{k.yuzde}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {sayi2(k.gwh)} GWh
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-3 text-sm">
              <span className="text-muted-foreground">Toplam Enerji: </span>
              <span className="font-semibold">
                {sayiOndalik(data?.toplamTep ?? 0)} TEP
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
