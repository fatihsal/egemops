"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BosDurum } from "@/components/common/bos-durum";
import { usePlanSayfa, useMakineler } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { csvIndir } from "@/lib/disa-aktar";
import { cn } from "@/lib/utils";
import type { GanttTip, PlanKayit, PlanSayfaDurum } from "@/lib/data/bakim/plan-sayfa";

const GANTT_META: Record<GanttTip, { etiket: string; renk: string }> = {
  "3aylik": { etiket: "3 Aylık Bakım", renk: "#3b82f6" },
  "6aylik": { etiket: "6 Aylık Bakım", renk: "#f59e0b" },
  "12aylik": { etiket: "12 Aylık Bakım", renk: "#a855f7" },
  haftalik: { etiket: "Haftalık Form", renk: "#10b981" },
  planlamaBekliyor: { etiket: "Planlama Bekliyor", renk: "#94a3b8" },
  gecikme: { etiket: "Gecikme", renk: "#ef4444" },
};
const GANTT_SIRA: GanttTip[] = ["3aylik", "6aylik", "12aylik", "haftalik", "planlamaBekliyor", "gecikme"];

const DURUM_META: Record<PlanSayfaDurum, { etiket: string; sinif: string; nokta: string }> = {
  aktif: { etiket: "Aktif", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", nokta: "bg-emerald-500" },
  devam: { etiket: "Devam Ediyor", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", nokta: "bg-blue-500" },
  tamamlandi: { etiket: "Tamamlandı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", nokta: "bg-emerald-500" },
  gecikme: { etiket: "Gecikme", sinif: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", nokta: "bg-red-500" },
  planlamaBekliyor: { etiket: "Planlama Bekliyor", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", nokta: "bg-slate-400" },
};
const PERIYOT_PILL: Record<string, string> = {
  "3 Aylık": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "6 Aylık": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "12 Aylık": "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};
const GUN = 31;

function basHarf(ad: string) {
  return ad.split(/\s+/).slice(0, 2).map((p) => p[0] ?? "").join("").toLocaleUpperCase("tr");
}
function barRenk(y: number) {
  return y >= 90 ? "bg-emerald-500" : y >= 70 ? "bg-blue-500" : y >= 40 ? "bg-amber-500" : "bg-red-500";
}

export function PlanListesi() {
  const { data, isLoading } = usePlanSayfa();
  const { data: makineler } = useMakineler();
  const { t } = useDil();

  const [arama, setArama] = React.useState("");
  const [makine, setMakine] = React.useState("hepsi");
  const [periyot, setPeriyot] = React.useState("hepsi");
  const [durum, setDurum] = React.useState("hepsi");
  const [gorunum, setGorunum] = React.useState<"liste" | "kart" | "gantt">("liste");

  const bugunGun = React.useMemo(() => { const d = new Date(); return d.getFullYear() === 2026 && d.getMonth() === 9 ? d.getDate() : null; }, []);

  if (isLoading || !data) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
        <Skeleton className="h-44 w-full" /><Skeleton className="h-64 w-full" /><Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const filtreli = data.kayitlar.filter((k) => {
    const q = arama.trim().toLocaleLowerCase("tr");
    if (makine !== "hepsi" && k.makine !== makine) return false;
    if (periyot !== "hepsi" && k.periyot !== periyot) return false;
    if (durum !== "hepsi" && k.durum !== durum) return false;
    if (q && !`${k.makine} ${k.bakimAd} ${k.sorumlu}`.toLocaleLowerCase("tr").includes(q)) return false;
    return true;
  });

  const kpi = [
    { anahtar: "makine", ik: "solar:settings-bold-duotone", g1: "#3b82f6", g2: "#2563eb", baslik: "Toplam Makine", deger: String(makineler?.length ?? data.makineKartlari.length) },
    { anahtar: "plan", ik: "solar:clipboard-check-bold-duotone", g1: "#34d399", g2: "#059669", baslik: "Toplam Bakım Planı", deger: "124" },
    { anahtar: "zamaninda", ik: "solar:check-circle-bold-duotone", g1: "#34d399", g2: "#059669", baslik: "Zamanında Tamamlama", deger: "%92", ring: 92 },
    { anahtar: "devam", ik: "solar:clock-circle-bold-duotone", g1: "#fbbf24", g2: "#d97706", baslik: "Devam Eden", deger: "7" },
    { anahtar: "geciken", ik: "solar:danger-triangle-bold-duotone", g1: "#f87171", g2: "#dc2626", baslik: "Geciken", deger: "5" },
    { anahtar: "buAy", ik: "solar:calendar-bold-duotone", g1: "#60a5fa", g2: "#2563eb", baslik: "Bu Ay Planlanan", deger: "Ekim 2026", alt: "22 Bakım", tarih: true },
  ];

  const makineAdlari = Array.from(new Set(data.kayitlar.map((k) => k.makine)));
  const periyotlar = ["3 Aylık", "6 Aylık", "12 Aylık"];

  function disaAktar() {
    const basliklar = ["#", t("Makine"), t("Bakım Adı"), t("Periyot"), t("Sorumlu"), t("Planlanan Tarih"), t("Durum"), t("Tamamlanma"), t("Son Tamamlanma")];
    const satirlar = filtreli.map((k) => [String(k.no), k.makine, t(k.bakimAd), k.periyot, k.sorumlu, k.planlananTarih, t(DURUM_META[k.durum].etiket), `%${k.tamamlanma}`, k.sonTamamlanma]);
    csvIndir("bakim-planlari", basliklar, satirlar);
    toast.success(`${filtreli.length} ${t("kayıt Excel'e aktarıldı")}`);
  }

  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpi.map((k) => (
          <Card key={k.anahtar} className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(15_23_42/0.4)]">
            <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full opacity-25 blur-2xl" style={{ background: k.g1 }} />
            <CardContent className="relative flex items-center gap-3 p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-white/20" style={{ background: `linear-gradient(135deg, ${k.g1}, ${k.g2})`, boxShadow: `0 8px 20px -8px ${k.g2}` }}><Icon icon={k.ik} className="size-6" /></span>
              <div className="min-w-0">
                {k.tarih ? <p className="font-heading text-base font-bold tracking-tight">{t(k.deger)}</p> : <p className="font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</p>}
                <p className="truncate text-xs text-muted-foreground">{t(k.baslik)}{k.alt ? ` · ${t(k.alt)}` : ""}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Makine Bazlı Plan Durumu */}
      <Card>
        <CardHeader><h3 className="font-heading text-lg font-bold tracking-tight">{t("Makine Bazlı Plan Durumu")}</h3></CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {data.makineKartlari.map((m) => (
              <div key={m.makineId} className="flex min-w-[210px] flex-col gap-2 rounded-xl border p-3 transition-colors hover:border-blue-300 dark:hover:border-blue-800">
                <div className="flex h-16 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 dark:from-slate-800 dark:to-slate-900"><Icon icon="solar:cpu-bolt-bold-duotone" className="size-8" /></div>
                <div><p className="font-semibold">{m.ad}</p><p className="text-xs text-muted-foreground tabular-nums">{m.kod}</p></div>
                <div className="flex items-center gap-2"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><span className={cn("block h-full rounded-full", barRenk(m.yuzde))} style={{ width: `${m.yuzde}%` }} /></span><span className="text-xs font-semibold tabular-nums">%{m.yuzde}</span></div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Icon icon="solar:clipboard-list-bold" className="size-3" />{m.planSayi} {t("Plan")}</span>
                  <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium", m.gecikme > 0 ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300")}><Icon icon={m.gecikme > 0 ? "solar:danger-triangle-bold" : "solar:check-circle-bold"} className="size-3" />{m.gecikme} {t("Gecikme")}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Araç çubuğu */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={makine} onValueChange={(v) => setMakine(v ?? "hepsi")}><SelectTrigger size="sm" className="w-[150px] bg-card"><SelectValue placeholder={t("Tüm Makineler")} /></SelectTrigger><SelectContent><SelectItem value="hepsi">{t("Tüm Makineler")}</SelectItem>{makineAdlari.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
        <Select value={periyot} onValueChange={(v) => setPeriyot(v ?? "hepsi")}><SelectTrigger size="sm" className="w-[140px] bg-card"><SelectValue placeholder={t("Tüm Periyotlar")} /></SelectTrigger><SelectContent><SelectItem value="hepsi">{t("Tüm Periyotlar")}</SelectItem>{periyotlar.map((p) => <SelectItem key={p} value={p}>{t(p)}</SelectItem>)}</SelectContent></Select>
        <Select value={durum} onValueChange={(v) => setDurum(v ?? "hepsi")}><SelectTrigger size="sm" className="w-[150px] bg-card"><SelectValue placeholder={t("Tüm Durumlar")} /></SelectTrigger><SelectContent><SelectItem value="hepsi">{t("Tüm Durumlar")}</SelectItem>{(Object.keys(DURUM_META) as PlanSayfaDurum[]).map((d) => <SelectItem key={d} value={d}>{t(DURUM_META[d].etiket)}</SelectItem>)}</SelectContent></Select>
        <div className="relative min-w-[180px] flex-1"><Icon icon="solar:magnifer-linear" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={arama} onChange={(e) => setArama(e.target.value)} placeholder={t("Bakım adı veya makine ara…")} className="h-9 bg-card pl-9" /></div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t("Görünüm")}:</span>
          {(["liste", "kart", "gantt"] as const).map((g) => (
            <button key={g} type="button" onClick={() => setGorunum(g)} className={cn("rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors", gorunum === g ? "border-blue-600 bg-blue-600 text-white" : "border-border bg-card text-muted-foreground hover:bg-muted")}>{t(g === "liste" ? "Liste" : g === "kart" ? "Kart" : "Zaman Çizelgesi")}</button>
          ))}
          <Button size="sm" className="h-9 gap-1.5 bg-blue-600 text-white shadow-sm hover:bg-blue-700" onClick={() => toast(t("Bu özellik yakında eklenecek."))}><Icon icon="solar:add-circle-bold-duotone" className="size-4" />{t("Yeni Plan")}</Button>
        </div>
      </div>

      {/* Gantt */}
      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg font-bold tracking-tight">{t("Ekim 2026 Bakım Takvimi")}</h3>
            <div className="ml-1 flex items-center gap-0.5">
              <button type="button" onClick={() => toast(t("Bu özellik yakında eklenecek."))} className="flex size-6 items-center justify-center rounded-md border bg-card text-muted-foreground hover:bg-muted"><Icon icon="solar:alt-arrow-left-linear" className="size-3.5" /></button>
              <button type="button" onClick={() => toast(t("Bu özellik yakında eklenecek."))} className="flex size-6 items-center justify-center rounded-md border bg-card text-muted-foreground hover:bg-muted"><Icon icon="solar:alt-arrow-right-linear" className="size-3.5" /></button>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            {GANTT_SIRA.map((tip) => <span key={tip} className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: GANTT_META[tip].renk }} />{t(GANTT_META[tip].etiket)}</span>)}
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[100px_1fr] gap-y-1.5">
              <div />
              <div className="relative flex border-b pb-1">
                {Array.from({ length: GUN }, (_, i) => i + 1).map((g) => (
                  <div key={g} className={cn("flex-1 text-center text-[10px] tabular-nums", g === bugunGun ? "font-bold text-red-500" : "text-muted-foreground")}>{String(g).padStart(2, "0")}</div>
                ))}
              </div>
              {data.gantt.map((r) => (
                <React.Fragment key={r.makine}>
                  <div className="flex items-center truncate pr-2 text-xs font-medium">{r.makine}</div>
                  <div className="relative h-7 rounded bg-muted/30">
                    {bugunGun ? <div className="absolute top-0 bottom-0 z-10 w-px bg-red-500" style={{ left: `${((bugunGun - 0.5) / GUN) * 100}%` }} /> : null}
                    {r.cubuklar.map((c, i) => (
                      <div key={i} className="absolute top-1 h-5 rounded-md opacity-90" title={t(GANTT_META[c.tip].etiket)} style={{ left: `${((c.bas - 1) / GUN) * 100}%`, width: `${((c.bit - c.bas + 1) / GUN) * 100}%`, background: GANTT_META[c.tip].renk }} />
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Planlı Bakım Listesi */}
      {gorunum !== "gantt" ? (
        <Card className="flex min-w-0 flex-col">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
            <h3 className="font-heading text-lg font-bold tracking-tight">{t("Planlı Bakım Listesi")} <span className="text-sm font-normal text-muted-foreground">({filtreli.length} {t("kayıt")})</span></h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-card text-xs" onClick={() => toast(t("Bu özellik yakında eklenecek."))}><Icon icon="solar:checklist-bold-duotone" className="size-4" />{t("Toplu İşlem")}</Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-card text-xs" onClick={disaAktar}><Icon icon="vscode-icons:file-type-excel" className="size-4" />{t("Excel Aktar")}</Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col p-0">
            {filtreli.length === 0 ? (
              <BosDurum baslik={t("Kayıt bulunamadı")} aciklama={t("Arama veya filtre kriterlerine uygun plan yok.")} />
            ) : gorunum === "liste" ? (
              <div className="flex-1 overflow-x-auto">
                <table className="h-full w-full caption-bottom text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>{t("Makine")}</TableHead>
                      <TableHead>{t("Bakım Adı")}</TableHead>
                      <TableHead>{t("Periyot")}</TableHead>
                      <TableHead>{t("Sorumlu")}</TableHead>
                      <TableHead className="text-center">{t("Planlanan")}</TableHead>
                      <TableHead>{t("Durum")}</TableHead>
                      <TableHead>{t("Tamamlanma")}</TableHead>
                      <TableHead className="text-right">{t("Aksiyon")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtreli.map((k) => {
                      const dm = DURUM_META[k.durum];
                      return (
                        <TableRow key={k.no}>
                          <TableCell className="tabular-nums text-muted-foreground">{k.no}</TableCell>
                          <TableCell className="font-medium whitespace-nowrap">{k.makine}</TableCell>
                          <TableCell className="whitespace-nowrap">{t(k.bakimAd)}</TableCell>
                          <TableCell><span className={cn("inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium", PERIYOT_PILL[k.periyot] ?? "bg-muted")}>{t(k.periyot)}</span></TableCell>
                          <TableCell><span className="inline-flex items-center gap-1.5 whitespace-nowrap"><span className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{basHarf(k.sorumlu)}</span>{k.sorumlu}</span></TableCell>
                          <TableCell className="text-center tabular-nums whitespace-nowrap">{k.planlananTarih}</TableCell>
                          <TableCell><span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", dm.sinif)}><span className={cn("size-1.5 rounded-full", dm.nokta)} />{t(dm.etiket)}</span></TableCell>
                          <TableCell><div className="flex items-center gap-2"><span className="h-1.5 w-20 overflow-hidden rounded-full bg-muted"><span className={cn("block h-full rounded-full", barRenk(k.tamamlanma))} style={{ width: `${k.tamamlanma}%` }} /></span><span className="text-xs tabular-nums text-muted-foreground">%{k.tamamlanma}</span></div></TableCell>
                          <TableCell><div className="flex items-center justify-end gap-1"><Button variant="outline" size="sm" className="h-7 gap-1 bg-card text-xs" onClick={() => toast(t("Bu özellik yakında eklenecek."))}><Icon icon="solar:document-text-linear" className="size-3.5" />{t("Detay")}</Button></div></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtreli.map((k) => {
                  const dm = DURUM_META[k.durum];
                  return (
                    <div key={k.no} className="space-y-2 rounded-xl border p-3">
                      <div className="flex items-center justify-between gap-2"><span className="font-medium">{k.makine}</span><span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", dm.sinif)}><span className={cn("size-1.5 rounded-full", dm.nokta)} />{t(dm.etiket)}</span></div>
                      <p className="text-sm text-muted-foreground">{t(k.bakimAd)} · <span className={cn("rounded px-1 py-0.5 text-[10px] font-medium", PERIYOT_PILL[k.periyot] ?? "")}>{t(k.periyot)}</span></p>
                      <div className="flex items-center gap-2"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><span className={cn("block h-full rounded-full", barRenk(k.tamamlanma))} style={{ width: `${k.tamamlanma}%` }} /></span><span className="text-xs tabular-nums">%{k.tamamlanma}</span></div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{k.sorumlu}</span><span className="tabular-nums">{k.planlananTarih}</span></div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
