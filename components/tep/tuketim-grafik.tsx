"use client";

import * as React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
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
import { useTepAnaliz } from "@/lib/queries/tep";
import { TEP_KWH } from "@/lib/data/tep";
import { sayiKisa, sayiOndalik } from "@/lib/format";

const RENK = { elektrik: "#2563eb", dogalgaz: "#8b5cf6", akaryakit: "#f59e0b", toplam: "#14b8a6" };
const SERI = [
  { anahtar: "elektrik", etiket: "Elektrik TEP", renk: RENK.elektrik, tip: "bar" },
  { anahtar: "dogalgaz", etiket: "Doğalgaz TEP", renk: RENK.dogalgaz, tip: "bar" },
  { anahtar: "akaryakit", etiket: "Akaryakıt TEP", renk: RENK.akaryakit, tip: "bar" },
  { anahtar: "toplam", etiket: "Toplam TEP", renk: RENK.toplam, tip: "line" },
] as const;

const BIRIM = {
  TEP: { faktor: 1, eksen: (n: number) => sayiOndalik(n), tooltip: (n: number) => `${sayiOndalik(n)} TEP` },
  kWh: { faktor: TEP_KWH, eksen: (n: number) => sayiKisa(n), tooltip: (n: number) => `${sayiKisa(n)} kWh` },
} as const;
type BirimTuru = keyof typeof BIRIM;

export function TepTuketimGrafik() {
  const { data, isLoading } = useTepAnaliz();
  const [birim, setBirim] = React.useState<BirimTuru>("TEP");
  const b = BIRIM[birim];

  const grafikVeri = React.useMemo(
    () =>
      (data?.aylik ?? []).map((a) => ({
        kisa: a.kisa,
        donem: a.donem,
        elektrik: a.elektrik * b.faktor,
        dogalgaz: a.dogalgaz * b.faktor,
        akaryakit: a.akaryakit * b.faktor,
        toplam: a.toplam * b.faktor,
      })),
    [data, b.faktor],
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2.5">
            <h3 className="font-heading text-base font-medium">
              Aylık Toplam Enerji Tüketimi{" "}
              <span className="text-sm font-normal text-muted-foreground">({birim})</span>
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              {SERI.map((s) => (
                <span key={s.anahtar} className="inline-flex items-center gap-1.5">
                  <span
                    className="rounded-full"
                    style={{ background: s.renk, width: s.tip === "line" ? 14 : 8, height: s.tip === "line" ? 3 : 8 }}
                  />
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
              <KartMenu baslik="Aylık enerji tüketimi" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[320px] w-full" />
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={grafikVeri} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} stroke="var(--muted-foreground)" tickFormatter={(v: number) => b.eksen(v)} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  labelFormatter={(_, p) => p?.[0]?.payload?.donem ?? ""}
                  formatter={(value, name) => {
                    const s = SERI.find((x) => x.anahtar === name);
                    return [b.tooltip(Number(value)), s?.etiket ?? String(name)];
                  }}
                />
                <Bar dataKey="elektrik" stackId="t" fill={RENK.elektrik} maxBarSize={34} />
                <Bar dataKey="dogalgaz" stackId="t" fill={RENK.dogalgaz} maxBarSize={34} />
                <Bar dataKey="akaryakit" stackId="t" fill={RENK.akaryakit} radius={[3, 3, 0, 0]} maxBarSize={34} />
                <Line type="monotone" dataKey="toplam" stroke={RENK.toplam} strokeWidth={2.5} dot={{ r: 3, fill: RENK.toplam }} activeDot={{ r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
