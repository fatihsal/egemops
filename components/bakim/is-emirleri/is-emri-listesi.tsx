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
import { useIsEmriSayfa } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { csvIndir } from "@/lib/disa-aktar";
import { cn } from "@/lib/utils";
import { SOP_MADDE_HAVUZ, type IsEmriSatir, type IsEmriSayfaDurum } from "@/lib/data/bakim/is-emri-sayfa";

const DURUM_META: Record<IsEmriSayfaDurum, { etiket: string; sinif: string; nokta: string; ikon: string }> = {
  planlamaBekliyor: { etiket: "Planlama Bekliyor", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", nokta: "bg-slate-400", ikon: "solar:clock-circle-bold" },
  tarihKesinlesti: { etiket: "Tarih Kesinleşti", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", nokta: "bg-amber-500", ikon: "solar:calendar-mark-bold" },
  bakimaHazir: { etiket: "Bakıma Hazır", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", nokta: "bg-emerald-500", ikon: "solar:play-circle-bold" },
  bakimYapiliyor: { etiket: "Bakım Yapılıyor", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", nokta: "bg-blue-500", ikon: "solar:refresh-circle-bold" },
  tamamlandi: { etiket: "Tamamlandı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", nokta: "bg-emerald-500", ikon: "solar:check-circle-bold" },
  gecikme: { etiket: "Gecikme", sinif: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", nokta: "bg-red-500", ikon: "solar:danger-triangle-bold" },
};
const PERIYOT_PILL: Record<string, string> = {
  "3 Aylık": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "6 Aylık": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "12 Aylık": "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};
const MADDE_META: Record<string, { etiket: string; sinif: string }> = {
  yapildi: { etiket: "Yapıldı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
  yapiliyor: { etiket: "Yapılıyor", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  bekliyor: { etiket: "Bekliyor", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
};
const AVA_RENK = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-rose-500"];

function basHarf(ad: string) {
  return ad.split(/\s+/).slice(0, 2).map((p) => p[0] ?? "").join("").toLocaleUpperCase("tr");
}
function avaRenk(ad: string) {
  let s = 0;
  for (const c of ad) s += c.charCodeAt(0);
  return AVA_RENK[s % AVA_RENK.length];
}

export function IsEmriListesi() {
  const { data, isLoading } = useIsEmriSayfa();
  const { t } = useDil();

  const [sekme, setSekme] = React.useState<"liste" | "takvim" | "kapanan">("liste");
  const [arama, setArama] = React.useState("");
  const [makine, setMakine] = React.useState("hepsi");
  const [periyot, setPeriyot] = React.useState("hepsi");
  const [durum, setDurum] = React.useState("hepsi");
  const [seciliNo, setSeciliNo] = React.useState<string | null>(null);
  const [mAra, setMAra] = React.useState("");
  const [mFiltre, setMFiltre] = React.useState<"tumu" | "yapildi" | "yapiliyor" | "bekliyor">("tumu");
  const [panelSekme, setPanelSekme] = React.useState<"sop" | "notlar" | "malzeme" | "gecmis">("sop");

  React.useEffect(() => { if (data && data.length && !seciliNo) setSeciliNo(data[0].isEmriNo); }, [data, seciliNo]);

  if (isLoading || !data) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
        <div className="grid gap-5 xl:grid-cols-[1fr_380px]"><Skeleton className="h-[500px] w-full" /><Skeleton className="h-[500px] w-full" /></div>
      </div>
    );
  }

  const filtreli = data.filter((w) => {
    const q = arama.trim().toLocaleLowerCase("tr");
    if (sekme === "kapanan" && w.durum !== "tamamlandi") return false;
    if (makine !== "hepsi" && w.makine !== makine) return false;
    if (periyot !== "hepsi" && w.periyot !== periyot) return false;
    if (durum !== "hepsi" && w.durum !== durum) return false;
    if (q && !`${w.isEmriNo} ${w.makine} ${w.bakimAd}`.toLocaleLowerCase("tr").includes(q)) return false;
    return true;
  });

  const secili = data.find((w) => w.isEmriNo === seciliNo) ?? null;
  const say = (d: IsEmriSayfaDurum) => data.filter((w) => w.durum === d).length;
  const kpi = [
    { ik: "solar:document-text-bold-duotone", g1: "#60a5fa", g2: "#2563eb", baslik: "Toplam İş Emri", deger: "28" },
    { ik: "solar:play-circle-bold-duotone", g1: "#34d399", g2: "#059669", baslik: "Bakıma Hazır", deger: "8" },
    { ik: "solar:settings-bold-duotone", g1: "#fbbf24", g2: "#d97706", baslik: "Bakım Yapılıyor", deger: "5" },
    { ik: "solar:check-circle-bold-duotone", g1: "#c084fc", g2: "#9333ea", baslik: "Tamamlandı", deger: "10" },
    { ik: "solar:clock-circle-bold-duotone", g1: "#f87171", g2: "#dc2626", baslik: "Geciken", deger: "4" },
  ];

  const makineAdlari = Array.from(new Set(data.map((w) => w.makine)));
  const secIdx = secili ? data.findIndex((w) => w.isEmriNo === secili.isEmriNo) : -1;

  const maddeler = secili
    ? Array.from({ length: secili.toplam }, (_, i) => ({
        no: String(i + 1).padStart(2, "0"),
        ad: SOP_MADDE_HAVUZ[i % SOP_MADDE_HAVUZ.length],
        sorumlu: secili.atananlar[i % secili.atananlar.length],
        durum: (i < secili.yapilan ? "yapildi" : i < secili.yapilan + secili.yapiliyor ? "yapiliyor" : "bekliyor") as string,
      }))
    : [];
  const maddeFiltreli = maddeler.filter((m) => (mFiltre === "tumu" || m.durum === mFiltre) && (!mAra.trim() || t(m.ad).toLocaleLowerCase("tr").includes(mAra.trim().toLocaleLowerCase("tr"))));
  const yuzde = secili && secili.toplam ? Math.round((secili.yapilan / secili.toplam) * 100) : 0;

  function disaAktar() {
    const basliklar = ["#", t("İş Emri"), t("Makine"), t("Bakım Adı"), t("Periyot"), t("Kesin Tarih"), t("Durum"), t("İlerleme")];
    const satirlar = filtreli.map((w) => [String(w.no), w.isEmriNo, w.makine, t(w.bakimAd), w.periyot, w.kesinTarih, t(DURUM_META[w.durum].etiket), `${w.yapilan}/${w.toplam}`]);
    csvIndir("is-emirleri", basliklar, satirlar);
    toast.success(`${filtreli.length} ${t("kayıt Excel'e aktarıldı")}`);
  }

  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {kpi.map((k) => (
          <Card key={k.baslik} className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgb(15_23_42/0.4)]">
            <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full opacity-25 blur-2xl" style={{ background: k.g1 }} />
            <CardContent className="relative flex items-center gap-3 p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-white/20" style={{ background: `linear-gradient(135deg, ${k.g1}, ${k.g2})`, boxShadow: `0 8px 20px -8px ${k.g2}` }}><Icon icon={k.ik} className="size-6" /></span>
              <div className="min-w-0"><p className="font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</p><p className="truncate text-xs text-muted-foreground">{t(k.baslik)}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sekmeler + Yeni */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b">
        <div className="flex gap-1">
          {([["liste", "İş Emri Listesi", "solar:list-bold"], ["takvim", "Takvim Görünümü", "solar:calendar-bold"], ["kapanan", "Kapanan İş Emirleri", "solar:folder-check-bold"]] as const).map(([s, et, ik]) => (
            <button key={s} type="button" onClick={() => setSekme(s)} className={cn("-mb-px flex items-center gap-1.5 border-b-2 px-3 pb-2.5 text-sm font-medium transition-colors", sekme === s ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground")}>
              <Icon icon={ik} className="size-4" />{t(et)}
            </button>
          ))}
        </div>
        <Button size="sm" className="mb-1 h-9 gap-1.5 bg-blue-600 text-white shadow-sm hover:bg-blue-700" onClick={() => toast(t("Bu özellik yakında eklenecek."))}><Icon icon="solar:add-circle-bold-duotone" className="size-4" />{t("Yeni İş Emri")}</Button>
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={makine} onValueChange={(v) => setMakine(v ?? "hepsi")}><SelectTrigger size="sm" className="w-[150px] bg-card"><SelectValue placeholder={t("Tüm Makineler")} /></SelectTrigger><SelectContent><SelectItem value="hepsi">{t("Tüm Makineler")}</SelectItem>{makineAdlari.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>
        <Select value={periyot} onValueChange={(v) => setPeriyot(v ?? "hepsi")}><SelectTrigger size="sm" className="w-[140px] bg-card"><SelectValue placeholder={t("Tüm Periyotlar")} /></SelectTrigger><SelectContent><SelectItem value="hepsi">{t("Tüm Periyotlar")}</SelectItem>{["3 Aylık", "6 Aylık", "12 Aylık"].map((p) => <SelectItem key={p} value={p}>{t(p)}</SelectItem>)}</SelectContent></Select>
        <Select value={durum} onValueChange={(v) => setDurum(v ?? "hepsi")}><SelectTrigger size="sm" className="w-[160px] bg-card"><SelectValue placeholder={t("Tüm Durumlar")} /></SelectTrigger><SelectContent><SelectItem value="hepsi">{t("Tüm Durumlar")}</SelectItem>{(Object.keys(DURUM_META) as IsEmriSayfaDurum[]).map((d) => <SelectItem key={d} value={d}>{t(DURUM_META[d].etiket)}</SelectItem>)}</SelectContent></Select>
        <div className="relative min-w-[180px] flex-1"><Icon icon="solar:magnifer-linear" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={arama} onChange={(e) => setArama(e.target.value)} placeholder={t("İş emri no, makine, bakım adı ara…")} className="h-9 bg-card pl-9" /></div>
        <Button variant="outline" size="sm" className="h-9 gap-1.5 bg-card" onClick={disaAktar}><Icon icon="vscode-icons:file-type-excel" className="size-4" />{t("Excel Aktar")}</Button>
      </div>

      {sekme === "takvim" ? (
        <Card><CardContent className="p-0"><BosDurum ikon="solar:calendar-bold-duotone" baslik={t("Takvim görünümü yakında")} aciklama={t("İş emirlerinin takvim görünümü ilgili modül devreye alındığında burada olacak.")} /></CardContent></Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          {/* Tablo */}
          <Card className="flex min-w-0 flex-col">
            <CardContent className="flex flex-1 flex-col p-0">
              {filtreli.length === 0 ? (
                <BosDurum baslik={t("İş emri bulunamadı")} aciklama={t("Arama veya filtre kriterlerine uygun iş emri yok.")} />
              ) : (
                <div className="flex-1 overflow-x-auto">
                  <table className="h-full w-full caption-bottom text-sm">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("İş Emri")}</TableHead>
                        <TableHead>{t("Bakım Adı")}</TableHead>
                        <TableHead className="text-center">{t("Kesin Tarih")}</TableHead>
                        <TableHead>{t("İlerleme")}</TableHead>
                        <TableHead>{t("Durum")}</TableHead>
                        <TableHead>{t("Atanan")}</TableHead>
                        <TableHead className="text-right">{t("Aksiyon")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtreli.map((w) => {
                        const dm = DURUM_META[w.durum];
                        const yzd = w.toplam ? Math.round((w.yapilan / w.toplam) * 100) : 0;
                        return (
                          <TableRow key={w.isEmriNo} onClick={() => setSeciliNo(w.isEmriNo)} className={cn("cursor-pointer border-l-2 border-l-transparent transition-colors", w.isEmriNo === seciliNo ? "border-l-blue-500 bg-blue-50/70 dark:bg-blue-950/40" : "hover:bg-muted/50")}>
                            <TableCell><div><span className="block font-medium tabular-nums whitespace-nowrap">{w.isEmriNo}</span><span className="block text-[11px] text-muted-foreground">{w.makine}</span></div></TableCell>
                            <TableCell><div><span className="block whitespace-nowrap">{t(w.bakimAd)}</span><span className={cn("mt-0.5 inline-flex rounded px-1.5 py-0.5 text-[10px] font-medium", PERIYOT_PILL[w.periyot] ?? "bg-muted")}>{t(w.periyot)}</span></div></TableCell>
                            <TableCell className="text-center tabular-nums whitespace-nowrap">{w.kesinTarih}</TableCell>
                            <TableCell><div className="flex items-center gap-1.5"><span className="h-1.5 w-14 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-blue-500" style={{ width: `${yzd}%` }} /></span><span className="text-[11px] tabular-nums text-muted-foreground">{w.yapilan}/{w.toplam}</span></div></TableCell>
                            <TableCell><span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", dm.sinif)}><span className={cn("size-1.5 rounded-full", dm.nokta)} />{t(dm.etiket)}</span></TableCell>
                            <TableCell><div className="flex -space-x-1.5">{w.atananlar.slice(0, 3).map((a) => <span key={a} title={a} className={cn("flex size-6 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-background", avaRenk(a))}>{basHarf(a)}</span>)}</div></TableCell>
                            <TableCell><div className="flex justify-end"><Button variant="outline" size="sm" className="h-7 bg-card text-xs" onClick={(e) => { e.stopPropagation(); setSeciliNo(w.isEmriNo); }}>{t("Detay")}</Button></div></TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detay paneli */}
          {secili ? (
            <Card className="flex flex-col xl:sticky xl:top-4 xl:max-h-[calc(100vh-6rem)] xl:self-start">
              <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                <div className="flex items-center gap-2"><h3 className="font-heading text-base font-bold tabular-nums">{secili.isEmriNo}</h3><span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", DURUM_META[secili.durum].sinif)}><span className={cn("size-1.5 rounded-full", DURUM_META[secili.durum].nokta)} />{t(DURUM_META[secili.durum].etiket)}</span></div>
                <div className="flex items-center gap-0.5">
                  <button type="button" disabled={secIdx <= 0} onClick={() => setSeciliNo(data[secIdx - 1].isEmriNo)} className="flex size-6 items-center justify-center rounded-md border bg-card text-muted-foreground hover:bg-muted disabled:opacity-40"><Icon icon="solar:alt-arrow-left-linear" className="size-3.5" /></button>
                  <button type="button" disabled={secIdx >= data.length - 1} onClick={() => setSeciliNo(data[secIdx + 1].isEmriNo)} className="flex size-6 items-center justify-center rounded-md border bg-card text-muted-foreground hover:bg-muted disabled:opacity-40"><Icon icon="solar:alt-arrow-right-linear" className="size-3.5" /></button>
                  <button type="button" onClick={() => setSeciliNo(null)} aria-label={t("Kapat")} className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"><Icon icon="solar:close-circle-linear" className="size-4" /></button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 overflow-y-auto">
                <div className="flex items-center gap-3">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md ring-1 ring-white/20"><Icon icon="solar:cpu-bolt-bold-duotone" className="size-8" /></span>
                  <div><p className="font-semibold">{secili.makine}</p><p className="text-sm text-muted-foreground">{t(secili.bakimAd)}</p><span className={cn("mt-1 inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium", PERIYOT_PILL[secili.periyot] ?? "bg-muted")}>{t(secili.periyot)}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { e: "Kesin Tarih", d: secili.kesinTarih, ik: "solar:calendar-mark-linear" },
                    { e: "Planlanan Tarih", d: secili.planlananTarih, ik: "solar:calendar-linear" },
                    { e: "SOP", d: secili.sopKodu, ik: "solar:document-text-linear" },
                    { e: "Makine Duruş Süresi", d: `${secili.durusSaat} ${t("saat")}`, ik: "solar:clock-circle-linear" },
                  ].map((r) => (<div key={r.e} className="rounded-lg border p-2.5"><p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"><Icon icon={r.ik} className="size-3.5" />{t(r.e)}</p><p className="mt-0.5 font-medium">{r.d}</p></div>))}
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs"><span className="font-medium">{t("SOP Uygulama İlerlemesi")}</span><span className="tabular-nums text-muted-foreground">{secili.yapilan}/{secili.toplam} · %{yuzde}</span></div>
                  <span className="block h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-emerald-500" style={{ width: `${yuzde}%` }} /></span>
                </div>

                {/* Panel sekmeleri */}
                <div className="flex gap-3 border-b text-sm">
                  {([["sop", `${t("SOP Uygulamaları")} (${secili.toplam})`], ["notlar", t("Notlar")], ["malzeme", t("Kullanılan Malzemeler")], ["gecmis", t("Geçmiş")]] as const).map(([s, et]) => (
                    <button key={s} type="button" onClick={() => setPanelSekme(s)} className={cn("-mb-px border-b-2 pb-1.5 text-xs font-medium whitespace-nowrap transition-colors", panelSekme === s ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-muted-foreground hover:text-foreground")}>{et}</button>
                  ))}
                </div>

                {panelSekme === "sop" ? (
                  <div className="space-y-2">
                    <div className="relative"><Icon icon="solar:magnifer-linear" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={mAra} onChange={(e) => setMAra(e.target.value)} placeholder={t("SOP maddelerinde ara…")} className="h-8 bg-card pl-9 text-sm" /></div>
                    <div className="flex flex-wrap gap-1">
                      {([["tumu", "Tümü", secili.toplam], ["yapildi", "Yapılan", secili.yapilan], ["yapiliyor", "Yapılıyor", secili.yapiliyor], ["bekliyor", "Bekleyen", secili.toplam - secili.yapilan - secili.yapiliyor]] as const).map(([f, et, n]) => (
                        <button key={f} type="button" onClick={() => setMFiltre(f)} className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors", mFiltre === f ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:text-foreground")}>{t(et)} <span className="tabular-nums opacity-80">{n}</span></button>
                      ))}
                    </div>
                    <div className="max-h-[32vh] space-y-1 overflow-y-auto">
                      {maddeFiltreli.map((m) => (
                        <div key={m.no} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
                          <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">{m.no}</span>
                          <div className="min-w-0 flex-1"><p className="truncate">{t(m.ad)}</p><p className="truncate text-[11px] text-muted-foreground">{m.sorumlu}</p></div>
                          <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", MADDE_META[m.durum].sinif)}>{t(MADDE_META[m.durum].etiket)}</span>
                          <Icon icon="solar:camera-linear" className="size-4 shrink-0 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">{t("Bu bölüm yakında eklenecek.")}</div>
                )}

                {/* Hızlı aksiyonlar */}
                <div className="border-t pt-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">{t("Hızlı Aksiyonlar")}</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button size="sm" className="gap-1 bg-emerald-600 text-white text-xs hover:bg-emerald-700" onClick={() => toast.success(t("Bakım tamamlandı olarak işaretlendi."))}><Icon icon="solar:check-circle-bold" className="size-3.5" />{t("Bakımı Tamamla")}</Button>
                    <Button variant="outline" size="sm" className="gap-1 bg-card text-xs" onClick={() => toast.success(t("Geçici kaydedildi."))}><Icon icon="solar:diskette-linear" className="size-3.5" />{t("Geçici Kaydet")}</Button>
                    <Button variant="outline" size="sm" className="gap-1 bg-card text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950" onClick={() => toast(t("İş emri iptal edildi."))}><Icon icon="solar:close-circle-linear" className="size-3.5" />{t("İptal Et")}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}
