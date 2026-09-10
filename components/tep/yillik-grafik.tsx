"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTepAnaliz } from "@/lib/queries/tep";
import { useDil } from "@/components/providers/dil-provider";
import { sayiOndalik } from "@/lib/format";
import type { TepYilBar } from "@/lib/types";

const RENK = "#14b8a6";

// Yıl + altında YoY değişim gösteren özel eksen etiketi.
function YilTick(props: { x?: number | string; y?: number | string; payload?: { value: number }; veri: TepYilBar[] }) {
  const { x = 0, y = 0, payload, veri } = props;
  const bar = veri.find((b) => b.yil === payload?.value);
  const yoy = bar?.yoy;
  const arti = (yoy ?? 0) >= 0;
  return (
    <g transform={`translate(${Number(x)},${Number(y)})`}>
      <text x={0} y={0} dy={14} textAnchor="middle" fontSize={12} fill="var(--foreground)" fontWeight={500}>
        {payload?.value}
      </text>
      {yoy == null ? (
        <text x={0} y={0} dy={30} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">–</text>
      ) : (
        <text x={0} y={0} dy={30} textAnchor="middle" fontSize={11} fontWeight={600} fill={arti ? "#059669" : "#dc2626"}>
          {arti ? "▲" : "▼"} %{sayiOndalik(Math.abs(yoy))}
        </text>
      )}
    </g>
  );
}

export function TepYillikGrafik() {
  const { data, isLoading } = useTepAnaliz();
  const { t } = useDil();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-base font-medium">{t("Yıllık Enerji Tüketimi")}</h3>
          <span className="text-sm font-normal text-muted-foreground">(TEP)</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[240px] w-full" />
        ) : (
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.yillik} margin={{ left: 4, right: 8, top: 28, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="yil"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  height={44}
                  tick={(p) => <YilTick {...p} veri={data.yillik} />}
                />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={44} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayiOndalik(v)} />
                <Bar dataKey="tep" fill={RENK} radius={[4, 4, 0, 0]} maxBarSize={60} isAnimationActive={false}>
                  <LabelList
                    dataKey="tep"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={(p: any) => {
                      const cx = Number(p.x ?? 0) + Number(p.width ?? 0) / 2;
                      return (
                        <text x={cx} y={Number(p.y ?? 0) - 8} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--foreground)">
                          {sayiOndalik(Number(p.value ?? 0))}
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
