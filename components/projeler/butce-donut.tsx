"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjeAnaliz } from "@/lib/queries/projeler";
import { useDil } from "@/components/providers/dil-provider";
import { sayi2 } from "@/lib/format";

const mTL = (n: number) => `${sayi2(n)} M TL`;

export function ProjeButceDonut() {
  const { data, isLoading } = useProjeAnaliz();
  const { t } = useDil();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Proje Bütçe Durumu")}</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-5">
        {isLoading || !data ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <>
            <div className="relative size-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.butce.dilimler} dataKey="deger" nameKey="etiket" innerRadius={54} outerRadius={78} paddingAngle={2} stroke="var(--card)" strokeWidth={2} startAngle={90} endAngle={-270}>
                    {data.butce.dilimler.map((d) => <Cell key={d.etiket} fill={d.renk} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(value, name) => [mTL(Number(value)), t(String(name))]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-xl font-bold tracking-tight tabular-nums">{sayi2(data.butce.toplam)}</span>
                <span className="text-xs text-muted-foreground">{t("M TL Toplam")}</span>
              </div>
            </div>

            <ul className="w-full space-y-2.5 text-sm">
              {data.butce.kalemler.map((k) => (
                <li key={k.etiket} className="flex items-center gap-2.5">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: k.renk }} />
                  <span className="flex-1 truncate text-muted-foreground">{t(k.etiket)}</span>
                  <span className="font-medium tabular-nums">{mTL(k.deger)}</span>
                </li>
              ))}
            </ul>

            <div className="w-full space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t("Bütçe Kullanımı")}</span>
                <span className="font-semibold tabular-nums">%{data.butce.kullanimYuzde}</span>
              </div>
              <span className="block h-2 w-full overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full bg-teal-500" style={{ width: `${data.butce.kullanimYuzde}%` }} />
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
