"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import {
  Bar,
  Cell,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Degisim } from "@/components/kayit-detay/parcalar";
import { useTepAnaliz } from "@/lib/queries/tep";
import { useDil } from "@/components/providers/dil-provider";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TepAylik } from "@/lib/types";

const AKTIF = 7;

const KUTULAR = [
  { anahtar: "elektrik", etiket: "Elektrik TEP", ikon: "solar:bolt-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  { anahtar: "dogalgaz", etiket: "Doğalgaz TEP", ikon: "solar:fire-bold-duotone", sinif: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" },
  { anahtar: "akaryakit", etiket: "Akaryakıt TEP", ikon: "solar:gas-station-bold-duotone", sinif: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300" },
  { anahtar: "toplam", etiket: "Toplam TEP", ikon: "solar:pie-chart-2-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
] as const;

const KARS = [
  { anahtar: "elektrik", etiket: "Elektrik TEP" },
  { anahtar: "dogalgaz", etiket: "Doğalgaz TEP" },
  { anahtar: "akaryakit", etiket: "Akaryakıt TEP" },
  { anahtar: "toplam", etiket: "Toplam TEP" },
  { anahtar: "uretim", etiket: "Üretim (ton)" },
  { anahtar: "yogunluk", etiket: "TEP / ton" },
] as const;

function mom(cur: number, onceki: number | undefined) {
  if (!onceki) return 0;
  return Math.round(((cur - onceki) / onceki) * 1000) / 10;
}

export function TepAylikAnaliz() {
  const { data, isLoading } = useTepAnaliz();
  const { t } = useDil();
  const [si, setSi] = React.useState(6);

  if (isLoading || !data) return <Skeleton className="h-[520px] w-full rounded-xl" />;

  const aylar = data.aylik.slice(0, AKTIF);
  const secili = aylar[si];
  const onceki = si > 0 ? aylar[si - 1] : null;

  const grafikVeri = aylar.map((a, i) => ({
    kisa: a.kisa,
    donem: a.donem,
    toplam: a.toplam,
    mom: i === 0 ? null : mom(a.toplam, aylar[i - 1].toplam),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">{t("Seçili Dönem")}</p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">{secili.donem}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("Ay")}</span>
          <Select value={secili.donem} onValueChange={(v) => setSi(aylar.findIndex((a) => a.donem === v))}>
            <SelectTrigger className="w-[150px] bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aylar.map((a) => (
                <SelectItem key={a.ay} value={a.donem}>{a.donem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Seçili ay KPI'ları */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {KUTULAR.map((k) => {
          const deger = secili[k.anahtar as keyof TepAylik] as number;
          const onc = onceki ? (onceki[k.anahtar as keyof TepAylik] as number) : undefined;
          return (
            <Card key={k.anahtar} size="sm" className="h-full">
              <CardContent className="flex items-start gap-3">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", k.sinif)}>
                  <Icon icon={k.ikon} className="size-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t(k.etiket)}</p>
                  <p className="mt-0.5 font-heading text-lg font-bold tracking-tight tabular-nums">
                    {sayiOndalik(deger)} <span className="text-xs font-normal text-muted-foreground">TEP</span>
                  </p>
                  <div className="mt-1">
                    {onceki ? <Degisim yuzde={mom(deger, onc)} etiket={t("önceki ay")} /> : <span className="text-xs text-muted-foreground">{t("İlk dönem")}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grafik + önceki ay karşılaştırma */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <Card className="h-full xl:col-span-8">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-heading text-base font-medium">{t("Aylık Toplam TEP ve Değişim")}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-teal-600" /> {t("Toplam TEP")}</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-[3px] w-3.5 rounded-full bg-amber-500" /> {t("Aylık Değişim (%)")}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={grafikVeri} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" tickFormatter={(v: string) => t(v)} />
                  <YAxis yAxisId="sol" tickLine={false} axisLine={false} fontSize={12} width={40} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayiOndalik(v)} />
                  <YAxis yAxisId="sag" orientation="right" tickLine={false} axisLine={false} fontSize={12} width={40} stroke="var(--muted-foreground)" tickFormatter={(v: number) => `%${sayiOndalik(v)}`} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    labelFormatter={(_, p) => t(p?.[0]?.payload?.donem ?? "")}
                    formatter={(value, name) =>
                      name === "mom"
                        ? [value === null ? "—" : `%${sayiOndalik(Number(value))}`, t("Aylık Değişim")]
                        : [`${sayiOndalik(Number(value))} TEP`, t("Toplam TEP")]
                    }
                  />
                  <Bar yAxisId="sol" dataKey="toplam" radius={[3, 3, 0, 0]} maxBarSize={44}>
                    {grafikVeri.map((_, i) => (
                      <Cell key={i} fill={i === si ? "#0d9488" : "#99f6e4"} />
                    ))}
                  </Bar>
                  <Line yAxisId="sag" type="monotone" dataKey="mom" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} activeDot={{ r: 5 }} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full xl:col-span-4">
          <CardHeader>
            <h3 className="font-heading text-base font-medium">{t("Önceki Aya Göre")}</h3>
            <p className="text-xs text-muted-foreground">{onceki ? `${onceki.donem} → ${secili.donem}` : t("Karşılaştırılacak önceki ay yok")}</p>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {KARS.map((s) => {
                const cur = secili[s.anahtar as keyof TepAylik] as number;
                const onc = onceki ? (onceki[s.anahtar as keyof TepAylik] as number) : undefined;
                const bicim = s.anahtar === "uretim" ? String(Math.round(cur)) : sayiOndalik(cur);
                return (
                  <li key={s.anahtar} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                    <span className="text-muted-foreground">{t(s.etiket)}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium tabular-nums">{bicim}</span>
                      {onceki ? <Degisim yuzde={mom(cur, onc)} className="w-14 justify-end" /> : <span className="w-14 text-right text-xs text-muted-foreground">—</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
