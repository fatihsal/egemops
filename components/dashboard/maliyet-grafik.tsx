"use client";

import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
import { useAylikMaliyet } from "@/lib/queries/enerji";
import { para } from "@/lib/format";

const ETIKET: Record<string, string> = {
  gunduz: "Gündüz",
  gece: "Gece",
  puant: "Puant",
};

function ayEtiket(ay: string) {
  return format(parseISO(`${ay}-01`), "MMM", { locale: tr });
}

export function MaliyetGrafik() {
  const { data, isLoading } = useAylikMaliyet();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aylık Enerji Maliyeti</CardTitle>
        <CardDescription>2026 · tarife dönemine göre, ₺ (yıl sürüyor)</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="ay"
                  tickFormatter={ayEtiket}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={60}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}B`}
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
                  labelFormatter={(label) => ayEtiket(String(label))}
                  formatter={(value, name) => [para(Number(value)), ETIKET[String(name)] ?? String(name)]}
                />
                <Legend
                  formatter={(value) => ETIKET[String(value)] ?? String(value)}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px" }}
                />
                <Bar dataKey="gunduz" stackId="m" fill="var(--chart-2)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="gece" stackId="m" fill="var(--chart-3)" />
                <Bar dataKey="puant" stackId="m" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
