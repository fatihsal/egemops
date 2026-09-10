"use client";

import { Icon } from "@iconify/react";
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
import { RadialOran } from "@/components/kayit-detay/parcalar";
import { useElektrikGesAnaliz } from "@/lib/queries/elektrik-ges";
import { useDil } from "@/components/providers/dil-provider";
import { sayi, sayi2, sayiKisa, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

export function GesPerformansi() {
  const { data, isLoading } = useElektrikGesAnaliz();
  const { t } = useDil();

  if (isLoading || !data) {
    return <Skeleton className="h-[520px] w-full rounded-xl" />;
  }

  const uretim = data.kaynaklar.find((k) => k.anahtar === "gesOz")!.gwh
    + data.kaynaklar.find((k) => k.anahtar === "verilen")!.gwh;
  const ozGwh = data.kaynaklar.find((k) => k.anahtar === "gesOz")!.gwh;
  const verilenGwh = data.kaynaklar.find((k) => k.anahtar === "verilen")!.gwh;
  const ozOran = Math.round((ozGwh / uretim) * 1000) / 10;
  const verilenOran = Math.round((verilenGwh / uretim) * 1000) / 10;
  const karsilama = data.kpiler.find((k) => k.anahtar === "gesKarsilama")?.radyal ?? 0;
  const uretimKpi = data.kpiler.find((k) => k.anahtar === "gesUretim");

  const grafikVeri = data.aylik.map((a) => ({
    kisa: a.kisa,
    donem: a.donem,
    gesUretim: a.gesUretim,
    ozOran: a.gesUretim ? Math.round((a.gesOz / a.gesUretim) * 1000) / 10 : 0,
  }));

  const radialKartlar = [
    { etiket: t("Öz Tüketim Oranı"), deger: ozOran, renk: "#16a34a", not: t("Üretimin fabrikada kullanılan kısmı") },
    { etiket: t("Şebekeye Verilen Oranı"), deger: verilenOran, renk: "#86efac", not: t("Üretimin şebekeye satılan kısmı") },
    { etiket: t("GES Karşılama Oranı"), deger: karsilama, renk: "#0d9488", not: t("Fabrika elektriğinin GES payı") },
  ];

  return (
    <div className="space-y-6">
      {/* KPI + radial kartlar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="h-full">
          <CardContent className="flex h-full flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                <Icon icon="solar:sun-2-bold-duotone" className="size-6" />
              </span>
              <span className="text-xs font-medium text-muted-foreground">{t("GES Toplam Üretimi")}</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-heading text-[26px] font-bold leading-none tracking-tight">{uretimKpi?.deger ?? sayi2(uretim)}</span>
              <span className="text-sm text-muted-foreground">GWh</span>
            </div>
            <p className="text-xs text-muted-foreground">{sayi2(ozGwh)} GWh {t("öz")} · {sayi2(verilenGwh)} GWh {t("şebekeye")}</p>
            {uretimKpi ? (
              <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Icon icon="solar:alt-arrow-up-bold" className="size-3" />
                %{sayiOndalik(Math.abs(uretimKpi.degisimYuzde))}
                <span className="font-normal text-muted-foreground">vs 2025</span>
              </span>
            ) : null}
          </CardContent>
        </Card>

        {radialKartlar.map((r) => (
          <Card key={r.etiket} className="h-full">
            <CardContent className="flex h-full items-center gap-4">
              <RadialOran deger={r.deger} renk={r.renk} className="size-20 shrink-0" yaziSinif="text-sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium">{r.etiket}</p>
                <p className="mt-1 text-xs leading-tight text-muted-foreground">{r.not}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Aylık GES üretimi + öz tüketim oranı + akış özeti */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <Card className="h-full xl:col-span-8">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-heading text-base font-medium">{t("Aylık GES Üretimi ve Öz Tüketim Oranı")}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-600" /> {t("GES Üretimi (kWh)")}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-[3px] w-3.5 rounded-full bg-teal-500" /> {t("Öz Tüketim Oranı (%)")}
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
                  <YAxis yAxisId="sag" orientation="right" domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} width={40} stroke="var(--muted-foreground)" tickFormatter={(v: number) => `%${sayi(v)}`} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    labelFormatter={(_, p) => p?.[0]?.payload?.donem ?? ""}
                    formatter={(value, name) =>
                      name === "ozOran"
                        ? [`%${sayiOndalik(Number(value))}`, t("Öz Tüketim Oranı")]
                        : [`${sayi(Number(value))} kWh`, t("GES Üretimi")]
                    }
                  />
                  <Bar yAxisId="sol" dataKey="gesUretim" fill="#16a34a" radius={[3, 3, 0, 0]} maxBarSize={34} />
                  <Line yAxisId="sag" type="monotone" dataKey="ozOran" stroke="#0d9488" strokeWidth={2} dot={{ r: 3, fill: "#0d9488" }} activeDot={{ r: 5 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full xl:col-span-4">
          <CardHeader>
            <h3 className="font-heading text-base font-medium">{t("GES Akış Özeti")}</h3>
            <p className="text-xs text-muted-foreground">{t("Üretilen enerjinin dağılımı")}</p>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="flex h-full flex-col justify-center gap-5">
              <div>
                <p className="text-xs text-muted-foreground">{t("Toplam GES Üretimi")}</p>
                <p className="mt-0.5 flex items-baseline gap-1">
                  <span className="font-heading text-2xl font-bold tracking-tight">{sayi2(uretim)}</span>
                  <span className="text-sm text-muted-foreground">GWh</span>
                </p>
              </div>

              {/* Oran çubuğu */}
              <div className="flex h-3 overflow-hidden rounded-full">
                <div className="bg-green-600" style={{ width: `${ozOran}%` }} />
                <div className="bg-green-300" style={{ width: `${verilenOran}%` }} />
              </div>

              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full bg-green-600" />
                  <span className="flex-1 text-muted-foreground">{t("Öz Tüketim")}</span>
                  <span className="font-medium tabular-nums">{sayi2(ozGwh)} GWh</span>
                  <span className="w-12 text-right font-semibold tabular-nums">%{sayiOndalik(ozOran)}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full bg-green-300" />
                  <span className="flex-1 text-muted-foreground">{t("Şebekeye Verilen")}</span>
                  <span className="font-medium tabular-nums">{sayi2(verilenGwh)} GWh</span>
                  <span className="w-12 text-right font-semibold tabular-nums">%{sayiOndalik(verilenOran)}</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
