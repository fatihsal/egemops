"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAkaryakitAnaliz } from "@/lib/queries/akaryakit";
import { useDil } from "@/components/providers/dil-provider";
import { sayi, sayiKisa } from "@/lib/format";

const SERI = [
  { anahtar: "arac", etiket: "Araçlar", renk: "#2563eb" },
  { anahtar: "jenerator", etiket: "Jeneratörler", renk: "#f59e0b" },
] as const;

export function AkaryakitKullanimGrafik() {
  const { data, isLoading } = useAkaryakitAnaliz();
  const { t } = useDil();

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2">
            <h3 className="font-heading text-base font-medium">{t("Araç & Jeneratör Bazında Tüketim")}</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              {SERI.map((s) => (
                <span key={s.anahtar} className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: s.renk }} />
                  {t(s.etiket)}
                </span>
              ))}
            </div>
          </div>
          <span className="text-sm font-normal text-muted-foreground">Litre</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.kullanimSeri} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v: string) => t(v)} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayiKisa(v)} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  labelFormatter={(l) => t(String(l))}
                  formatter={(value, name) => {
                    const s = SERI.find((x) => x.anahtar === name);
                    return [`${sayi(Number(value))} Litre`, t(s?.etiket ?? String(name))];
                  }}
                />
                {SERI.map((s) => (
                  <Bar key={s.anahtar} dataKey={s.anahtar} stackId="kullanim" fill={s.renk} radius={s.anahtar === "jenerator" ? [4, 4, 0, 0] : [0, 0, 0, 0]} maxBarSize={40} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
