"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BosDurum } from "@/components/common/bos-durum";
import { useSopSayfa } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import {
  ESLESEN_HAZIR_META,
  SOP_REV_DURUM_META,
  SOP_TIP_META,
  SOP_TIP_UZUN,
} from "@/components/bakim/makineler/stiller";
import type { SopBakimTipi, SopRevDurum } from "@/lib/types/bakim";

const BOYUT = 8;
const grafikTooltip = {
  background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)",
};

function basHarf(ad: string) {
  return ad.split(/\s+/).slice(0, 2).map((p) => p[0] ?? "").join("").toLocaleUpperCase("tr");
}

export function SopListesi() {
  const { data, isLoading } = useSopSayfa();
  const { t } = useDil();
  const router = useRouter();

  const [arama, setArama] = React.useState("");
  const [tip, setTip] = React.useState("hepsi");
  const [durum, setDurum] = React.useState("hepsi");
  const [sayfa, setSayfa] = React.useState(1);

  const filtreli = React.useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    return (data?.satirlar ?? []).filter((s) => {
      if (tip !== "hepsi" && !s.bakimTipleri.includes(tip as SopBakimTipi)) return false;
      if (durum !== "hepsi" && s.durum !== durum) return false;
      if (q && !`${s.makineAd} ${s.ekipmanKodu}`.toLocaleLowerCase("tr").includes(q)) return false;
      return true;
    });
  }, [data, arama, tip, durum]);

  React.useEffect(() => setSayfa(1), [arama, tip, durum]);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-6 xl:grid-cols-3">
          <Skeleton className="h-96 w-full xl:col-span-2" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const satirlar = data.satirlar;
  const toplamSop = satirlar.reduce((a, s) => a + s.bakimTipleri.length, 0);
  const tipSay = (tp: SopBakimTipi) => satirlar.filter((s) => s.bakimTipleri.includes(tp)).length;
  const durumSay = (d: SopRevDurum) => satirlar.filter((s) => s.durum === d).length;
  const sorunluSop = satirlar.filter((s) => s.durum === "revizeBekliyor" || s.durum === "eksikFoto").reduce((a, s) => a + s.bakimTipleri.length, 0);
  const hazirSop = satirlar.filter((s) => s.durum === "aktif" || s.durum === "kullanimda").length;

  const kpiler = [
    { ik: "solar:buildings-3-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Toplam Makine", deger: String(satirlar.length), alt: "Aktif makineler" },
    { ik: "solar:document-text-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Toplam SOP Şablonu", deger: String(toplamSop), alt: "Tüm şablonlar" },
    { ik: "solar:layers-bold-duotone", renk: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", baslik: "Aktif Revizyon", deger: String(toplamSop - sorunluSop), alt: "Güncel şablonlar" },
    { ik: "solar:calendar-mark-bold-duotone", renk: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300", baslik: "Yaklaşan Bakım için Hazır SOP", deger: String(hazirSop), alt: "Eşleşen şablonlar" },
    { ik: "solar:danger-triangle-bold-duotone", renk: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300", baslik: "Eksik / Revize Bekleyen SOP", deger: String(durumSay("revizeBekliyor") + durumSay("eksikFoto")), alt: "Güncellenmesi gereken" },
  ];

  const donut = (["3A", "6A", "12A"] as SopBakimTipi[]).map((tp) => ({ tp, ad: SOP_TIP_UZUN[tp], adet: tipSay(tp), renk: SOP_TIP_META[tp].renk }));
  const durumlar = (["aktif", "kullanimda", "revizeBekliyor", "eksikFoto"] as SopRevDurum[]).map((d) => ({ d, adet: durumSay(d) }));

  const toplamSayfa = Math.max(1, Math.ceil(filtreli.length / BOYUT));
  const geciliSayfa = Math.min(sayfa, toplamSayfa);
  const bas = (geciliSayfa - 1) * BOYUT;
  const sayfaSatir = filtreli.slice(bas, bas + BOYUT);

  function git(s: { sopId?: string; makineId: string }) {
    router.push(s.sopId ? `/bakim/sop/${s.sopId}` : `/bakim/makineler/${s.makineId}`);
  }

  return (
    <div className="space-y-6">
      {/* ===== KPI ===== */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {kpiler.map((k) => (
          <Card key={k.baslik}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", k.renk)}>
                  <Icon icon={k.ik} className="size-5" />
                </span>
                <p className="text-xs leading-tight text-muted-foreground">{t(k.baslik)}</p>
              </div>
              <p className="mt-2 font-heading text-2xl font-bold tracking-tight tabular-nums">{k.deger}</p>
              <p className="text-[11px] text-muted-foreground">{t(k.alt)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===== Araç çubuğu ===== */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Icon icon="solar:magnifer-linear" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={arama} onChange={(e) => setArama(e.target.value)} placeholder={t("Makine, SOP adı veya ekipman kodu ara…")} className="h-9 bg-card pl-9" />
        </div>
        <Select value={tip} onValueChange={(v) => setTip(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[130px] bg-card"><SelectValue placeholder={t("Bakım Tipi")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Tipler")}</SelectItem>
            {(["3A", "6A", "12A"] as SopBakimTipi[]).map((tp) => <SelectItem key={tp} value={tp}>{t(SOP_TIP_UZUN[tp])}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={durum} onValueChange={(v) => setDurum(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[160px] bg-card"><SelectValue placeholder={t("Revizyon Durumu")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Durumlar")}</SelectItem>
            {(["aktif", "kullanimda", "revizeBekliyor", "eksikFoto"] as SopRevDurum[]).map((d) => <SelectItem key={d} value={d}>{t(SOP_REV_DURUM_META[d].etiket)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9 gap-1.5 bg-card" onClick={() => toast(t("Bu özellik yakında eklenecek."))}>
          <Icon icon="solar:settings-bold-duotone" className="size-4" /> {t("Şablon Yönetimi")}
        </Button>
        <Button size="sm" className="h-9 gap-1.5 bg-blue-600 text-white shadow-sm hover:bg-blue-700" onClick={() => toast(t("Bu özellik yakında eklenecek."))}>
          <Icon icon="solar:add-circle-bold-duotone" className="size-4" /> {t("Yeni SOP Ekle")}
        </Button>
      </div>

      {/* ===== Tablo + sağ paneller ===== */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Makine ve SOP Listesi */}
        <Card className="min-w-0">
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">
            <div className="flex items-center gap-2">
              <Icon icon="solar:clipboard-list-bold-duotone" className="size-5 text-blue-500" />
              <h3 className="font-heading text-base font-medium">{t("Makine ve SOP Listesi")}</h3>
            </div>
            <span className="text-xs text-muted-foreground">{t("Toplam")} {satirlar.length} {t("makine")}, {toplamSop} {t("SOP şablonu")}</span>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Makine")}</TableHead>
                  <TableHead>{t("Bakım Tipleri")}</TableHead>
                  <TableHead>{t("Bağlı SOP Formları")}</TableHead>
                  <TableHead className="text-center">{t("Son Revizyon")}</TableHead>
                  <TableHead>{t("Durum")}</TableHead>
                  <TableHead className="text-right">{t("İşlemler")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sayfaSatir.map((s) => {
                  const dm = SOP_REV_DURUM_META[s.durum];
                  const formlar = s.bakimTipleri.map((tp) => `${tp} SOP`);
                  return (
                    <TableRow key={s.makineId}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                            <Icon icon="solar:cpu-bolt-bold-duotone" className="size-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-medium">{s.makineAd}</span>
                            <span className="block text-[11px] tabular-nums text-muted-foreground">{s.ekipmanKodu}</span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {s.bakimTipleri.map((tp) => (
                            <span key={tp} className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold", SOP_TIP_META[tp].sinif)}>{tp}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1">
                          {formlar.slice(0, 2).map((f) => (
                            <span key={f} className="inline-flex items-center rounded-md border bg-card px-1.5 py-0.5 text-[10px] whitespace-nowrap text-blue-600 dark:text-blue-400">{f}</span>
                          ))}
                          {formlar.length > 2 ? <span className="text-[10px] font-medium text-muted-foreground">+{formlar.length - 2}</span> : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="tabular-nums whitespace-nowrap">{s.sonRevizyon}</div>
                        <div className="text-[10px] text-muted-foreground tabular-nums">{s.sonKullanim}</div>
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", dm.sinif)} title={t(dm.etiket)}>
                          <Icon icon={dm.ikon} className="size-3" />
                          {t(dm.kisa)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <button type="button" onClick={() => git(s)} aria-label={t("Görüntüle")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                            <Icon icon="solar:eye-linear" className="size-4" />
                          </button>
                          <button type="button" onClick={() => toast(t("Bu özellik yakında eklenecek."))} aria-label={t("Düzenle")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                            <Icon icon="solar:pen-linear" className="size-4" />
                          </button>
                          <Button variant="outline" size="sm" className="h-7 bg-card text-xs" onClick={() => git(s)}>{t("Detay")}</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {filtreli.length === 0 ? (
              <BosDurum baslik={t("SOP bulunamadı")} aciklama={t("Arama veya filtre kriterlerine uygun SOP yok.")} />
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t p-3 text-sm">
                <span className="text-muted-foreground">
                  <span className="tabular-nums">{bas + 1}-{Math.min(bas + BOYUT, filtreli.length)}</span> / {filtreli.length} {t("makine gösteriliyor")}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon-sm" disabled={geciliSayfa <= 1} onClick={() => setSayfa((s) => Math.max(1, s - 1))} aria-label={t("Önceki")}><ChevronLeft className="size-4" /></Button>
                  {Array.from({ length: toplamSayfa }, (_, i) => i + 1).map((n) => (
                    <Button key={n} variant={n === geciliSayfa ? "default" : "ghost"} size="icon-sm" className="tabular-nums" onClick={() => setSayfa(n)}>{n}</Button>
                  ))}
                  <Button variant="outline" size="icon-sm" disabled={geciliSayfa >= toplamSayfa} onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))} aria-label={t("Sonraki")}><ChevronRight className="size-4" /></Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sağ: Durum Özeti + Durum Dağılımı */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-heading text-base font-medium">{t("SOP Durum Özeti")}</h3>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-32 w-32 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip contentStyle={grafikTooltip} formatter={(v, n) => [`${v}`, t(String(n))]} />
                      <Pie data={donut} dataKey="adet" nameKey="ad" innerRadius={42} outerRadius={60} paddingAngle={2} isAnimationActive={false}>
                        {donut.map((d) => <Cell key={d.tp} fill={d.renk} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-heading text-xl font-bold tabular-nums">{toplamSop}</span>
                    <span className="text-[10px] text-muted-foreground">{t("SOP Şablonu")}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2 text-sm">
                  {donut.map((d) => (
                    <div key={d.tp} className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: d.renk }} />{t(d.ad)}</span>
                      <span className="tabular-nums"><span className="font-semibold">{d.adet}</span> <span className="ml-1 text-xs text-muted-foreground">%{toplamSop ? Math.round((d.adet / toplamSop) * 100) : 0}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-heading text-base font-medium">{t("Durum Dağılımı")}</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {durumlar.map(({ d, adet }) => {
                const m = SOP_REV_DURUM_META[d];
                const yuzde = satirlar.length ? Math.round((adet / satirlar.length) * 100) : 0;
                return (
                  <div key={d} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2"><span className={cn("size-2.5 rounded-full", m.nokta)} />{t(m.etiket)}</span>
                      <span className="tabular-nums"><span className="font-semibold">{adet}</span> <span className="ml-1 text-xs text-muted-foreground">%{yuzde}</span></span>
                    </div>
                    <span className="block h-1.5 overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full" style={{ width: `${yuzde}%`, background: m.renk }} />
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ===== Alt: Son Revize + Yaklaşan Eşleşen ===== */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <div className="flex items-center gap-2">
              <Icon icon="solar:history-bold-duotone" className="size-5 text-blue-500" />
              <h3 className="font-heading text-base font-medium">{t("Son Revize Edilen SOP'lar")}</h3>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pr-2 pb-2 font-medium">#</th>
                  <th className="pr-2 pb-2 font-medium">{t("SOP Adı")}</th>
                  <th className="pr-2 pb-2 font-medium">{t("Revizyon")}</th>
                  <th className="pr-2 pb-2 font-medium">{t("Güncelleme")}</th>
                  <th className="pb-2 font-medium">{t("Sorumlu")}</th>
                </tr>
              </thead>
              <tbody>
                {data.sonRevize.map((r, i) => (
                  <tr key={r.sopAd} className="border-b last:border-0">
                    <td className="py-2 pr-2 tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
                    <td className="py-2 pr-2 font-medium">{r.sopAd}</td>
                    <td className="py-2 pr-2"><span className="inline-flex rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium tabular-nums">{r.revNo}</span></td>
                    <td className="py-2 pr-2 tabular-nums whitespace-nowrap text-muted-foreground">{r.tarih}</td>
                    <td className="py-2">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <span className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{basHarf(r.sorumlu)}</span>
                        {r.sorumlu}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <div className="flex items-center gap-2">
              <Icon icon="solar:calendar-bold-duotone" className="size-5 text-blue-500" />
              <h3 className="font-heading text-base font-medium">{t("Yaklaşan Bakımlar için Eşleşen SOP'lar")}</h3>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pr-2 pb-2 font-medium">#</th>
                  <th className="pr-2 pb-2 font-medium">{t("Makine")}</th>
                  <th className="pr-2 pb-2 font-medium">{t("Bakım Tipi")}</th>
                  <th className="pr-2 pb-2 font-medium">{t("Planlanan")}</th>
                  <th className="pb-2 font-medium">{t("SOP Hazır Durumu")}</th>
                </tr>
              </thead>
              <tbody>
                {data.yaklasanEslesen.map((r, i) => {
                  const hm = ESLESEN_HAZIR_META[r.hazir];
                  return (
                    <tr key={r.makine + r.bakimTipi} className="border-b last:border-0">
                      <td className="py-2 pr-2 tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
                      <td className="py-2 pr-2 font-medium whitespace-nowrap">{r.makine}</td>
                      <td className="py-2 pr-2 whitespace-nowrap">{t(r.bakimTipi)}</td>
                      <td className="py-2 pr-2 tabular-nums whitespace-nowrap text-muted-foreground">{r.planlananTarih}</td>
                      <td className="py-2">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap", hm.sinif)}>
                          <Icon icon={hm.ikon} className="size-3" />
                          {t(hm.etiket)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
