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
import { useElektrikGesAnaliz } from "@/lib/queries/elektrik-ges";
import { useDil } from "@/components/providers/dil-provider";
import { sayi, sayi2, sayiKisa, sayiOndalik } from "@/lib/format";

const RENK = { sebeke: "#2563eb", gesOz: "#16a34a", toplam: "var(--foreground)" };
const SERI = [
  { anahtar: "sebeke", etiket: "Şebeke Tüketimi", renk: RENK.sebeke, tip: "bar" },
  { anahtar: "gesOz", etiket: "GES Öz Tüketim", renk: RENK.gesOz, tip: "bar" },
  { anahtar: "fabrikaToplam", etiket: "Toplam Elektrik Tüketimi", renk: RENK.toplam, tip: "line" },
] as const;

// Birim → bölen, tooltip biçimi ve (kompakt) eksen biçimi.
const BIRIM = {
  kWh: { bolen: 1, bicim: (n: number) => sayi(n), eksen: (n: number) => sayiKisa(n) },
  MWh: { bolen: 1000, bicim: (n: number) => sayiOndalik(n), eksen: (n: number) => sayi(n) },
  GWh: { bolen: 1_000_000, bicim: (n: number) => sayi2(n), eksen: (n: number) => sayi2(n) },
} as const;
type BirimTuru = keyof typeof BIRIM;

export function ElektrikTuketimGrafik() {
  const { data, isLoading } = useElektrikGesAnaliz();
  const { t } = useDil();
  const [birim, setBirim] = React.useState<BirimTuru>("kWh");

  const b = BIRIM[birim];
  const grafikVeri = React.useMemo(
    () =>
      (data?.aylik ?? []).map((a) => ({
        kisa: a.kisa,
        donem: a.donem,
        sebeke: a.sebeke / b.bolen,
        gesOz: a.gesOz / b.bolen,
        fabrikaToplam: a.fabrikaToplam / b.bolen,
      })),
    [data, b.bolen],
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2.5">
            <h3 className="font-heading text-base font-medium">
              {t("Elektrik Tüketimi")}{" "}
              <span className="text-sm font-normal text-muted-foreground">({birim})</span>
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
              {SERI.map((s) => (
                <span key={s.anahtar} className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="rounded-full"
                    style={{
                      background: s.renk,
                      width: s.tip === "line" ? 14 : 8,
                      height: s.tip === "line" ? 3 : 8,
                    }}
                  />
                  {t(s.etiket)}
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
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative size-8">
              <KartMenu baslik={t("Elektrik tüketimi")} />
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
                <XAxis
                  dataKey="kisa"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={52}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v: number) => b.eksen(v)}
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
                  labelFormatter={(_, p) => p?.[0]?.payload?.donem ?? ""}
                  formatter={(value, name) => {
                    const seri = SERI.find((s) => s.anahtar === name);
                    return [`${b.bicim(Number(value))} ${birim}`, t(seri?.etiket ?? String(name))];
                  }}
                />
                <Bar dataKey="sebeke" stackId="e" fill={RENK.sebeke} maxBarSize={34} />
                <Bar dataKey="gesOz" stackId="e" fill={RENK.gesOz} radius={[3, 3, 0, 0]} maxBarSize={34} />
                <Line
                  type="monotone"
                  dataKey="fabrikaToplam"
                  stroke={RENK.toplam}
                  strokeWidth={2}
                  dot={{ r: 3, fill: RENK.toplam }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
