"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BosDurum } from "@/components/common/bos-durum";
import { useTalepler } from "@/lib/queries/satinalma";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { TALEP_DURUM_META, tarihKisa } from "@/components/satinalma/stiller";
import type { TalepDurum } from "@/lib/types/satinalma";

const KPI = [
  { anahtar: "toplam" as const, ik: "solar:clipboard-list-bold-duotone", g1: "#fb923c", g2: "#ea580c", baslik: "Toplam Talep" },
  { anahtar: "kaynak_arama" as const, ik: "solar:magnifer-zoom-in-bold-duotone", g1: "#a78bfa", g2: "#7c3aed", baslik: "Kaynak Araştırma" },
  { anahtar: "teklif_toplama" as const, ik: "solar:inbox-in-bold-duotone", g1: "#fbbf24", g2: "#d97706", baslik: "Teklif Toplama" },
  { anahtar: "tamamlandi" as const, ik: "solar:check-circle-bold-duotone", g1: "#34d399", g2: "#059669", baslik: "Tamamlandı" },
];

export function TalepListesi() {
  const { data, isLoading, isError, error } = useTalepler();
  const { t } = useDil();
  const router = useRouter();
  const [arama, setArama] = React.useState("");
  const [durum, setDurum] = React.useState("hepsi");

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-0">
          <BosDurum ikon="solar:danger-triangle-bold-duotone" baslik={t("Talepler yüklenemedi")} aciklama={(error instanceof Error ? error.message : "") + " — " + t("Supabase migration'ının (0014) uygulandığından emin olun.")} />
        </CardContent>
      </Card>
    );
  }

  const tumu = data ?? [];
  const sayac = (d: TalepDurum) => tumu.filter((x) => x.durum === d).length;
  const kpiDeger = (a: (typeof KPI)[number]["anahtar"]) => (a === "toplam" ? tumu.length : sayac(a as TalepDurum));

  const filtreli = tumu.filter((x) => {
    const q = arama.trim().toLocaleLowerCase("tr");
    if (durum !== "hepsi" && x.durum !== durum) return false;
    if (q && !`${x.talepNo ?? ""} ${x.baslik} ${x.marka ?? ""} ${x.model ?? ""}`.toLocaleLowerCase("tr").includes(q)) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPI.map((k) => (
          <Card key={k.anahtar} className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="pointer-events-none absolute -top-8 -right-8 size-24 rounded-full opacity-25 blur-2xl" style={{ background: k.g1 }} />
            <CardContent className="relative flex items-center gap-3 p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ring-1 ring-white/20" style={{ background: `linear-gradient(135deg, ${k.g1}, ${k.g2})` }}><Icon icon={k.ik} className="size-6" /></span>
              <div className="min-w-0"><p className="font-heading text-2xl font-bold tabular-nums">{kpiDeger(k.anahtar)}</p><p className="truncate text-xs text-muted-foreground">{t(k.baslik)}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Araç çubuğu */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={durum} onValueChange={(v) => setDurum(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[170px] bg-card"><SelectValue placeholder={t("Tüm Durumlar")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Durumlar")}</SelectItem>
            {(Object.keys(TALEP_DURUM_META) as TalepDurum[]).map((d) => <SelectItem key={d} value={d}>{t(TALEP_DURUM_META[d].etiket)}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="relative min-w-[180px] flex-1"><Icon icon="solar:magnifer-linear" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={arama} onChange={(e) => setArama(e.target.value)} placeholder={t("Talep no, başlık, marka ara…")} className="h-9 bg-card pl-9" /></div>
        <Button className="h-9 gap-1.5 bg-orange-600 text-white shadow-sm hover:bg-orange-700" nativeButton={false} render={<Link href="/satinalma/talepler/yeni" />}>
          <Icon icon="solar:add-circle-bold" className="size-4" />{t("Yeni Talep")}
        </Button>
      </div>

      {/* Tablo */}
      <Card>
        <CardContent className="p-0">
          {filtreli.length === 0 ? (
            <BosDurum
              ikon="solar:clipboard-list-bold-duotone"
              baslik={tumu.length === 0 ? t("Henüz talep yok") : t("Eşleşen talep yok")}
              aciklama={tumu.length === 0 ? t("İlk malzeme talebinizi oluşturarak başlayın.") : t("Arama veya filtre kriterlerini değiştirin.")}
              aksiyon={tumu.length === 0 ? <Button className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" nativeButton={false} render={<Link href="/satinalma/talepler/yeni" />}><Icon icon="solar:add-circle-bold" className="size-4" />{t("Yeni Talep")}</Button> : undefined}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full caption-bottom text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Talep No")}</TableHead>
                    <TableHead>{t("Malzeme")}</TableHead>
                    <TableHead className="text-center">{t("Adet")}</TableHead>
                    <TableHead>{t("Durum")}</TableHead>
                    <TableHead className="text-center">{t("Tarih")}</TableHead>
                    <TableHead className="text-right">{t("Aksiyon")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtreli.map((x) => {
                    const dm = TALEP_DURUM_META[x.durum];
                    return (
                      <TableRow key={x.id} onClick={() => router.push(`/satinalma/talepler/${x.id}`)} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium tabular-nums whitespace-nowrap">{x.talepNo ?? "—"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            {x.fotoUrl[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={x.fotoUrl[0]} alt="" className="size-9 shrink-0 rounded-md object-cover ring-1 ring-border" />
                            ) : (
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"><Icon icon="solar:box-bold-duotone" className="size-5" /></span>
                            )}
                            <div className="min-w-0"><span className="block truncate font-medium">{x.baslik}</span><span className="block truncate text-[11px] text-muted-foreground">{[x.marka, x.model].filter(Boolean).join(" · ") || "—"}</span></div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center tabular-nums whitespace-nowrap">{x.adet != null ? `${x.adet} ${x.birim ?? ""}`.trim() : "—"}</TableCell>
                        <TableCell><span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", dm.sinif)}><span className={cn("size-1.5 rounded-full", dm.nokta)} />{t(dm.etiket)}</span></TableCell>
                        <TableCell className="text-center tabular-nums whitespace-nowrap text-muted-foreground">{tarihKisa(x.createdAt)}</TableCell>
                        <TableCell><div className="flex justify-end"><Icon icon="solar:alt-arrow-right-linear" className="size-4 text-muted-foreground" /></div></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
