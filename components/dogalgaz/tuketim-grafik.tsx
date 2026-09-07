"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KartMenu } from "@/components/common/kart-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDogalgazAnaliz } from "@/lib/queries/dogalgaz";
import { DOGALGAZ_TEP_FAKTOR } from "@/lib/data/dogalgaz";
import { sayi, sayiKisa, sayiOndalik } from "@/lib/format";

const SERI = [
  { anahtar: "y2023", etiket: "2023", renk: "#7c3aed" },
  { anahtar: "y2024", etiket: "2024", renk: "#2563eb" },
  { anahtar: "y2025", etiket: "2025", renk: "#06b6d4" },
  { anahtar: "y2026", etiket: "2026", renk: "#16a34a" },
] as const;

const BIRIM = {
  "Sm³": { faktor: 1, eksen: (n: number) => sayiKisa(n), tooltip: (n: number) => `${sayi(n)} Sm³` },
  TEP: { faktor: DOGALGAZ_TEP_FAKTOR, eksen: (n: number) => sayiOndalik(n), tooltip: (n: number) => `${sayiOndalik(n)} TEP` },
} as const;
type BirimTuru = keyof typeof BIRIM;

export function DogalgazTuketimGrafik() {
  const { data, isLoading } = useDogalgazAnaliz();
  const [birim, setBirim] = React.useState<BirimTuru>("Sm³");
  const b = BIRIM[birim];

  const grafikVeri = React.useMemo(
    () =>
      (data?.aylikTuketim ?? []).map((n) => ({
        kisa: n.kisa,
        y2023: n.y2023 * b.faktor,
        y2024: n.y2024 * b.faktor,
        y2025: n.y2025 * b.faktor,
        y2026: n.y2026 === null ? null : n.y2026 * b.faktor,
      })),
    [data, b.faktor],
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2.5">
            <h3 className="font-heading text-base font-medium">
              Aylık Doğalgaz Tüketimi{" "}
              <span className="text-sm font-normal text-muted-foreground">({birim})</span>
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              {SERI.map((s) => (
                <span key={s.anahtar} className="inline-flex items-center gap-1.5">
                  <span className="h-[3px] w-3.5 rounded-full" style={{ background: s.renk }} />
                  {s.etiket}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Select value={birim} onValueChange={(v) => setBirim(v as BirimTuru)}>
              <SelectTrigger size="sm" className="w-[76px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(BIRIM) as BirimTuru[]).map((k) => (
                  <SelectItem key={k} value={k}>{k}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative size-8">
              <KartMenu baslik="Doğalgaz tüketimi" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[340px] w-full" />
        ) : (
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={grafikVeri} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} stroke="var(--muted-foreground)" tickFormatter={(v: number) => b.eksen(v)} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  formatter={(value, name) => {
                    const s = SERI.find((x) => x.anahtar === name);
                    return [value === null ? "—" : b.tooltip(Number(value)), s?.etiket ?? String(name)];
                  }}
                />
                {SERI.map((s) => (
                  <Line
                    key={s.anahtar}
                    type="monotone"
                    dataKey={s.anahtar}
                    stroke={s.renk}
                    strokeWidth={s.anahtar === "y2026" ? 2.5 : 2}
                    dot={{ r: 2.5, fill: s.renk }}
                    activeDot={{ r: 5 }}
                    connectNulls
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
