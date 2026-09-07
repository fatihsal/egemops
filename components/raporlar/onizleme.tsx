"use client";

import { Icon } from "@iconify/react";
import {
  Area,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { raporOnizlemeGetir } from "@/lib/data/rapor-onizleme";
import { cn } from "@/lib/utils";
import type { OnizlemeKpi, RaporKategoriAnahtar } from "@/lib/types";

function Delta({ k }: { k: OnizlemeKpi }) {
  if (!k.degisim) return <span className="text-[11px] text-muted-foreground">— sabit</span>;
  const artis = k.degisim > 0;
  const iyi = (artis && k.iyiYon === "artis") || (!artis && k.iyiYon === "azalis");
  return (
    <span className={cn("inline-flex items-center gap-1 text-[11px] font-medium", iyi ? "text-emerald-600" : "text-red-500")}>
      <Icon icon={artis ? "solar:arrow-right-up-linear" : "solar:arrow-right-down-linear"} className="size-3.5" />
      %{Math.abs(k.degisim).toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      <span className="text-muted-foreground">önceki döneme göre</span>
    </span>
  );
}

export function RaporOnizlemeIcerik({ kategori }: { kategori: RaporKategoriAnahtar }) {
  const d = raporOnizlemeGetir(kategori);
  const toplamDagilim = d.dagilim.reduce((t, x) => t + x.deger, 0);

  return (
    <div className="space-y-6">
      {/* Yönetim Özeti */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-base font-medium">Yönetim Özeti</h3>
        </CardHeader>
        <CardContent>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground">{d.ozet}</p>
        </CardContent>
      </Card>

      {/* KPI Alanları */}
      <div>
        <h3 className="mb-3 font-heading text-base font-medium">Temel Göstergeler</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {d.kpiler.map((k) => (
            <Card key={k.baslik} className="h-full">
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">{k.baslik}</p>
                <p className="flex items-baseline gap-1">
                  <span className="font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</span>
                  {k.birim ? <span className="text-xs font-medium text-muted-foreground">{k.birim}</span> : null}
                </p>
                <Delta k={k} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <h3 className="font-heading text-base font-medium">
              Aylık Gelişim <span className="text-sm font-normal text-muted-foreground">({d.birim})</span>
            </h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-teal-500" /> Bu Dönem</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-slate-300" /> Önceki Dönem</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={d.seri} margin={{ left: 4, right: 8, top: 10, bottom: 4 }}>
                  <defs>
                    <linearGradient id="onzArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="etiket" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(v, n) => [`${Number(v).toLocaleString("tr-TR")} ${d.birim}`, n === "buDonem" ? "Bu Dönem" : "Önceki Dönem"]}
                  />
                  <Area type="monotone" dataKey="buDonem" stroke="#14b8a6" strokeWidth={2.5} fill="url(#onzArea)" isAnimationActive={false} />
                  <Line type="monotone" dataKey="oncekiDonem" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader>
            <h3 className="font-heading text-base font-medium">{d.dagilimBaslik}</h3>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center gap-5">
            <div className="relative size-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={d.dagilim} dataKey="deger" nameKey="etiket" innerRadius={54} outerRadius={78} paddingAngle={2} stroke="var(--card)" strokeWidth={2} startAngle={90} endAngle={-270}>
                    {d.dagilim.map((x) => <Cell key={x.etiket} fill={x.renk} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                    formatter={(v, n) => [`${Number(v).toLocaleString("tr-TR")} ${d.birim}`, String(n)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-lg font-bold tracking-tight tabular-nums">{toplamDagilim.toLocaleString("tr-TR")}</span>
                <span className="text-[11px] text-muted-foreground">{d.birim}</span>
              </div>
            </div>
            <ul className="w-full space-y-2.5 text-sm">
              {d.dagilim.map((x) => (
                <li key={x.etiket} className="flex items-center gap-2.5">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: x.renk }} />
                  <span className="flex-1 truncate text-muted-foreground">{x.etiket}</span>
                  <span className="font-medium tabular-nums">{x.deger.toLocaleString("tr-TR")}</span>
                  <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">%{Math.round((x.deger / toplamDagilim) * 100)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Detay Tablo */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-base font-medium">{d.tabloBaslik}</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-left text-xs text-muted-foreground">
                  {d.tabloKolonlar.map((c, i) => (
                    <th key={c} className={cn("px-3 py-2.5 font-medium whitespace-nowrap", i > 0 && "text-right")}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.tabloSatirlar.map((satir) => {
                  const degisim = satir[satir.length - 1];
                  const negatif = degisim.startsWith("-");
                  return (
                    <tr key={satir[0]} className="border-t odd:bg-muted/20">
                      {satir.map((h, i) => {
                        const son = i === satir.length - 1;
                        return (
                          <td key={i} className={cn("px-3 py-2.5 whitespace-nowrap tabular-nums", i === 0 ? "font-medium" : "text-right", i > 0 && i < satir.length - 1 && "text-muted-foreground", son && (negatif ? "text-red-500" : "text-emerald-600"), son && "font-medium")}>
                            {h}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Değerlendirme */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-base font-medium">Yorum / Değerlendirme</h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {d.degerlendirme.map((v, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300">
                  <Icon icon="solar:check-read-linear" className="size-3.5" />
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground">{v}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
