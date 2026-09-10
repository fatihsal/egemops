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
import { useElektrikGesAnaliz } from "@/lib/queries/elektrik-ges";
import { useDil } from "@/components/providers/dil-provider";
import { sayi, sayiKisa, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ElektrikAylik } from "@/lib/types";

// Yalnızca gerçekleşen aylar (Ocak–Temmuz).
const AKTIF_SAYISI = 7;

const KUTULAR = [
  { anahtar: "fabrikaToplam", etiket: "Fabrika Toplam", ikon: "solar:bolt-circle-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  { anahtar: "sebeke", etiket: "Şebeke Tüketimi", ikon: "solar:bolt-bold-duotone", sinif: "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300" },
  { anahtar: "gesUretim", etiket: "GES Üretimi", ikon: "solar:sun-2-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
  { anahtar: "gesOz", etiket: "GES Öz Tüketimi", ikon: "solar:battery-charge-bold-duotone", sinif: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300" },
] as const;

const KARS_SATIR = [
  { anahtar: "sebeke", etiket: "Şebeke Tüketimi", birim: "kWh" },
  { anahtar: "gesUretim", etiket: "GES Üretimi", birim: "kWh" },
  { anahtar: "gesOz", etiket: "GES Öz Tüketimi", birim: "kWh" },
  { anahtar: "sebekeyeVerilen", etiket: "Şebekeye Verilen", birim: "kWh" },
  { anahtar: "fabrikaToplam", etiket: "Fabrika Toplam", birim: "kWh" },
  { anahtar: "gesKarsilama", etiket: "GES Karşılama", birim: "%" },
] as const;

function mom(cur: number, onceki: number | undefined) {
  if (onceki === undefined || onceki === 0) return 0;
  return Math.round(((cur - onceki) / onceki) * 1000) / 10;
}

export function AylikAnaliz() {
  const { data, isLoading } = useElektrikGesAnaliz();
  const { t } = useDil();
  const [si, setSi] = React.useState(6); // Temmuz varsayılan

  if (isLoading || !data) {
    return <Skeleton className="h-[520px] w-full rounded-xl" />;
  }

  const aylar = data.aylik.slice(0, AKTIF_SAYISI);
  const secili = aylar[si];
  const onceki = si > 0 ? aylar[si - 1] : null;

  const grafikVeri = aylar.map((a, i) => ({
    kisa: a.kisa,
    donem: a.donem,
    fabrikaToplam: a.fabrikaToplam,
    mom: i === 0 ? null : mom(a.fabrikaToplam, aylar[i - 1].fabrikaToplam),
  }));

  return (
    <div className="space-y-6">
      {/* Ay seçici */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground">{t("Seçili Dönem")}</p>
          <h2 className="font-heading text-xl font-semibold tracking-tight">{secili.donem}</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("Ay")}</span>
          <Select
            value={secili.donem}
            onValueChange={(v) => setSi(aylar.findIndex((a) => a.donem === v))}
          >
            <SelectTrigger className="w-[150px] bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aylar.map((a) => (
                <SelectItem key={a.ay} value={a.donem}>
                  {a.donem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Seçili ay KPI'ları (önceki aya göre) */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {KUTULAR.map((k) => {
          const deger = secili[k.anahtar as keyof ElektrikAylik] as number;
          const onc = onceki ? (onceki[k.anahtar as keyof ElektrikAylik] as number) : undefined;
          return (
            <Card key={k.anahtar} size="sm" className="h-full">
              <CardContent className="flex items-start gap-3">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", k.sinif)}>
                  <Icon icon={k.ikon} className="size-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t(k.etiket)}</p>
                  <p className="mt-0.5 font-heading text-lg font-bold tracking-tight tabular-nums">
                    {sayi(deger)} <span className="text-xs font-normal text-muted-foreground">kWh</span>
                  </p>
                  <div className="mt-1">
                    {onceki ? <Degisim yuzde={mom(deger, onc)} etiket={t("önceki ay")} /> : (
                      <span className="text-xs text-muted-foreground">{t("İlk dönem")}</span>
                    )}
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
              <h3 className="font-heading text-base font-medium">{t("Aylık Tüketim ve Değişim")}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-blue-600" /> {t("Fabrika Toplam (kWh)")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-[3px] w-3.5 rounded-full bg-amber-500" /> {t("Aylık Değişim (%)")}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={grafikVeri} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="kisa" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis yAxisId="sol" tickLine={false} axisLine={false} fontSize={12} width={48} stroke="var(--muted-foreground)" tickFormatter={(v: number) => sayiKisa(v)} />
                  <YAxis yAxisId="sag" orientation="right" tickLine={false} axisLine={false} fontSize={12} width={40} stroke="var(--muted-foreground)" tickFormatter={(v: number) => `%${sayiOndalik(v)}`} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    labelFormatter={(_, p) => p?.[0]?.payload?.donem ?? ""}
                    formatter={(value, name) =>
                      name === "mom"
                        ? [value === null ? "—" : `%${sayiOndalik(Number(value))}`, t("Aylık Değişim")]
                        : [`${sayi(Number(value))} kWh`, t("Fabrika Toplam")]
                    }
                  />
                  <Bar yAxisId="sol" dataKey="fabrikaToplam" radius={[3, 3, 0, 0]} maxBarSize={44}>
                    {grafikVeri.map((_, i) => (
                      <Cell key={i} fill={i === si ? "#2563eb" : "#bfdbfe"} />
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
            <p className="text-xs text-muted-foreground">
              {onceki ? `${onceki.donem} → ${secili.donem}` : t("Karşılaştırılacak önceki ay yok")}
            </p>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {KARS_SATIR.map((s) => {
                const cur = secili[s.anahtar as keyof ElektrikAylik] as number;
                const onc = onceki ? (onceki[s.anahtar as keyof ElektrikAylik] as number) : undefined;
                const bicim = (n: number) => (s.birim === "%" ? `%${sayiOndalik(n)}` : sayi(n));
                return (
                  <li key={s.anahtar} className="flex items-center justify-between gap-2 py-2.5 text-sm">
                    <span className="text-muted-foreground">{t(s.etiket)}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium tabular-nums">{bicim(cur)}</span>
                      {onceki ? (
                        <Degisim yuzde={mom(cur, onc)} className="w-14 justify-end" />
                      ) : (
                        <span className="w-14 text-right text-xs text-muted-foreground">—</span>
                      )}
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
