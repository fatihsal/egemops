"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  LabelList,
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
import type { UyumHucre } from "@/lib/types/bakim";

const KPI_RENK: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
  red: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300",
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};
const RING_RENK: Record<string, string> = {
  blue: "stroke-blue-500",
  emerald: "stroke-emerald-500",
  amber: "stroke-amber-500",
  red: "stroke-red-500",
  teal: "stroke-teal-500",
  slate: "stroke-slate-400",
};
const HUCRE_RENK: Record<UyumHucre, string> = {
  yesil: "bg-emerald-500",
  amber: "bg-amber-400",
  kirmizi: "bg-red-500",
};

const grafikTooltip = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "var(--popover-foreground)",
};

function Halka({ value, renk }: { value: number; renk: string }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
      <circle cx="20" cy="20" r={r} fill="none" strokeWidth="4" className="stroke-muted" />
      <circle
        cx="20" cy="20" r={r} fill="none" strokeWidth="4" strokeLinecap="round"
        className={RING_RENK[renk] ?? RING_RENK.blue}
        strokeDasharray={c} strokeDashoffset={off}
      />
    </svg>
  );
}

function Filtre({ etiket }: { etiket: string }) {
  const { t } = useDil();
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border bg-card px-2.5 py-1 text-xs text-muted-foreground">
      {t(etiket)}
      <Icon icon="solar:alt-arrow-down-linear" className="size-3.5" />
    </span>
  );
}

export function BakimDashboard() {
  const { data, isLoading } = useBakimDashboard();
  const { t } = useDil();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const formMax = Math.max(...data.formDagilimi.map((f) => f.adet), 1);

  return (
    <div className="space-y-6">
      {/* ====================== KPI ====================== */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {data.kpiler.map((k) => (
          <Card key={k.anahtar}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", KPI_RENK[k.renk] ?? KPI_RENK.slate)}>
                  <Icon icon={k.ikon} className="size-5" />
                </span>
                {typeof k.ilerleme === "number" ? <Halka value={k.ilerleme} renk={k.renk} /> : null}
              </div>
              <p className="mt-3 truncate text-xs text-muted-foreground">{t(k.baslik)}</p>
              <p className="mt-0.5 font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</p>
              <p className="mt-1 flex items-center gap-1 text-[11px]">
                {typeof k.degisim === "number" ? (
                  <span className={cn(
                    "inline-flex items-center font-medium",
                    k.degisim > 0 ? "text-emerald-600 dark:text-emerald-400" : k.degisim < 0 ? "text-red-500" : "text-muted-foreground",
                  )}>
                    <Icon
                      icon={k.degisim > 0 ? "solar:arrow-right-up-linear" : k.degisim < 0 ? "solar:arrow-right-down-linear" : "solar:minus-linear"}
                      className="size-3.5"
                    />
                    %{Math.abs(k.degisim)}
                  </span>
                ) : null}
                <span className="truncate text-muted-foreground">{t(k.altMetin)}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ============== Form Dağılımı / Plan Durumu / Trend ============== */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Haftalık Bakım Formu Dağılımı */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <h3 className="font-heading text-base font-medium">{t("Haftalık Bakım Formu Dağılımı")}</h3>
            <Filtre etiket="Bu Hafta" />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={data.formDagilimi} margin={{ left: 8, right: 28, top: 4, bottom: 4 }}>
                  <XAxis type="number" hide domain={[0, formMax + 2]} />
                  <YAxis type="category" dataKey="makine" width={84} tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                  <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} contentStyle={grafikTooltip} formatter={(v) => [`${v}`, t("Form")]} />
                  <Bar dataKey="adet" fill="#3b82f6" radius={[0, 4, 4, 0]} maxBarSize={16} isAnimationActive={false}>
                    <LabelList dataKey="adet" position="right" className="fill-foreground" fontSize={11} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bakım Planı Durumu */}
        <Card>
          <CardHeader>
            <h3 className="font-heading text-base font-medium">{t("Bakım Planı Durumu")}</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative h-40 w-40 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={grafikTooltip} formatter={(v, n) => [`${v}`, t(String(n))]} />
                    <Pie data={data.planDurumu.dilimler} dataKey="adet" nameKey="etiket" innerRadius={50} outerRadius={70} paddingAngle={2} isAnimationActive={false}>
                      {data.planDurumu.dilimler.map((d) => <Cell key={d.etiket} fill={d.renk} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading text-2xl font-bold tabular-nums">{data.planDurumu.toplam}</span>
                  <span className="text-[10px] text-muted-foreground">{t("Toplam Plan")}</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {data.planDurumu.dilimler.map((d) => (
                  <div key={d.etiket} className="flex items-center justify-between gap-2 text-sm">
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ background: d.renk }} />
                      <span className="truncate">{t(d.etiket)}</span>
                    </span>
                    <span className="shrink-0 tabular-nums">
                      <span className="font-semibold">{d.adet}</span>
                      <span className="ml-1.5 text-xs text-muted-foreground">%{d.yuzde}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aylık Bakım Tamamlama Trendi */}
        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <h3 className="font-heading text-base font-medium">{t("Aylık Bakım Tamamlama Trendi")} <span className="font-normal text-muted-foreground">(%)</span></h3>
            <Filtre etiket="Son 6 Ay" />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.tamamlamaTrend} margin={{ left: -16, right: 12, top: 16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trendDolgu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="ay" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" tickFormatter={(v: string) => t(v)} />
                  <YAxis domain={[60, 100]} tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={grafikTooltip} formatter={(v) => [`%${v}`, t("Tamamlama")]} labelFormatter={(l) => t(String(l))} />
                  <Area dataKey="oran" stroke="#3b82f6" strokeWidth={2} fill="url(#trendDolgu)" dot={{ r: 3, fill: "#3b82f6" }} isAnimationActive={false}>
                    <LabelList dataKey="oran" position="top" className="fill-muted-foreground" fontSize={10} formatter={(v) => `%${v}`} />
                  </Area>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============== Yaklaşan + Son Onaylanan ============== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Yaklaşan Bakımlar */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <h3 className="font-heading text-base font-medium">{t("Yaklaşan Bakımlar")}</h3>
            <Link href="/bakim/takvim" className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">{t("Tümünü Gör")}</Link>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {data.yaklasan.map((y) => {
              const acil = y.kalanGun <= 1 ? "red" : y.kalanGun <= 3 ? "amber" : "blue";
              const kutu = acil === "red" ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300" : acil === "amber" ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" : "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300";
              const pil = acil === "red" ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" : acil === "amber" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
              return (
                <div key={y.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                  <span className={cn("flex size-11 shrink-0 flex-col items-center justify-center rounded-lg leading-none", kutu)}>
                    <span className="font-heading text-base font-bold tabular-nums">{y.gun}</span>
                    <span className="text-[10px]">{t(y.ayKisa)}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{y.makine}</p>
                    <p className="truncate text-xs text-muted-foreground">{t(y.bakim)}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", pil)}>
                    {y.kalanGun} {t("gün kaldı")}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Son Onaylanan Bakım Kayıtları */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <h3 className="font-heading text-base font-medium">{t("Son Onaylanan Bakım Kayıtları")}</h3>
            <Link href="/bakim/kayitlar" className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">{t("Tümünü Gör")}</Link>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 pr-3 font-medium">{t("Tarih")}</th>
                  <th className="pb-2 pr-3 font-medium">{t("Makine")}</th>
                  <th className="pb-2 pr-3 font-medium">{t("Bakım Türü")}</th>
                  <th className="pb-2 pr-3 font-medium">{t("Form No")}</th>
                  <th className="pb-2 pr-3 font-medium">{t("Onaylayan")}</th>
                  <th className="pb-2 font-medium">{t("Durum")}</th>
                </tr>
              </thead>
              <tbody>
                {data.sonKayitlar.map((r) => (
                  <tr key={r.formNo} className="border-b last:border-0">
                    <td className="py-2.5 pr-3 tabular-nums whitespace-nowrap">{r.tarih}</td>
                    <td className="py-2.5 pr-3 font-medium whitespace-nowrap">{r.makine}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap">{t(r.bakimTuru)}</td>
                    <td className="py-2.5 pr-3 tabular-nums whitespace-nowrap text-muted-foreground">{r.formNo}</td>
                    <td className="py-2.5 pr-3 whitespace-nowrap">{r.onaylayan}</td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        <Icon icon="solar:check-circle-bold" className="size-3" />
                        {t(r.durum)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* ============== SOP Kullanım + Teknisyen Yük ============== */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SOP / Checklist Kullanım Oranı */}
        <Card>
          <CardHeader>
            <h3 className="font-heading text-base font-medium">{t("SOP / Checklist Kullanım Oranı")}</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="relative h-36 w-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={grafikTooltip} formatter={(v, n) => [`${v}`, t(String(n))]} />
                    <Pie
                      data={[
                        { ad: "Kullanıldı", v: data.sopKullanim.kullanildi, renk: "#10b981" },
                        { ad: "Kısmen", v: data.sopKullanim.kismen, renk: "#f59e0b" },
                        { ad: "Kullanılmadı", v: data.sopKullanim.kullanilmadi, renk: "#ef4444" },
                      ]}
                      dataKey="v" nameKey="ad" innerRadius={44} outerRadius={62} paddingAngle={2} isAnimationActive={false}
                    >
                      {["#10b981", "#f59e0b", "#ef4444"].map((c) => <Cell key={c} fill={c} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-xl font-bold tabular-nums">%{data.sopKullanim.yuzde}</span>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-sm">
                {[
                  { ad: "Kullanıldı", v: data.sopKullanim.kullanildi, renk: "#10b981" },
                  { ad: "Kısmen", v: data.sopKullanim.kismen, renk: "#f59e0b" },
                  { ad: "Kullanılmadı", v: data.sopKullanim.kullanilmadi, renk: "#ef4444" },
                ].map((d) => (
                  <div key={d.ad} className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2.5 rounded-full" style={{ background: d.renk }} />
                      {t(d.ad)}
                    </span>
                    <span className="font-semibold tabular-nums">{d.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teknisyen İş Yükü */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <h3 className="font-heading text-base font-medium">{t("Teknisyen İş Yükü")}</h3>
            <Filtre etiket="Bu Hafta" />
          </CardHeader>
          <CardContent className="space-y-3.5">
            {data.teknisyenYuk.map((p) => {
              const bar = p.yuzde >= 100 ? "bg-red-500" : p.yuzde >= 80 ? "bg-amber-500" : "bg-blue-500";
              return (
                <div key={p.ad} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2">
                      <span className="flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Icon icon="solar:user-linear" className="size-3.5" />
                      </span>
                      {p.ad}
                    </span>
                    <span className="font-semibold tabular-nums">%{p.yuzde}</span>
                  </div>
                  <span className="block h-2 overflow-hidden rounded-full bg-muted">
                    <span className={cn("block h-full rounded-full", bar)} style={{ width: `${p.yuzde}%` }} />
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* ============== Form Uyum Isı Haritası ============== */}
      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">
          <h3 className="font-heading text-base font-medium">{t("Makine Bazlı Form Uyum Haritası")} <span className="font-normal text-muted-foreground">({t("Son 8 Hafta")})</span></h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-emerald-500" /> ≥%90</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-amber-400" /> %70–%89</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-red-500" /> &lt;%70</span>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="pb-2 pr-3 text-left text-xs font-medium text-muted-foreground">{t("Makine")}</th>
                {data.uyumHaritasi.haftalar.map((h) => (
                  <th key={h.kisa} className="px-1 pb-2 text-center text-[10px] font-medium text-muted-foreground">
                    <div className="font-semibold">{h.kisa}</div>
                    <div className="font-normal whitespace-nowrap">{h.tarih}</div>
                  </th>
                ))}
                <th className="pb-2 pl-3 text-right text-xs font-medium text-muted-foreground whitespace-nowrap">{t("Genel Uyum")}</th>
              </tr>
            </thead>
            <tbody>
              {data.uyumHaritasi.satirlar.map((s) => (
                <tr key={s.makine}>
                  <td className="py-1.5 pr-3 font-medium whitespace-nowrap">{s.makine}</td>
                  {s.haftalar.map((h, i) => (
                    <td key={i} className="px-1 py-1.5">
                      <span className={cn("block h-5 rounded", HUCRE_RENK[h])} />
                    </td>
                  ))}
                  <td className="py-1.5 pl-3 text-right font-semibold tabular-nums">%{s.genelUyum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
