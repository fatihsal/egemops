"use client";

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Yön + yüzde değişim göstergesi (↑ yeşil, ↓ kırmızı, — nötr). */
export function Degisim({
  yuzde,
  etiket,
  className,
}: {
  yuzde: number;
  etiket?: string;
  className?: string;
}) {
  const sifir = Math.abs(yuzde) < 0.05;
  const arti = yuzde > 0;
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-0.5 text-xs font-semibold",
          sifir
            ? "text-muted-foreground"
            : arti
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400",
        )}
      >
        <span className="leading-none">{sifir ? "—" : arti ? "↑" : "↓"}</span>
        %{sayiOndalik(Math.abs(yuzde))}
      </span>
      {etiket ? (
        <span className="text-xs text-muted-foreground">{etiket}</span>
      ) : null}
    </span>
  );
}

/** Ortasında yüzde yazan dairesel gösterge. */
export function RadialOran({
  deger,
  renk = "#22c55e",
  className,
  yaziSinif = "text-base",
}: {
  deger: number;
  renk?: string;
  className?: string;
  yaziSinif?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="72%"
          outerRadius="100%"
          data={[{ ad: "oran", deger }]}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <RadialBar
            dataKey="deger"
            cornerRadius={12}
            fill={renk}
            background={{ fill: "var(--muted)" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("font-bold", yaziSinif)}>%{sayiOndalik(deger)}</span>
      </div>
    </div>
  );
}

/** Yarım daire gösterge (0 – max), altında değer. */
export function Gauge({
  deger,
  max = 1,
  renk = "#22c55e",
  className,
}: {
  deger: number;
  max?: number;
  renk?: string;
  className?: string;
}) {
  const yuzde = Math.min(100, (deger / max) * 100);
  return (
    <div className={cn("relative", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={[{ ad: "g", deger: yuzde }]}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <RadialBar dataKey="deger" cornerRadius={10} fill={renk} background={{ fill: "var(--muted)" }} />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
}
