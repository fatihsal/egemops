"use client";

import { Leaf, TrendingDown } from "lucide-react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useKarbonOzet } from "@/lib/queries/enerji";
import { useDonem } from "@/components/providers/donem-provider";
import { donemEtiket } from "@/lib/donem";
import { sayi } from "@/lib/format";

export function KarbonOzet() {
  const { donem } = useDonem();
  const { data, isLoading } = useKarbonOzet(donem);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Karbon & Sürdürülebilirlik</CardTitle>
        <CardDescription>{donemEtiket(donem)} · salım ve yenilenebilir oranı</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {/* Yenilenebilir oranı — radyal gösterge */}
            <div className="relative h-[160px] w-[160px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="72%"
                  outerRadius="100%"
                  data={[{ ad: "yenilenebilir", deger: data?.yenilenebilirOran ?? 0 }]}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <RadialBar
                    dataKey="deger"
                    cornerRadius={12}
                    fill="var(--chart-1)"
                    background={{ fill: "var(--muted)" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold">
                  %{data?.yenilenebilirOran ?? 0}
                </span>
                <span className="text-xs text-muted-foreground">yenilenebilir</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Leaf className="size-4.5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">CO₂ Salımı</div>
                  <div className="font-semibold">
                    {sayi(data?.co2Kg ?? 0)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">kg</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <TrendingDown className="size-4.5" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tasarruf</div>
                  <div className="font-semibold">
                    {sayi(data?.tasarrufKg ?? 0)}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      kg CO₂
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
