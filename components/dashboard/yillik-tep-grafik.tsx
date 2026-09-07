"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useYillikTep } from "@/lib/queries/enerji";
import { BUGUN } from "@/lib/donem";
import { sayi } from "@/lib/format";
import { cn } from "@/lib/utils";

const BU_YIL = BUGUN.getFullYear();
const YILLAR = {
  onceki2: BU_YIL - 2,
  onceki1: BU_YIL - 1,
  buYil: BU_YIL,
};

// Yıla göre çizgi rengi ve kalınlığı (görseldeki gibi: gri / mavi / yeşil,
// içinde bulunulan yıl vurgulu).
const SERI = [
  { anahtar: "onceki2", yil: YILLAR.onceki2, renk: "#94a3b8", kalinlik: 2 },
  { anahtar: "onceki1", yil: YILLAR.onceki1, renk: "#3b82f6", kalinlik: 2 },
  { anahtar: "buYil", yil: YILLAR.buYil, renk: "#22c55e", kalinlik: 3 },
] as const;

export function YillikTepGrafik() {
  const { data, isLoading } = useYillikTep();

  // Sağ üst kutu: 2025 vs 2026 — yalnızca karşılaştırılabilir aylar (buYil dolu).
  let degisim: number | null = null;
  if (data) {
    const dolu = data.filter((d) => d.buYil !== null);
    const t2025 = dolu.reduce((t, d) => t + d.onceki1, 0);
    const t2026 = dolu.reduce((t, d) => t + (d.buYil ?? 0), 0);
    if (t2025 > 0) degisim = ((t2026 - t2025) / t2025) * 100;
  }
  // Tüketimde düşüş iyidir → yeşil.
  const iyi = (degisim ?? 0) <= 0;
  const Ok = (degisim ?? 0) >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <CardTitle>Aylık Toplam Enerji Tüketimi (TEP)</CardTitle>

          {/* Sağ üst: son iki yılın değişimi */}
          {degisim !== null ? (
            <div className="rounded-lg border px-3 py-1.5 text-right">
              <div className="text-[11px] text-muted-foreground">
                {YILLAR.buYil} vs {YILLAR.onceki1}
              </div>
              <div
                className={cn(
                  "flex items-center justify-end gap-0.5 text-sm font-semibold",
                  iyi
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                <Ok className="size-3.5" />
                {Math.abs(degisim).toFixed(1)}%
              </div>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[360px] w-full" />
        ) : (
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: -8, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="ay"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={44}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v: number) => sayi(v)}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                    color: "var(--popover-foreground)",
                  }}
                  formatter={(value, name) => {
                    const s = SERI.find((x) => x.anahtar === name);
                    return [`${sayi(Number(value))} TEP`, String(s?.yil ?? name)];
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="left"
                  height={28}
                  formatter={(value) => {
                    const s = SERI.find((x) => x.anahtar === value);
                    return String(s?.yil ?? value);
                  }}
                  iconType="plainline"
                  wrapperStyle={{ fontSize: "12px" }}
                />
                {SERI.map((s) => (
                  <Line
                    key={s.anahtar}
                    type="monotone"
                    dataKey={s.anahtar}
                    stroke={s.renk}
                    strokeWidth={s.kalinlik}
                    dot={false}
                    activeDot={{ r: 4 }}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
