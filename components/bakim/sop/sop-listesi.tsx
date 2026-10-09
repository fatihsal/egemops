"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { useSopListe, useMakineler } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { CHECKLIST_TIP_META } from "@/components/bakim/makineler/stiller";
import type { ChecklistTip, SopSablon } from "@/lib/types/bakim";

function aktifVersiyon(s: SopSablon) {
  return s.versiyonlar.find((v) => v.id === s.aktifVersiyonId) ?? s.versiyonlar[s.versiyonlar.length - 1];
}

export function SopListesi() {
  const { data, isLoading } = useSopListe();
  const { data: makineler } = useMakineler();
  const { t } = useDil();
  const router = useRouter();

  const [arama, setArama] = React.useState("");
  const [tip, setTip] = React.useState("hepsi");

  const makineAd = React.useMemo(() => new Map((makineler ?? []).map((m) => [m.id, m.ad])), [makineler]);

  const filtreli = React.useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    return (data ?? []).filter((s) => {
      if (tip !== "hepsi" && s.tip !== tip) return false;
      if (q) {
        const havuz = `${s.ad} ${s.makineId ? makineAd.get(s.makineId) ?? "" : ""}`.toLocaleLowerCase("tr");
        if (!havuz.includes(q)) return false;
      }
      return true;
    });
  }, [data, arama, tip, makineAd]);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  const say = (tp: ChecklistTip) => data.filter((s) => s.tip === tp).length;
  const toplamMadde = data.reduce((acc, s) => acc + aktifVersiyon(s).maddeler.length, 0);
  const ozet = [
    { ik: "solar:clipboard-list-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Toplam SOP", deger: String(data.length) },
    { ik: "solar:wrench-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Teknik Bakım", deger: String(say("TECHNICAL_MAINTENANCE")) },
    { ik: "solar:user-bold-duotone", renk: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300", baslik: "Operatör Formu", deger: String(say("OPERATOR_INSPECTION")) },
    { ik: "solar:checklist-minimalistic-bold-duotone", renk: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", baslik: "Toplam Madde", deger: String(toplamMadde) },
  ];

  return (
    <div className="space-y-6">
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

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Icon icon="solar:magnifer-linear" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder={t("SOP adı veya makine ara…")}
            className="h-9 bg-card pl-9"
          />
        </div>
        <Select value={tip} onValueChange={(v) => setTip(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[190px] bg-card">
            <SelectValue placeholder={t("Tip")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Tipler")}</SelectItem>
            {(["TECHNICAL_MAINTENANCE", "OPERATOR_INSPECTION"] as ChecklistTip[]).map((tp) => (
              <SelectItem key={tp} value={tp}>{t(CHECKLIST_TIP_META[tp].etiket)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="ml-auto h-9 gap-1.5 bg-blue-600 text-white shadow-sm hover:bg-blue-700" onClick={() => toast(t("Bu özellik yakında eklenecek."))}>
          <Icon icon="solar:add-circle-bold-duotone" className="size-4" />
          {t("Yeni SOP")}
        </Button>
      </div>

      <p className="-mt-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{filtreli.length}</span> / {data.length} {t("SOP")}
      </p>

      {filtreli.length === 0 ? (
        <BosDurum baslik={t("SOP bulunamadı")} aciklama={t("Arama veya filtre kriterlerine uygun SOP yok.")} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("SOP Adı")}</TableHead>
                  <TableHead>{t("Tip")}</TableHead>
                  <TableHead>{t("Makine")}</TableHead>
                  <TableHead className="text-center">{t("Aktif Rev")}</TableHead>
                  <TableHead className="text-center">{t("Madde")}</TableHead>
                  <TableHead className="text-center">{t("Son Güncelleme")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtreli.map((s) => {
                  const tm = CHECKLIST_TIP_META[s.tip];
                  const v = aktifVersiyon(s);
                  return (
                    <TableRow key={s.id} onClick={() => router.push(`/bakim/sop/${s.id}`)} className="cursor-pointer">
                      <TableCell className="font-medium">{t(s.ad)}</TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", tm.sinif)}>
                          <Icon icon={tm.ikon} className="size-3" />
                          {t(tm.etiket)}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {s.makineId ? makineAd.get(s.makineId) ?? s.makineId : t("Tüm Makineler")}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums">Rev {v.rev}</span>
                      </TableCell>
                      <TableCell className="text-center tabular-nums">{v.maddeler.length}</TableCell>
                      <TableCell className="text-center tabular-nums whitespace-nowrap">{v.tarih}</TableCell>
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
