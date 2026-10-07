"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
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
import { usePlanlar, useMakineler } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { KRITIKLIK_META, PERIYOT_ETIKET, PERIYOT_META } from "@/components/bakim/makineler/stiller";
import { planSonrakiOlusum, tarihBicim } from "@/lib/bakim/tarih";
import type { BakimPeriyot } from "@/lib/types/bakim";

function sureBicim(saat: number): string {
  if (saat < 1) return `${Math.round(saat * 60)} dk`;
  return Number.isInteger(saat) ? `${saat} sa` : `${saat} sa`;
}

export function PlanListesi() {
  const { data: planlar, isLoading } = usePlanlar();
  const { data: makineler } = useMakineler();
  const { t } = useDil();

  const [arama, setArama] = React.useState("");
  const [makineId, setMakineId] = React.useState("hepsi");
  const [periyot, setPeriyot] = React.useState("hepsi");

  const makineAd = React.useMemo(
    () => new Map((makineler ?? []).map((m) => [m.id, m.ad])),
    [makineler],
  );

  const bugun = React.useMemo(() => new Date(), []);

  const filtreli = React.useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    return (planlar ?? []).filter((p) => {
      if (makineId !== "hepsi" && p.makineId !== makineId) return false;
      if (periyot !== "hepsi" && p.periyot !== periyot) return false;
      if (q) {
        const havuz = `${p.ad} ${p.bakimTuru} ${makineAd.get(p.makineId) ?? ""} ${p.sorumlu}`.toLocaleLowerCase("tr");
        if (!havuz.includes(q)) return false;
      }
      return true;
    });
  }, [planlar, makineId, periyot, arama, makineAd]);

  if (isLoading || !planlar) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const haftalik = planlar.filter((p) => p.periyot === "haftalik").length;
  const periyodik = planlar.filter((p) => p.periyot !== "haftalik").length;
  const kapsanan = new Set(planlar.map((p) => p.makineId)).size;

  const ozet = [
    { ik: "solar:clipboard-list-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Toplam Plan", deger: String(planlar.length) },
    { ik: "solar:cpu-bolt-bold-duotone", renk: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300", baslik: "Kapsanan Makine", deger: String(kapsanan) },
    { ik: "solar:calendar-bold-duotone", renk: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300", baslik: "Haftalık Plan", deger: String(haftalik) },
    { ik: "solar:refresh-circle-bold-duotone", renk: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300", baslik: "Periyodik Plan", deger: String(periyodik) },
  ];

  return (
    <div className="space-y-6">
      {/* Özet */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {ozet.map((k) => (
          <Card key={k.baslik}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", k.renk)}>
                <Icon icon={k.ik} className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{t(k.baslik)}</p>
                <p className="font-heading text-xl font-bold tracking-tight tabular-nums">{k.deger}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Araç çubuğu */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Icon icon="solar:magnifer-linear" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder={t("Plan, bakım türü, makine veya sorumlu ara…")}
            className="h-9 bg-card pl-9"
          />
        </div>

        <Select value={makineId} onValueChange={(v) => setMakineId(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[180px] bg-card">
            <SelectValue placeholder={t("Makine")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Makineler")}</SelectItem>
            {(makineler ?? []).map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.ad}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={periyot} onValueChange={(v) => setPeriyot(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[150px] bg-card">
            <SelectValue placeholder={t("Periyot")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Periyotlar")}</SelectItem>
            {(["haftalik", "aylik", "3aylik", "6aylik", "yillik"] as BakimPeriyot[]).map((p) => (
              <SelectItem key={p} value={p}>{t(PERIYOT_ETIKET[p])}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="ml-auto h-9 gap-1.5 bg-blue-600 text-white shadow-sm hover:bg-blue-700"
          onClick={() => toast(t("Bu özellik yakında eklenecek."))}
        >
          <Icon icon="solar:add-circle-bold-duotone" className="size-4" />
          {t("Yeni Plan")}
        </Button>
      </div>

      <p className="-mt-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{filtreli.length}</span> / {planlar.length} {t("plan")}
      </p>

      {filtreli.length === 0 ? (
        <BosDurum baslik={t("Plan bulunamadı")} aciklama={t("Arama veya filtre kriterlerine uygun bakım planı yok.")} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Makine")}</TableHead>
                  <TableHead>{t("Bakım Planı")}</TableHead>
                  <TableHead>{t("Periyot")}</TableHead>
                  <TableHead>{t("Sorumlu")}</TableHead>
                  <TableHead className="text-center">{t("Tahmini Süre")}</TableHead>
                  <TableHead className="text-center">{t("Sonraki Tarih")}</TableHead>
                  <TableHead>{t("Kritiklik")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtreli.map((p) => {
                  const per = PERIYOT_META[p.periyot];
                  const krit = KRITIKLIK_META[p.kritiklik];
                  const sonraki = tarihBicim(planSonrakiOlusum(p, bugun));
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Link
                          href={`/bakim/makineler/${p.makineId}`}
                          className="font-medium hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                        >
                          {makineAd.get(p.makineId) ?? p.makineId}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{t(p.ad)}</div>
                        <div className="text-xs text-muted-foreground">{t(p.bakimTuru)}</div>
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", per.sinif)}>
                          <span className={cn("size-1.5 rounded-full", per.nokta)} />
                          {t(PERIYOT_ETIKET[p.periyot])}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{t(p.sorumlu)}</TableCell>
                      <TableCell className="text-center tabular-nums">{sureBicim(p.tahminiSureSaat)}</TableCell>
                      <TableCell className="text-center tabular-nums">{sonraki}</TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", krit.sinif)}>
                          <span className={cn("size-1.5 rounded-full", krit.nokta)} />
                          {t(krit.etiket)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
