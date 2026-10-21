"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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
import { useMakineler } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { KRITIKLIK_META, MAKINE_DURUM_META } from "@/components/bakim/makineler/stiller";
import { tarihAyristir } from "@/lib/bakim/tarih";
import type { Kritiklik, Makine, MakineDurum } from "@/lib/types/bakim";

const BOLUM_IKON: Record<string, string> = {
  Laminasyon: "solar:layers-bold-duotone",
  Kesim: "solar:scissors-square-bold-duotone",
  Baskı: "solar:printer-bold-duotone",
  Yaldız: "solar:stars-bold-duotone",
  Dönüşüm: "solar:refresh-circle-bold-duotone",
  Kalite: "solar:eye-scan-bold-duotone",
  Sevkiyat: "solar:box-bold-duotone",
};
const VARSAYILAN_IKON = "solar:cpu-bolt-bold-duotone";
const PALET = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#14b8a6", "#64748b"];
const grafikTooltip = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" };

function gunKaldi(tarih: string | undefined, bugun: Date): number | null {
  if (!tarih) return null;
  return Math.round((tarihAyristir(tarih).getTime() - bugun.getTime()) / 86400000);
}
function gunRenk(g: number): string {
  return g <= 7 ? "text-red-600 dark:text-red-400" : g <= 21 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400";
}
function gunPil(g: number): string {
  return g <= 7
    ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
    : g <= 21
      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
}

export function MakineListesi() {
  const { data, isLoading } = useMakineler();
  const { t } = useDil();
  const router = useRouter();
  const bugun = React.useMemo(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }, []);

  const [arama, setArama] = React.useState("");
  const [bolum, setBolum] = React.useState("hepsi");
  const [grup, setGrup] = React.useState("hepsi");
  const [kritiklik, setKritiklik] = React.useState("hepsi");
  const [durum, setDurum] = React.useState("hepsi");
  const [gorunum, setGorunum] = React.useState<"tablo" | "kart">("tablo");
  const [seciliId, setSeciliId] = React.useState<string | null>(null);

  const bolumler = React.useMemo(() => Array.from(new Set((data ?? []).map((m) => m.bolum))).sort(), [data]);
  const gruplar = React.useMemo(() => Array.from(new Set((data ?? []).map((m) => m.grup))).sort(), [data]);

  const filtreli = React.useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    return (data ?? []).filter((m) => {
      if (bolum !== "hepsi" && m.bolum !== bolum) return false;
      if (grup !== "hepsi" && m.grup !== grup) return false;
      if (kritiklik !== "hepsi" && m.kritiklik !== kritiklik) return false;
      if (durum !== "hepsi" && (m.durum ?? "aktif") !== durum) return false;
      if (q && !`${m.ad} ${m.kod} ${m.seriNo ?? ""}`.toLocaleLowerCase("tr").includes(q)) return false;
      return true;
    });
  }, [data, arama, bolum, grup, kritiklik, durum]);

  React.useEffect(() => { if (data && data.length && !seciliId) setSeciliId(data[0].id); }, [data, seciliId]);

  if (isLoading || !data) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
        <div className="grid gap-5 xl:grid-cols-3"><Skeleton className="h-96 w-full xl:col-span-2" /><Skeleton className="h-96 w-full" /></div>
      </div>
    );
  }

  const secili = data.find((m) => m.id === seciliId) ?? data[0];
  const kritikSay = data.filter((m) => m.kritiklik === "yuksek" || m.kritiklik === "kritik").length;
  const aktifSop = data.reduce((a, m) => a + (m.sopSayi ?? 0), 0);
  const bolumSay = bolumler.length;

  const yaklasan = data
    .map((m) => ({ m, gun: gunKaldi(m.sonrakiBakim, bugun) }))
    .filter((x): x is { m: Makine; gun: number } => x.gun !== null && x.gun >= 0 && x.gun <= 60)
    .sort((a, b) => a.gun - b.gun)
    .slice(0, 5);

  const bolumDagilim = bolumler.map((b, i) => ({ bolum: b, adet: data.filter((m) => m.bolum === b).length, renk: PALET[i % PALET.length] }));

  const kpi = [
    { ik: "solar:posts-carousel-horizontal-bold-duotone", g1: "#3b82f6", g2: "#2563eb", baslik: "Toplam Makine", deger: String(data.length) },
    { ik: "solar:danger-triangle-bold-duotone", g1: "#f87171", g2: "#dc2626", baslik: "Kritik Ekipman", deger: String(kritikSay) },
    { ik: "solar:calendar-mark-bold-duotone", g1: "#fbbf24", g2: "#d97706", baslik: "Yaklaşan Bakım", deger: String(yaklasan.length) },
    { ik: "solar:document-text-bold-duotone", g1: "#2dd4bf", g2: "#0d9488", baslik: "Aktif SOP", deger: String(aktifSop) },
    { ik: "solar:pen-new-square-bold-duotone", g1: "#818cf8", g2: "#4f46e5", baslik: "Bu Ay Güncellenen Kayıt", deger: "9" },
    { ik: "solar:buildings-2-bold-duotone", g1: "#c084fc", g2: "#9333ea", baslik: "Bölüm Sayısı", deger: String(bolumSay) },
  ];

  const secGun = gunKaldi(secili.sonrakiBakim, bugun);
  const secKrit = KRITIKLIK_META[secili.kritiklik];
  const secDurum = MAKINE_DURUM_META[secili.durum ?? "aktif"];

  return (
    <div className="space-y-5">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl border">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/login-bakim.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/55 to-slate-900/20" />
        <div className="relative flex items-start justify-between gap-4 p-6 sm:p-8">
          <div className="max-w-lg text-white">
            <h2 className="font-heading text-xl leading-snug font-bold sm:text-2xl">{t("Ekipmanlarınızı yönetin, bakım geçmişini izleyin ve periyodik planlamayı güçlendirin.")}</h2>
            <p className="mt-2 text-sm text-white/80">{t("Güvenilir ekipmanlar, kesintisiz üretim, sürdürülebilir başarı.")}</p>
          </div>
          <div className="hidden shrink-0 items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur sm:flex dark:bg-slate-900/80 dark:text-slate-200">
            <Icon icon="solar:leaf-bold-duotone" className="size-5 text-emerald-500" />
            <span className="leading-tight">{t("Daha iyi ambalajlar")}<br />{t("Daha temiz bir gelecek")}</span>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpi.map((k) => (
          <Card key={k.baslik} className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(15_23_42/0.4)]">
            <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-40" style={{ background: k.g1 }} />
            <CardContent className="relative p-4">
              <span className="flex size-11 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-white/20" style={{ background: `linear-gradient(135deg, ${k.g1}, ${k.g2})`, boxShadow: `0 8px 20px -8px ${k.g2}` }}>
                <Icon icon={k.ik} className="size-6" />
              </span>
              <p className="mt-3 truncate text-xs font-medium text-muted-foreground">{t(k.baslik)}</p>
              <p className="mt-0.5 font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tablo + sağ panel */}
      <div className="grid gap-5 xl:grid-cols-3">
        {/* Ekipman Listesi */}
        <Card className="flex min-w-0 flex-col xl:col-span-2">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3 space-y-0">
            <h3 className="font-heading text-lg font-bold tracking-tight">{t("Ekipman Listesi")}</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {(["aktif", "planli", "izlemede"] as MakineDurum[]).map((d) => (
                <span key={d} className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium", MAKINE_DURUM_META[d].sinif)}>
                  <span className={cn("size-1.5 rounded-full", MAKINE_DURUM_META[d].nokta)} />
                  {t(MAKINE_DURUM_META[d].etiket)}
                  <span className="tabular-nums">{data.filter((m) => (m.durum ?? "aktif") === d).length}</span>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {(["tablo", "kart"] as const).map((g) => (
                <button key={g} type="button" onClick={() => setGorunum(g)} className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors", gorunum === g ? "border-blue-600 bg-blue-600 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground")}>
                  <Icon icon={g === "tablo" ? "solar:list-bold" : "solar:widget-5-bold"} className="size-3.5" />{t(g === "tablo" ? "Tablo" : "Kart")}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3 p-3">
            {/* Filtreler */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[180px] flex-1">
                <Icon icon="solar:magnifer-linear" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={arama} onChange={(e) => setArama(e.target.value)} placeholder={t("Makine adı, kod veya seri no ara…")} className="h-8 bg-card pl-9 text-sm" />
              </div>
              <Select value={bolum} onValueChange={(v) => setBolum(v ?? "hepsi")}><SelectTrigger size="sm" className="w-[130px] bg-card"><SelectValue placeholder={t("Bölüm")} /></SelectTrigger><SelectContent><SelectItem value="hepsi">{t("Tüm Bölümler")}</SelectItem>{bolumler.map((b) => <SelectItem key={b} value={b}>{t(b)}</SelectItem>)}</SelectContent></Select>
              <Select value={grup} onValueChange={(v) => setGrup(v ?? "hepsi")}><SelectTrigger size="sm" className="w-[150px] bg-card"><SelectValue placeholder={t("Makine Grubu")} /></SelectTrigger><SelectContent><SelectItem value="hepsi">{t("Tüm Makine Grupları")}</SelectItem>{gruplar.map((g) => <SelectItem key={g} value={g}>{t(g)}</SelectItem>)}</SelectContent></Select>
              <Select value={kritiklik} onValueChange={(v) => setKritiklik(v ?? "hepsi")}><SelectTrigger size="sm" className="w-[120px] bg-card"><SelectValue placeholder={t("Kritiklik")} /></SelectTrigger><SelectContent><SelectItem value="hepsi">{t("Tüm Kritiklik")}</SelectItem>{(["kritik", "yuksek", "orta", "dusuk"] as Kritiklik[]).map((k) => <SelectItem key={k} value={k}>{t(KRITIKLIK_META[k].etiket)}</SelectItem>)}</SelectContent></Select>
              <Select value={durum} onValueChange={(v) => setDurum(v ?? "hepsi")}><SelectTrigger size="sm" className="w-[140px] bg-card"><SelectValue placeholder={t("Durum")} /></SelectTrigger><SelectContent><SelectItem value="hepsi">{t("Tüm Bakım Durumu")}</SelectItem>{(["aktif", "planli", "izlemede"] as MakineDurum[]).map((d) => <SelectItem key={d} value={d}>{t(MAKINE_DURUM_META[d].etiket)}</SelectItem>)}</SelectContent></Select>
            </div>

            {filtreli.length === 0 ? (
              <BosDurum baslik={t("Makine bulunamadı")} aciklama={t("Arama veya filtre kriterlerine uygun makine yok.")} />
            ) : gorunum === "tablo" ? (
              <div className="flex-1 overflow-x-auto">
                <table className="h-full w-full caption-bottom text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("Makine Adı")}</TableHead>
                      <TableHead>{t("Kritiklik")}</TableHead>
                      <TableHead className="text-center">{t("Sonraki Bakım")}</TableHead>
                      <TableHead className="text-center">{t("Plan")}</TableHead>
                      <TableHead className="text-center">{t("SOP")}</TableHead>
                      <TableHead>{t("Durum")}</TableHead>
                      <TableHead className="text-right">{t("İşlem")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtreli.map((m) => {
                      const krit = KRITIKLIK_META[m.kritiklik];
                      const dm = MAKINE_DURUM_META[m.durum ?? "aktif"];
                      return (
                        <TableRow key={m.id} onClick={() => setSeciliId(m.id)} className={cn("cursor-pointer border-l-2 border-l-transparent transition-colors", m.id === seciliId ? "border-l-blue-500 bg-blue-50/70 dark:bg-blue-950/40" : "hover:bg-muted/50")}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"><Icon icon={BOLUM_IKON[m.bolum] ?? VARSAYILAN_IKON} className="size-4" /></span>
                              <span className="min-w-0">
                                <span className="block truncate font-medium">{m.ad}</span>
                                <span className="block text-[11px] text-muted-foreground">{m.kod} · {t(m.bolum)}</span>
                              </span>
                            </div>
                          </TableCell>
                          <TableCell><span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", krit.sinif)}><span className={cn("size-1.5 rounded-full", krit.nokta)} />{t(krit.etiket)}</span></TableCell>
                          <TableCell className="text-center tabular-nums whitespace-nowrap">{m.sonrakiBakim ?? "—"}</TableCell>
                          <TableCell className="text-center">{m.aktifPlanKodu ? <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{t("Var")}</span> : <span className="text-xs text-muted-foreground">{t("Yok")}</span>}</TableCell>
                          <TableCell className="text-center tabular-nums">{m.sopSayi ?? 0}</TableCell>
                          <TableCell><span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", dm.sinif)}><span className={cn("size-1.5 rounded-full", dm.nokta)} />{t(dm.etiket)}</span></TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-0.5">
                              <button type="button" onClick={(e) => { e.stopPropagation(); setSeciliId(m.id); }} aria-label={t("Görüntüle")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Icon icon="solar:eye-linear" className="size-4" /></button>
                              <button type="button" onClick={(e) => { e.stopPropagation(); router.push(`/bakim/makineler/${m.id}`); }} aria-label={t("Detay")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Icon icon="solar:arrow-right-up-linear" className="size-4" /></button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </table>
              </div>
            ) : (
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                {filtreli.map((m) => {
                  const krit = KRITIKLIK_META[m.kritiklik];
                  const dm = MAKINE_DURUM_META[m.durum ?? "aktif"];
                  return (
                    <button key={m.id} type="button" onClick={() => setSeciliId(m.id)} className={cn("flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors", m.id === seciliId ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/40" : "hover:border-blue-300 dark:hover:border-blue-800")}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2"><span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"><Icon icon={BOLUM_IKON[m.bolum] ?? VARSAYILAN_IKON} className="size-4" /></span><span><span className="block font-medium">{m.ad}</span><span className="block text-[11px] text-muted-foreground">{m.kod}</span></span></div>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", dm.sinif)}><span className={cn("size-1.5 rounded-full", dm.nokta)} />{t(dm.etiket)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground"><span className={cn("inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium", krit.sinif)}>{t(krit.etiket)}</span><span>{t("Sonraki")}: {m.sonrakiBakim ?? "—"}</span></div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
              <span><span className="tabular-nums">{filtreli.length}</span> {t("kayıttan 1-")}{filtreli.length} {t("arası görüntüleniyor")}</span>
              <span className="inline-flex items-center gap-1 rounded-md border bg-card px-2 py-1 font-medium">1</span>
            </div>
          </CardContent>
        </Card>

        {/* Sağ panel */}
        <div className="space-y-5">
          {/* Ekipman Detayı */}
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
              <h3 className="font-heading text-lg font-bold tracking-tight">{t("Ekipman Detayı")}</h3>
              <Button size="sm" className="h-7 gap-1 bg-blue-600 text-white text-xs shadow-sm hover:bg-blue-700" onClick={() => toast(t("Bu özellik yakında eklenecek."))}><Icon icon="solar:pen-linear" className="size-3.5" />{t("Düzenle")}</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md ring-1 ring-white/20"><Icon icon={BOLUM_IKON[secili.bolum] ?? VARSAYILAN_IKON} className="size-8" /></span>
                <div><div className="flex items-center gap-2"><h4 className="font-heading text-lg font-bold">{secili.ad}</h4><span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", secDurum.sinif)}><span className={cn("size-1.5 rounded-full", secDurum.nokta)} />{t(secDurum.etiket)}</span></div><p className="text-xs text-muted-foreground">{secili.kod}</p></div>
              </div>
              <dl className="space-y-1.5 text-sm">
                {[
                  { e: "Seri No", d: secili.seriNo ?? "—" },
                  { e: "Marka / Model", d: `${secili.marka ?? ""} ${secili.model ?? ""}`.trim() || "—" },
                  { e: "Bölüm", d: t(secili.bolum) },
                  { e: "Makine Grubu", d: t(secili.grup) },
                ].map((r) => (<div key={r.e} className="flex items-center justify-between gap-2 border-b border-dashed pb-1.5"><dt className="text-muted-foreground">{t(r.e)}</dt><dd className="text-right font-medium">{r.d}</dd></div>))}
                <div className="flex items-center justify-between gap-2 border-b border-dashed pb-1.5"><dt className="text-muted-foreground">{t("Kritiklik")}</dt><dd><span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", secKrit.sinif)}><span className={cn("size-1.5 rounded-full", secKrit.nokta)} />{t(secKrit.etiket)}</span></dd></div>
                <div className="flex items-center justify-between gap-2 border-b border-dashed pb-1.5"><dt className="text-muted-foreground">{t("Sonraki Bakım")}</dt><dd className="font-medium tabular-nums">{secili.sonrakiBakim ?? "—"}{secGun !== null && secGun >= 0 ? <span className={cn("ml-1 text-xs", gunRenk(secGun))}>({secGun} {t("gün kaldı")})</span> : null}</dd></div>
                <div className="flex items-center justify-between gap-2 border-b border-dashed pb-1.5"><dt className="text-muted-foreground">{t("Aktif Plan")}</dt><dd className="font-medium">{secili.aktifPlanKodu ? <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400"><Icon icon="solar:clipboard-list-linear" className="size-3.5" />{t("Var")} ({secili.aktifPlanKodu})</span> : t("Yok")}</dd></div>
                <div className="flex items-center justify-between gap-2"><dt className="text-muted-foreground">{t("Aktif SOP")}</dt><dd className="font-medium tabular-nums">{secili.sopSayi ?? 0} {t("adet")}</dd></div>
              </dl>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button size="sm" className="gap-1.5 bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm shadow-blue-500/30 hover:from-blue-600 hover:to-blue-800" nativeButton={false} render={<Link href={`/bakim/makineler/${secili.id}`} />}><Icon icon="solar:cpu-bolt-bold" className="size-4" />{t("Makine Detayı")}</Button>
                <Button variant="outline" size="sm" className="gap-1.5 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950" nativeButton={false} render={<Link href="/bakim/kayitlar" />}><Icon icon="solar:history-bold" className="size-4" />{t("Bakım Geçmişi")}</Button>
                <Button variant="outline" size="sm" className="gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950" nativeButton={false} render={<Link href="/bakim/sop" />}><Icon icon="solar:clipboard-list-bold" className="size-4" />{t("SOP Listesi")}</Button>
                <Button variant="outline" size="sm" className="gap-1.5 border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-950" nativeButton={false} render={<Link href="/bakim/dokumanlar" />}><Icon icon="solar:folder-bold" className="size-4" />{t("Dokümanlar")}</Button>
              </div>
            </CardContent>
          </Card>

          {/* Bölüm Dağılımı */}
          <Card>
            <CardHeader><h3 className="font-heading text-base font-bold tracking-tight">{t("Bölümlere Göre Ekipman Dağılımı")}</h3></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-32 w-32 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip contentStyle={grafikTooltip} formatter={(v, n) => [`${v}`, t(String(n))]} />
                      <Pie data={bolumDagilim} dataKey="adet" nameKey="bolum" innerRadius={40} outerRadius={60} paddingAngle={2} isAnimationActive={false}>{bolumDagilim.map((d) => <Cell key={d.bolum} fill={d.renk} />)}</Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="font-heading text-xl font-bold tabular-nums">{data.length}</span><span className="text-[10px] text-muted-foreground">{t("Makine")}</span></div>
                </div>
                <div className="flex-1 space-y-1 text-sm">
                  {bolumDagilim.map((d) => (<div key={d.bolum} className="flex items-center justify-between gap-2"><span className="inline-flex min-w-0 items-center gap-1.5"><span className="size-2.5 shrink-0 rounded-full" style={{ background: d.renk }} /><span className="truncate text-xs">{t(d.bolum)}</span></span><span className="font-semibold tabular-nums">{d.adet}</span></div>))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Yaklaşan Periyodik Bakımlar */}
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0"><h3 className="font-heading text-base font-bold tracking-tight">{t("Yaklaşan Periyodik Bakımlar")}</h3><Link href="/bakim/takvim" className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">{t("Tümünü Gör")}</Link></CardHeader>
            <CardContent className="space-y-2.5">
              {yaklasan.length === 0 ? <p className="py-4 text-center text-sm text-muted-foreground">{t("Yaklaşan bakım yok.")}</p> : yaklasan.map(({ m, gun }) => (
                <div key={m.id} className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-muted/50">
                  <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", gunPil(gun))}><Icon icon="solar:clock-circle-bold" className="size-4" /></span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{m.ad}</p><p className="text-xs text-muted-foreground tabular-nums">{m.sonrakiBakim}</p></div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums", gunPil(gun))}>{gun} {t("gün kaldı")}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
