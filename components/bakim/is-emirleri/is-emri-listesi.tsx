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
import { useIsEmirleri } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { IS_EMRI_DURUM_META, PERIYOT_ETIKET, PERIYOT_META } from "@/components/bakim/makineler/stiller";
import { tarihAyristir } from "@/lib/bakim/tarih";
import type { IsEmri, IsEmriDurum } from "@/lib/types/bakim";

function gecikmisMi(w: IsEmri, bugun: Date): boolean {
  if (w.durum !== "planlandi" && w.durum !== "devam") return false;
  return tarihAyristir(w.planlananTarih) < new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate());
}

export function IsEmriListesi() {
  const { data, isLoading } = useIsEmirleri();
  const { t } = useDil();
  const router = useRouter();

  const [arama, setArama] = React.useState("");
  const [durum, setDurum] = React.useState("hepsi");
  const bugun = React.useMemo(() => new Date(), []);

  const filtreli = React.useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    return (data ?? []).filter((w) => {
      if (durum === "geciken" ? !gecikmisMi(w, bugun) : durum !== "hepsi" && w.durum !== durum) return false;
      if (q) {
        const havuz = `${w.no} ${w.makineAd} ${w.bakimTuru} ${w.sorumluEkip} ${w.teknisyenler.join(" ")}`.toLocaleLowerCase("tr");
        if (!havuz.includes(q)) return false;
      }
      return true;
    });
  }, [data, arama, durum, bugun]);

  if (isLoading || !data) {
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

  const say = (d: IsEmriDurum) => data.filter((w) => w.durum === d).length;
  const geciken = data.filter((w) => gecikmisMi(w, bugun)).length;
  const ozet = [
    { ik: "solar:clipboard-check-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Toplam İş Emri", deger: String(data.length) },
    { ik: "solar:calendar-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Planlandı", deger: String(say("planlandi")) },
    { ik: "solar:refresh-circle-bold-duotone", renk: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300", baslik: "Devam Ediyor", deger: String(say("devam")) },
    { ik: "solar:danger-triangle-bold-duotone", renk: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300", baslik: "Geciken", deger: String(geciken) },
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
            placeholder={t("İş emri no, makine, bakım türü veya teknisyen ara…")}
            className="h-9 bg-card pl-9"
          />
        </div>
        <Select value={durum} onValueChange={(v) => setDurum(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[190px] bg-card">
            <SelectValue placeholder={t("Durum")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Durumlar")}</SelectItem>
            <SelectItem value="geciken">{t("Geciken")}</SelectItem>
            {(["planlandi", "devam", "tamamlandi", "muhendisKontrol", "onaylandi"] as IsEmriDurum[]).map((d) => (
              <SelectItem key={d} value={d}>{t(IS_EMRI_DURUM_META[d].etiket)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="ml-auto h-9 gap-1.5 bg-blue-600 text-white shadow-sm hover:bg-blue-700" onClick={() => toast(t("Bu özellik yakında eklenecek."))}>
          <Icon icon="solar:add-circle-bold-duotone" className="size-4" />
          {t("Yeni İş Emri")}
        </Button>
      </div>

      <p className="-mt-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{filtreli.length}</span> / {data.length} {t("iş emri")}
      </p>

      {filtreli.length === 0 ? (
        <BosDurum baslik={t("İş emri bulunamadı")} aciklama={t("Arama veya filtre kriterlerine uygun iş emri yok.")} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("İş Emri")}</TableHead>
                  <TableHead>{t("Makine")}</TableHead>
                  <TableHead>{t("Bakım Türü")}</TableHead>
                  <TableHead className="text-center">{t("Planlanan")}</TableHead>
                  <TableHead>{t("İlerleme")}</TableHead>
                  <TableHead>{t("Durum")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtreli.map((w) => {
                  const dm = IS_EMRI_DURUM_META[w.durum];
                  const per = PERIYOT_META[w.periyot];
                  const yuzde = w.toplamMadde ? Math.round((w.tamamlananMadde / w.toplamMadde) * 100) : 0;
                  const gec = gecikmisMi(w, bugun);
                  return (
                    <TableRow key={w.id} onClick={() => router.push(`/bakim/is-emirleri/${w.id}`)} className="cursor-pointer">
                      <TableCell className="font-medium tabular-nums">{w.no}</TableCell>
                      <TableCell>{w.makineAd}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{t(w.bakimTuru)}</span>
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", per.sinif)}>
                            {t(PERIYOT_ETIKET[w.periyot])}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="tabular-nums">{w.planlananTarih}</div>
                        {gec ? <div className="text-[10px] font-medium text-red-600 dark:text-red-400">{t("Gecikti")}</div> : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                            <span className="block h-full rounded-full bg-blue-500" style={{ width: `${yuzde}%` }} />
                          </span>
                          <span className="text-xs tabular-nums text-muted-foreground">{w.tamamlananMadde}/{w.toplamMadde}</span>
                        </div>
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
