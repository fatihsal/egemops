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
import { useOperatorKontroller } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { OPERATOR_KONTROL_DURUM_META } from "@/components/bakim/makineler/stiller";
import type { OperatorKontrolDurum } from "@/lib/types/bakim";

export function OperatorListe() {
  const { data, isLoading } = useOperatorKontroller();
  const { t } = useDil();
  const router = useRouter();

  const [arama, setArama] = React.useState("");
  const [durum, setDurum] = React.useState("hepsi");

  const filtreli = React.useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    return (data ?? []).filter((k) => {
      if (durum !== "hepsi" && k.durum !== durum) return false;
      if (q) {
        const havuz = `${k.no} ${k.makineAd} ${k.operator} ${k.hafta}`.toLocaleLowerCase("tr");
        if (!havuz.includes(q)) return false;
      }
      return true;
    });
  }, [data, arama, durum]);

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

  const say = (d: OperatorKontrolDurum) => data.filter((k) => k.durum === d).length;
  const uygunsuzluk = data.reduce((s, k) => s + k.uygunsuzlukSayi, 0);
  const ozet = [
    { ik: "solar:clipboard-list-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Toplam Form", deger: String(data.length) },
    { ik: "solar:calendar-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Bekleyen", deger: String(say("planlandi")) },
    { ik: "solar:refresh-circle-bold-duotone", renk: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300", baslik: "Devam Eden", deger: String(say("devam")) },
    { ik: "solar:danger-triangle-bold-duotone", renk: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300", baslik: "Uygunsuzluk", deger: String(uygunsuzluk) },
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
            placeholder={t("Form no, makine, operatör veya hafta ara…")}
            className="h-9 bg-card pl-9"
          />
        </div>
        <Select value={durum} onValueChange={(v) => setDurum(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[170px] bg-card">
            <SelectValue placeholder={t("Durum")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Durumlar")}</SelectItem>
            {(["planlandi", "devam", "tamamlandi"] as OperatorKontrolDurum[]).map((d) => (
              <SelectItem key={d} value={d}>{t(OPERATOR_KONTROL_DURUM_META[d].etiket)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="ml-auto h-9 gap-1.5 bg-blue-600 text-white shadow-sm hover:bg-blue-700" onClick={() => toast(t("Bu özellik yakında eklenecek."))}>
          <Icon icon="solar:add-circle-bold-duotone" className="size-4" />
          {t("Yeni Form")}
        </Button>
      </div>

      <p className="-mt-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{filtreli.length}</span> / {data.length} {t("form")}
      </p>

      {filtreli.length === 0 ? (
        <BosDurum baslik={t("Form bulunamadı")} aciklama={t("Arama veya filtre kriterlerine uygun operatör formu yok.")} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Form No")}</TableHead>
                  <TableHead>{t("Makine")}</TableHead>
                  <TableHead>{t("Hafta")}</TableHead>
                  <TableHead>{t("Operatör")}</TableHead>
                  <TableHead>{t("İlerleme")}</TableHead>
                  <TableHead className="text-center">{t("Uygunsuzluk")}</TableHead>
                  <TableHead>{t("Durum")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtreli.map((k) => {
                  const dm = OPERATOR_KONTROL_DURUM_META[k.durum];
                  const yuzde = k.toplamMadde ? Math.round((k.tamamlananMadde / k.toplamMadde) * 100) : 0;
                  return (
                    <TableRow key={k.id} onClick={() => router.push(`/bakim/operator-kontrolleri/${k.id}`)} className="cursor-pointer">
                      <TableCell className="font-medium tabular-nums">{k.no}</TableCell>
                      <TableCell>{k.makineAd}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{k.hafta}</TableCell>
                      <TableCell>
                        <div>{k.operator}</div>
                        {k.vardiya ? <div className="text-xs text-muted-foreground">{t(k.vardiya)}</div> : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                            <span className="block h-full rounded-full bg-blue-500" style={{ width: `${yuzde}%` }} />
                          </span>
                          <span className="text-xs tabular-nums text-muted-foreground">{k.tamamlananMadde}/{k.toplamMadde}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {k.uygunsuzlukSayi > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700 tabular-nums dark:bg-red-950 dark:text-red-300">
                            <Icon icon="solar:danger-triangle-bold" className="size-3" />
                            {k.uygunsuzlukSayi}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", dm.sinif)}>
                          <span className={cn("size-1.5 rounded-full", dm.nokta)} />
                          {t(dm.etiket)}
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
