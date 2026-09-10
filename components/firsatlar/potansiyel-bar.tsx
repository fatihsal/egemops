"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KAYNAK_RENK } from "@/components/firsatlar/stiller";
import { useFirsatAnaliz } from "@/lib/queries/firsatlar";
import { useDil } from "@/components/providers/dil-provider";
import { sayiOndalik } from "@/lib/format";

export function FirsatPotansiyelBar() {
  const { data, isLoading } = useFirsatAnaliz();
  const { t } = useDil();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">
          {t("Yıllık Potansiyel Tasarruf")} <span className="text-sm font-normal text-muted-foreground">(TEP)</span>
        </h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {isLoading || !data ? (
          <Skeleton className="min-h-[260px] w-full flex-1" />
        ) : (
          <div className="min-h-[260px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.kaynakTasarruf} margin={{ left: 4, right: 8, top: 28, bottom: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="etiket" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v: string) => t(v)} label={{ value: t("Enerji Kaynağı"), position: "insideBottom", offset: -12, fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={36} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayiOndalik(v)} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  formatter={(value) => [`${sayiOndalik(Number(value))} TEP/yıl`, t("Potansiyel Tasarruf")]}
                />
                <Bar dataKey="tep" radius={[4, 4, 0, 0]} maxBarSize={70} isAnimationActive={false}>
                  {data.kaynakTasarruf.map((k) => <Cell key={k.anahtar} fill={KAYNAK_RENK[k.anahtar]} />)}
                  <LabelList
                    dataKey="tep"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={(p: any) => {
                      const cx = Number(p.x ?? 0) + Number(p.width ?? 0) / 2;
                      return <text x={cx} y={Number(p.y ?? 0) - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">{sayiOndalik(Number(p.value ?? 0))}</text>;
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
