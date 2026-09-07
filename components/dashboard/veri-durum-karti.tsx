"use client";

import { Icon } from "@iconify/react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useVeriDurum } from "@/lib/queries/enerji";

const IKON: Record<string, string> = {
  Elektrik: "solar:bolt-bold-duotone",
  GES: "solar:sun-2-bold-duotone",
  Doğalgaz: "solar:fire-bold-duotone",
  Akaryakıt: "solar:gas-station-bold-duotone",
  Üretim: "solar:buildings-2-bold-duotone",
};

export function VeriDurumKarti() {
  const { data, isLoading } = useVeriDurum();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Veri Durumu</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <ul className="w-full space-y-2 text-sm">
              {data?.kaynaklar.map((k) => {
                const ikon = IKON[k.etiket] ?? "solar:bolt-bold-duotone";
                const tam = k.mevcut >= k.toplam;
                return (
                  <li key={k.etiket} className="flex items-center gap-2">
                    <Icon icon={ikon} className="size-4.5 text-muted-foreground" />
                    <span className="flex-1">{k.etiket}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {k.mevcut} / {k.toplam}
                    </span>
                    {tam ? (
                      <Icon
                        icon="solar:check-circle-bold-duotone"
                        className="size-4.5 text-emerald-500"
                      />
                    ) : (
                      <Icon
                        icon="solar:danger-triangle-bold-duotone"
                        className="size-4.5 text-amber-500"
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="relative h-[130px] w-[130px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="72%"
                  outerRadius="100%"
                  data={[{ ad: "tamlik", deger: data?.tamlikOrani ?? 0 }]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                  <RadialBar
                    dataKey="deger"
                    cornerRadius={12}
                    fill="#22c55e"
                    background={{ fill: "var(--muted)" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
                <span className="text-2xl font-bold">%{data?.tamlikOrani}</span>
                <span className="text-[10px] text-muted-foreground">
                  {data?.tamamlananAy}/{data?.toplamAy} Ay
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
