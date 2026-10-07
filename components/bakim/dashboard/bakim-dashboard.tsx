"use client";

import { Icon } from "@iconify/react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBakimDashboard } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import type { BakimDurum } from "@/lib/types/bakim";

const KPI_RENK: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
  red: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300",
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const DURUM_RENK: Record<BakimDurum, string> = {
  tamamlandi: "bg-emerald-500",
  planlandi: "bg-blue-500",
  devam: "bg-amber-500",
  gecikti: "bg-red-500",
  planYok: "bg-muted-foreground/20",
};
const DURUM_ETIKET: Record<BakimDurum, string> = {
  tamamlandi: "Tamamlandı",
  planlandi: "Planlandı",
  devam: "Devam Ediyor",
  gecikti: "Gecikti",
  planYok: "Plan Yok",
};

export function BakimDashboard() {
  const { data, isLoading } = useBakimDashboard();
  const { t } = useDil();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI kartları */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {data.kpiler.map((k) => (
          <Card key={k.anahtar}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", KPI_RENK[k.renk] ?? KPI_RENK.slate)}>
                  <Icon icon={k.ikon} className="size-5" />
                </span>
                {typeof k.degisim === "number" ? (
                  <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-medium", k.degisim >= 0 ? "text-emerald-600" : "text-red-500")}>
                    <Icon icon={k.degisim >= 0 ? "solar:arrow-right-up-linear" : "solar:arrow-right-down-linear"} className="size-3.5" />
                    %{Math.abs(k.degisim)}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{t(k.baslik)}</p>
              <p className="mt-0.5 font-heading text-2xl font-bold tracking-tight tabular-nums">
                {t(k.deger)}
                {k.birim ? <span className="ml-1 text-sm font-normal text-muted-foreground">{k.birim}</span> : null}
              </p>
              {typeof k.ilerleme === "number" ? (
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-muted">
                  <span className="block h-full rounded-full bg-teal-500" style={{ width: `${k.ilerleme}%` }} />
                </span>
              ) : (
                <p className="mt-1 text-[11px] text-muted-foreground">{t(k.altMetin)}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Haftalık plan + yaklaşan/geciken */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Haftalık Bakım Planı */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <h3 className="font-heading text-base font-medium">{t("Haftalık Bakım Planı")}</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="pb-2 text-left text-xs font-medium text-muted-foreground">{t("Makine / Ekipman")}</th>
                    {data.gunEtiketleri.map((g) => (
                      <th key={g.kisa} className="pb-2 text-center text-xs font-medium text-muted-foreground">
                        <div>{g.tarih}</div>
                        <div className="font-normal">{t(g.kisa)}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.haftalikPlan.map((satir) => (
                    <tr key={satir.makineId} className="border-t">
                      <td className="py-2 pr-2 font-medium whitespace-nowrap">{satir.makine}</td>
                      {satir.gunler.map((d, i) => (
                        <td key={i} className="py-2 text-center">
                          <span className="inline-flex items-center justify-center" title={t(DURUM_ETIKET[d])}>
                            {d === "tamamlandi" ? (
                              <Icon icon="solar:check-circle-bold" className="size-4 text-emerald-500" />
                            ) : d === "gecikti" ? (
                              <Icon icon="solar:close-circle-bold" className="size-4 text-red-500" />
                            ) : (
                              <span className={cn("size-2.5 rounded-full", DURUM_RENK[d])} />
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Lejant */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
              {(["tamamlandi", "planlandi", "devam", "gecikti", "planYok"] as BakimDurum[]).map((d) => (
                <span key={d} className="inline-flex items-center gap-1.5">
                  <span className={cn("size-2.5 rounded-full", DURUM_RENK[d])} />
                  {t(DURUM_ETIKET[d])}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Yaklaşan + Geciken */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-heading text-base font-medium">{t("Yaklaşan Bakımlar")}</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.yaklasan.map((y) => (
                <div key={y.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                    <Icon icon="solar:calendar-bold-duotone" className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t(y.bakim)}</p>
                    <p className="text-xs text-muted-foreground">{y.makine} · {y.tarih}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", y.durum === "yaklasiyor" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300")}>
                    {t(y.periyot)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-heading text-base font-medium">{t("Geciken Bakımlar")}</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.geciken.map((g) => (
                <div key={g.id} className="flex items-center gap-3">
                  <Icon icon="solar:danger-triangle-bold-duotone" className="size-5 shrink-0 text-red-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{g.makine}</p>
                    <p className="text-xs text-muted-foreground">{t(g.bakim)} · {g.planlanan}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
                    {g.gun} {t("gün gecikti")}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Uyum trend */}
        <Card>
          <CardHeader>
            <h3 className="font-heading text-base font-medium">{t("Aylık Bakım Uyum Oranı")} <span className="font-normal text-muted-foreground">(%)</span></h3>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.uyumTrend} margin={{ left: -16, right: 4, top: 4, bottom: 0 }}>
                  <XAxis dataKey="ay" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" tickFormatter={(v: string) => t(v)} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                  <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }} formatter={(v) => [`%${v}`, t("Uyum")]} />
                  <Bar dataKey="oran" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tip dağılımı */}
        <Card>
          <CardHeader>
            <h3 className="font-heading text-base font-medium">{t("Bakım Tipi Dağılımı")}</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative h-40 w-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }} formatter={(v, n) => [`${v}`, t(String(n))]} />
                    <Pie data={data.tipDagilimi} dataKey="adet" nameKey="tip" innerRadius={48} outerRadius={70} paddingAngle={2} isAnimationActive={false}>
                      {data.tipDagilimi.map((d) => <Cell key={d.tip} fill={d.renk} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading text-xl font-bold tabular-nums">{data.tipDagilimi.reduce((s, d) => s + d.adet, 0)}</span>
                  <span className="text-[10px] text-muted-foreground">{t("Bu Ay")}</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                {data.tipDagilimi.map((d) => (
                  <div key={d.tip} className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full" style={{ background: d.renk }} />
                      {t(d.tip)}
                    </span>
                    <span className="font-medium tabular-nums">{d.adet}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Makine yük */}
        <Card>
          <CardHeader>
            <h3 className="font-heading text-base font-medium">{t("En Yüksek Bakım Yükü")}</h3>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {data.makineYuk.map((m) => {
              const maks = data.makineYuk[0]?.adet || 1;
              return (
                <div key={m.makine} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate">{m.makine}</span>
                    <span className="font-medium tabular-nums text-muted-foreground">{m.adet}</span>
                  </div>
                  <span className="block h-2 overflow-hidden rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-blue-500" style={{ width: `${(m.adet / maks) * 100}%` }} />
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
