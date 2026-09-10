"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBelgeAnaliz } from "@/lib/queries/belgeler";
import { useDil } from "@/components/providers/dil-provider";
import { sayiOndalik } from "@/lib/format";

export function BelgeDepolama() {
  const { data, isLoading } = useBelgeAnaliz();
  const { t } = useDil();
  const d = data?.depolama;

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Depolama Kullanımı")}</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        {isLoading || !d ? (
          <Skeleton className="h-[240px] w-full" />
        ) : (
          <>
            <div className="flex flex-1 items-center gap-6">
              <div className="relative size-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={d.kalemler} dataKey="gb" nameKey="etiket" innerRadius={42} outerRadius={62} paddingAngle={2} stroke="var(--card)" strokeWidth={2} startAngle={90} endAngle={-270}>
                      {d.kalemler.map((k) => <Cell key={k.anahtar} fill={k.renk} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                      formatter={(v, n) => [`${sayiOndalik(Number(v))} GB`, t(String(n))]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading text-lg font-bold tracking-tight tabular-nums">{sayiOndalik(d.kullanilan)}</span>
                  <span className="text-[11px] text-muted-foreground">/ {d.toplam} GB</span>
                </div>
              </div>
              <ul className="flex-1 space-y-2 text-sm">
                {d.kalemler.map((k) => (
                  <li key={k.anahtar} className="flex items-center gap-2.5">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: k.renk }} />
                    <span className="flex-1 truncate text-muted-foreground">{t(k.etiket)}</span>
                    <span className="font-medium tabular-nums">{sayiOndalik(k.gb)} GB</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t("Toplam Kullanım")}</span>
                <span className="font-semibold tabular-nums">{sayiOndalik(d.kullanilan)} / {d.toplam} GB · %{d.yuzde}</span>
              </div>
              <span className="block h-2 w-full overflow-hidden rounded-full bg-muted">
                <span className="block h-full rounded-full bg-teal-500" style={{ width: `${d.yuzde}%` }} />
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
