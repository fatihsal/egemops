"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {
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
import { AY_ADLARI, GUN_KISA, ayIzgarasi, ayniGun } from "@/lib/bakim/tarih";
import type { FormHucre, TakvimTip } from "@/lib/types/bakim";

const KPI_RENK: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
  red: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300",
  teal: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

const TAKVIM_META: Record<TakvimTip, { etiket: string; dot: string; kutu: string; metin: string }> = {
  haftalikForm: { etiket: "Haftalık Form", dot: "#3b82f6", kutu: "bg-blue-50 dark:bg-blue-950/60", metin: "text-blue-700 dark:text-blue-300" },
  "3aylik": { etiket: "3 Aylık Bakım", dot: "#10b981", kutu: "bg-emerald-50 dark:bg-emerald-950/60", metin: "text-emerald-700 dark:text-emerald-300" },
  "6aylik": { etiket: "6 Aylık Bakım", dot: "#f97316", kutu: "bg-orange-50 dark:bg-orange-950/60", metin: "text-orange-700 dark:text-orange-300" },
  "12aylik": { etiket: "12 Aylık Bakım", dot: "#a855f7", kutu: "bg-purple-50 dark:bg-purple-950/60", metin: "text-purple-700 dark:text-purple-300" },
  planlamaBekliyor: { etiket: "Planlama Bekliyor", dot: "#eab308", kutu: "bg-yellow-50 dark:bg-yellow-950/60", metin: "text-yellow-700 dark:text-yellow-300" },
  tarihOnerildi: { etiket: "Tarih Önerildi", dot: "#14b8a6", kutu: "bg-teal-50 dark:bg-teal-950/60", metin: "text-teal-700 dark:text-teal-300" },
  ertelendi: { etiket: "Ertelendi", dot: "#ef4444", kutu: "bg-red-50 dark:bg-red-950/60", metin: "text-red-700 dark:text-red-300" },
};
const TAKVIM_SIRA: TakvimTip[] = ["haftalikForm", "3aylik", "6aylik", "12aylik", "planlamaBekliyor", "tarihOnerildi", "ertelendi"];

const FORM_RENK: Record<FormHucre, string> = {
  tamamlandi: "bg-emerald-400 dark:bg-emerald-500",
  eksik: "bg-amber-300 dark:bg-amber-500/80",
  uygulanmadi: "bg-slate-200 dark:bg-slate-700",
};

const DURUM_RENK: Record<string, string> = {
  cevapBekliyor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  tarihOnerildi: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  uretimUyumDegil: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  onaylandi: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

const grafikTooltip = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "var(--popover-foreground)",
};

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
  const [ayOfset, setAyOfset] = React.useState(0);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <Skeleton className="h-[460px] w-full xl:col-span-2" />
          <Skeleton className="h-[460px] w-full" />
        </div>
      </div>
    );
  }

  const taban = new Date(data.takvim.yil, data.takvim.ay + ayOfset, 1);
  const yil = taban.getFullYear();
  const ay = taban.getMonth();
  const buAy = ayOfset === 0;
  const izgara = ayIzgarasi(yil, ay);
  const bugun = new Date();

  const olayMap = new Map<number, typeof data.takvim.olaylar>();
  if (buAy) {
    for (const o of data.takvim.olaylar) {
      const l = olayMap.get(o.gun) ?? [];
      l.push(o);
      olayMap.set(o.gun, l);
    }
  }

  const formToplam = Math.max(...data.formOran.map((f) => f.oran), 100);

  return (
    <div className="space-y-6">
      {/* ====================== HERO ====================== */}
      <div className="relative overflow-hidden rounded-2xl border">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/login-bakim.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/55 to-slate-900/15" />
        <div className="relative flex items-start justify-between gap-4 p-6 sm:p-8">
          <div className="max-w-md text-white">
            <h2 className="font-heading text-2xl leading-tight font-bold sm:text-3xl">
              {t("Kesintisiz Üretim")}<br />{t("Daha Güçlü Yarınlar")}
            </h2>
            <p className="mt-2 text-sm text-white/80">{t("Güvenilir bakım, sürdürülebilir üretim.")}</p>
            <span className="mt-3 block h-1 w-12 rounded-full bg-blue-400" />
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur sm:flex dark:bg-slate-900/80 dark:text-slate-200">
            <Icon icon="solar:leaf-bold-duotone" className="size-5 text-emerald-500" />
            <span className="leading-tight">{t("Daha Verimli")}<br />{t("Daha Sürdürülebilir")}<br />{t("Üretim İçin")}</span>
          </div>
        </div>
      </div>

      {/* ====================== KPI ====================== */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {data.kpiler.map((k) => (
          <Card key={k.anahtar}>
            <CardContent className="relative flex items-center gap-3 p-4">
              <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", KPI_RENK[k.renk] ?? KPI_RENK.slate)}>
                <Icon icon={k.ikon} className="size-6" />
              </span>
              <div className="min-w-0">
                <p className="font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</p>
                <p className="text-xs leading-tight text-muted-foreground">{t(k.baslik)}</p>
              </div>
              {k.bilgi ? <Icon icon="solar:info-circle-linear" className="absolute top-3 right-3 size-4 text-muted-foreground/60" /> : null}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ============== Takvim + sağ paneller ============== */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Bu Ayki Bakım Takvimi */}
        <Card className="flex flex-col xl:col-span-2">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
            <div className="flex items-center gap-2">
              <Icon icon="solar:calendar-bold-duotone" className="size-5 text-blue-500" />
              <h3 className="font-heading text-base font-medium">{t("Bu Ayki Bakım Takvimi")}</h3>
              <div className="ml-1 flex items-center gap-0.5">
                <button type="button" onClick={() => setAyOfset((o) => o - 1)} aria-label={t("Önceki ay")} className="flex size-6 items-center justify-center rounded-md border bg-card text-muted-foreground hover:bg-muted">
                  <Icon icon="solar:alt-arrow-left-linear" className="size-3.5" />
                </button>
                <button type="button" onClick={() => setAyOfset((o) => o + 1)} aria-label={t("Sonraki ay")} className="flex size-6 items-center justify-center rounded-md border bg-card text-muted-foreground hover:bg-muted">
                  <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
                </button>
              </div>
              <span className="ml-1 font-heading text-sm font-semibold tabular-nums">{t(AY_ADLARI[ay])} {yil}</span>
            </div>
            <div className="flex items-center gap-2">
              <Filtre etiket="Tüm Bakım Türleri" />
              <Filtre etiket="Tüm Durumlar" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2">
            <div className="grid grid-cols-7 gap-1">
              {GUN_KISA.map((g) => (
                <div key={g} className="text-center text-[11px] font-medium text-muted-foreground">{t(g)}</div>
              ))}
            </div>
            <div className="grid flex-1 grid-cols-7 grid-rows-6 gap-1">
              {izgara.map((d, i) => {
                const disAy = d.getMonth() !== ay;
                const olaylar = !disAy ? olayMap.get(d.getDate()) ?? [] : [];
                const buGun = ayniGun(d, bugun) && buAy;
                return (
                  <div key={i} className={cn("flex min-h-[72px] flex-col gap-1 overflow-hidden rounded-lg border p-1", disAy ? "bg-muted/30" : "bg-card")}>
                    <span className={cn(
                      "flex size-5 items-center justify-center self-start rounded-full text-[11px] tabular-nums",
                      disAy ? "text-muted-foreground/50" : buGun ? "bg-blue-600 font-semibold text-white" : "font-medium",
                    )}>
                      {d.getDate()}
                    </span>
                    {olaylar.map((o, j) => {
                      const m = TAKVIM_META[o.tip];
                      return (
                        <div key={j} className={cn("rounded px-1 py-0.5 leading-tight", m.kutu)}>
                          <span className="flex items-center gap-1 text-[10px] font-semibold">
                            <span className="size-1.5 shrink-0 rounded-full" style={{ background: m.dot }} />
                            <span className={cn("truncate", m.metin)}>{o.kod}</span>
                          </span>
                          <span className="block truncate text-[9px] text-muted-foreground">{t(m.etiket)}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            {/* Lejant */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              {TAKVIM_SIRA.map((tip) => (
                <span key={tip} className="inline-flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ background: TAKVIM_META[tip].dot }} />
                  {t(TAKVIM_META[tip].etiket)}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sağ paneller */}
        <div className="space-y-6">
          {/* Bu Ay Planlanan Bakımlar */}
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
              <div className="flex items-center gap-2">
                <Icon icon="solar:clipboard-list-bold-duotone" className="size-5 text-blue-500" />
                <h3 className="font-heading text-base font-medium">{t("Bu Ay Planlanan Bakımlar")}</h3>
              </div>
              <Link href="/bakim/planlar" className="inline-flex items-center gap-0.5 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
                {t("Detaylar")} <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {data.buAyPlanlanan.dilimler.map((d) => (
                <div key={d.etiket} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: d.renk }} />
                    {t(d.etiket)}
                  </span>
                  <span className="font-semibold tabular-nums">{d.adet}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-2.5 text-sm font-semibold">
                <span>{t("Toplam")}</span>
                <span className="tabular-nums">{data.buAyPlanlanan.toplam}</span>
              </div>
            </CardContent>
          </Card>

          {/* Periyodik Bakım Dağılımı */}
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Icon icon="solar:pie-chart-2-bold-duotone" className="size-5 text-blue-500" />
              <h3 className="font-heading text-base font-medium">{t("Periyodik Bakım Dağılımı")} <span className="font-normal text-muted-foreground">(2026)</span></h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-32 w-32 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip contentStyle={grafikTooltip} formatter={(v, n) => [`${v}`, t(String(n))]} />
                      <Pie data={data.periyodikDagilim.dilimler} dataKey="adet" nameKey="etiket" innerRadius={40} outerRadius={60} paddingAngle={2} isAnimationActive={false}>
                        {data.periyodikDagilim.dilimler.map((d) => <Cell key={d.etiket} fill={d.renk} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-heading text-xl font-bold tabular-nums">{data.periyodikDagilim.toplam}</span>
                    <span className="text-[10px] text-muted-foreground">{t("Toplam")}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2 text-sm">
                  {data.periyodikDagilim.dilimler.map((d) => (
                    <div key={d.etiket} className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: d.renk }} />
                        {t(d.etiket)}
                      </span>
                      <span className="font-semibold tabular-nums">{d.adet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bu Ay Tamamlanan */}
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Icon icon="solar:check-circle-bold-duotone" className="size-5 text-emerald-500" />
              <h3 className="font-heading text-base font-medium">{t("Bu Ay Tamamlanan")}</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${data.buAyTamamlanan.yuzde}%` }} />
                </span>
                <span className="font-heading text-lg font-bold tabular-nums">%{data.buAyTamamlanan.yuzde}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("Tamamlanan Bakım")}</span>
                <span className="font-semibold tabular-nums">{data.buAyTamamlanan.tamamlanan}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("Planlanan Bakım")}</span>
                <span className="font-semibold tabular-nums">{data.buAyTamamlanan.planlanan}</span>
              </div>
            </CardContent>
          </Card>

          {/* Planlama Durumu */}
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
              <div className="flex items-center gap-2">
                <Icon icon="solar:document-text-bold-duotone" className="size-5 text-blue-500" />
                <h3 className="font-heading text-base font-medium">{t("Planlama Durumu")}</h3>
              </div>
              <Link href="/bakim/is-emirleri" className="inline-flex items-center gap-0.5 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
                {t("Detaylar")} <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {data.planlamaDurumu.map((d) => (
                <div key={d.etiket} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: d.renk }} />
                    {t(d.etiket)}
                  </span>
                  <span className="font-semibold tabular-nums">{d.adet}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ============== Haftalık Form Isı Haritası (tam genişlik) ============== */}
      <Card>
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <Icon icon="solar:clipboard-check-bold-duotone" className="size-5 text-blue-500" />
          <h3 className="font-heading text-base font-medium">{t("Haftalık Form Tamamlama Takibi")} <span className="font-normal text-muted-foreground">({t("Son 8 Hafta")})</span></h3>
          </CardHeader>
          <CardContent className="space-y-3 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="pr-3 pb-1.5 text-left text-xs font-medium text-muted-foreground">{t("Makine")}</th>
                  {data.formTakip.haftalar.map((h) => (
                    <th key={h} className="px-1 pb-1.5 text-center text-[11px] font-medium whitespace-nowrap text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.formTakip.satirlar.map((s) => (
                  <tr key={s.makine}>
                    <td className="py-1.5 pr-3 text-sm font-medium whitespace-nowrap">{s.makine}</td>
                    {s.haftalar.map((h, i) => (
                      <td key={i} className="px-1 py-1.5">
                        <span className={cn("block h-6 rounded", FORM_RENK[h])} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-emerald-400 dark:bg-emerald-500" /> {t("Tamamlandı")}</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-amber-300 dark:bg-amber-500/80" /> {t("Eksik")}</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-slate-200 dark:bg-slate-700" /> {t("Uygulanmadı")}</span>
            </div>
          </CardContent>
      </Card>

      {/* ============== Form Oranı + Yaklaşan + Son Tamamlanan ============== */}
      <div className="grid gap-6 xl:grid-cols-3">
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Icon icon="solar:chart-2-bold-duotone" className="size-5 text-blue-500" />
              <h3 className="font-heading text-sm font-medium">{t("Haftalık Form Tamamlama Oranı")}</h3>
            </CardHeader>
            <CardContent>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.formOran} margin={{ left: -20, right: 4, top: 16, bottom: 0 }}>
                    <XAxis dataKey="hafta" tickLine={false} axisLine={false} fontSize={9} stroke="var(--muted-foreground)" interval={0} />
                    <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(v) => `%${v}`} tickLine={false} axisLine={false} fontSize={9} stroke="var(--muted-foreground)" width={34} />
                    <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} contentStyle={grafikTooltip} formatter={(v) => [`%${v}`, t("Uyum")]} />
                    <Bar dataKey="oran" fill="#3b82f6" radius={[3, 3, 0, 0]} maxBarSize={26} isAnimationActive={false}>
                      <LabelList dataKey="oran" position="top" className="fill-foreground" fontSize={9} formatter={(v) => `%${v}`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
              <div className="flex items-center gap-2">
                <Icon icon="solar:clock-circle-bold-duotone" className="size-5 text-blue-500" />
                <h3 className="font-heading text-sm font-medium">{t("Yaklaşan Periyodik Bakımlar")}</h3>
              </div>
              <Link href="/bakim/takvim" className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">{t("Tümünü Gör")}</Link>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b text-left text-[11px] text-muted-foreground">
                    <th className="pr-2 pb-1.5 font-medium">{t("Tarih")}</th>
                    <th className="pr-2 pb-1.5 font-medium">{t("Makine")}</th>
                    <th className="pr-2 pb-1.5 font-medium">{t("Bakım Türü")}</th>
                    <th className="pb-1.5 font-medium">{t("Planlanan Durum")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.yaklasanPeriyodik.map((y) => (
                    <tr key={y.tarih + y.makine} className="border-b last:border-0">
                      <td className="py-1.5 pr-2 tabular-nums whitespace-nowrap">{y.tarih}</td>
                      <td className="py-1.5 pr-2 font-medium whitespace-nowrap">{y.makine}</td>
                      <td className="py-1.5 pr-2 whitespace-nowrap">{t(y.bakimTuru)}</td>
                      <td className="py-1.5">
                        <span className={cn("inline-block rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap", DURUM_RENK[y.durumTipi])}>
                          {t(y.durum)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

        {/* Son Tamamlanan Bakımlar */}
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <div className="flex items-center gap-2">
              <Icon icon="solar:check-read-bold-duotone" className="size-5 text-emerald-500" />
              <h3 className="font-heading text-sm font-medium">{t("Son Tamamlanan Bakımlar")}</h3>
            </div>
            <Link href="/bakim/kayitlar" className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">{t("Tümünü Gör")}</Link>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="border-b text-left text-[11px] text-muted-foreground">
                  <th className="pr-2 pb-1.5 font-medium">{t("Tarih")}</th>
                  <th className="pr-2 pb-1.5 font-medium">{t("Makine")}</th>
                  <th className="pr-2 pb-1.5 font-medium">{t("Bakım Türü")}</th>
                  <th className="pb-1.5 font-medium">{t("Açıklama")}</th>
                </tr>
              </thead>
              <tbody>
                {data.sonTamamlanan.map((r) => (
                  <tr key={r.tarih + r.makine} className="border-b last:border-0">
                    <td className="py-1.5 pr-2 tabular-nums whitespace-nowrap">{r.tarih}</td>
                    <td className="py-1.5 pr-2 font-medium whitespace-nowrap">{r.makine}</td>
                    <td className="py-1.5 pr-2 whitespace-nowrap">{t(r.bakimTuru)}</td>
                    <td className="py-1.5 text-muted-foreground">{t(r.aciklama)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
