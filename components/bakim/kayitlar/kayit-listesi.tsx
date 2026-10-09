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
import { useBakimKayitlar, useMakineler } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { csvIndir } from "@/lib/disa-aktar";
import { tarihAyristir } from "@/lib/bakim/tarih";
import { cn } from "@/lib/utils";
import { KAYIT_KAYNAK_META, KAYIT_SONUC_META, PERIYOT_ETIKET, PERIYOT_META } from "@/components/bakim/makineler/stiller";
import type { BakimPeriyot } from "@/lib/types/bakim";

function sureBicim(s: number): string {
  return s < 1 ? `${Math.round(s * 60)} dk` : `${s} sa`;
}

export function KayitListesi() {
  const { data, isLoading } = useBakimKayitlar();
  const { data: makineler } = useMakineler();
  const { t } = useDil();
  const router = useRouter();

  const [arama, setArama] = React.useState("");
  const [makineId, setMakineId] = React.useState("hepsi");
  const [periyot, setPeriyot] = React.useState("hepsi");
  const [kaynak, setKaynak] = React.useState("hepsi");

  const filtreli = React.useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    return (data ?? [])
      .filter((k) => {
        if (makineId !== "hepsi" && k.makineId !== makineId) return false;
        if (periyot !== "hepsi" && k.periyot !== periyot) return false;
        if (kaynak !== "hepsi" && k.kaynak !== kaynak) return false;
        if (q) {
          const havuz = `${k.formNo} ${k.makineAd} ${k.bakimTuru} ${k.yapan} ${k.onaylayan ?? ""}`.toLocaleLowerCase("tr");
          if (!havuz.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => tarihAyristir(b.tarih).getTime() - tarihAyristir(a.tarih).getTime());
  }, [data, arama, makineId, periyot, kaynak]);

  function disaAktar() {
    if (filtreli.length === 0) {
      toast.error(t("Dışa aktarılacak kayıt yok"));
      return;
    }
    const basliklar = [t("Tarih"), t("Form No"), t("Makine"), t("Bakım Türü"), t("Periyot"), t("Kaynak"), t("Yapan"), t("Süre (sa)"), t("Sonuç"), t("Onaylayan")];
    const satirlar = filtreli.map((k) => [
      k.tarih, k.formNo, k.makineAd, t(k.bakimTuru), t(PERIYOT_ETIKET[k.periyot]),
      t(KAYIT_KAYNAK_META[k.kaynak].etiket), t(k.yapan), String(k.sureSaat),
      t(KAYIT_SONUC_META[k.sonuc].etiket), k.onaylayan ?? "-",
    ]);
    csvIndir("bakim-kayitlari", basliklar, satirlar);
    toast.success(`${filtreli.length} ${t("kayıt Excel'e aktarıldı")}`);
  }

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

  const toplamSure = data.reduce((s, k) => s + k.sureSaat, 0);
  const buYil = data.filter((k) => k.tarih.endsWith("2026")).length;
  const bulguCikan = data.filter((k) => k.bulguSayi > 0).length;
  const ozet = [
    { ik: "solar:archive-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Toplam Kayıt", deger: String(data.length) },
    { ik: "solar:calendar-bold-duotone", renk: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-300", baslik: "Bu Yıl", deger: String(buYil) },
    { ik: "solar:clock-circle-bold-duotone", renk: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", baslik: "Toplam Süre", deger: `${toplamSure} sa` },
    { ik: "solar:danger-triangle-bold-duotone", renk: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300", baslik: "Bulgu Çıkan", deger: String(bulguCikan) },
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
        <div className="relative min-w-[200px] flex-1">
          <Icon icon="solar:magnifer-linear" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder={t("Form no, makine, bakım türü veya yapan ara…")}
            className="h-9 bg-card pl-9"
          />
        </div>
        <Select value={makineId} onValueChange={(v) => setMakineId(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[170px] bg-card">
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
          <SelectTrigger size="sm" className="w-[140px] bg-card">
            <SelectValue placeholder={t("Periyot")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Periyotlar")}</SelectItem>
            {(["haftalik", "aylik", "3aylik", "6aylik", "yillik"] as BakimPeriyot[]).map((p) => (
              <SelectItem key={p} value={p}>{t(PERIYOT_ETIKET[p])}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={kaynak} onValueChange={(v) => setKaynak(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[150px] bg-card">
            <SelectValue placeholder={t("Kaynak")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Kaynaklar")}</SelectItem>
            <SelectItem value="teknik">{t("Teknik Bakım")}</SelectItem>
            <SelectItem value="operator">{t("Operatör")}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9 gap-1.5 bg-card" onClick={disaAktar}>
          <Icon icon="vscode-icons:file-type-excel" className="size-4" />
          {t("Excel'e Aktar")}
        </Button>
      </div>

      <p className="-mt-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{filtreli.length}</span> / {data.length} {t("kayıt")}
      </p>

      {filtreli.length === 0 ? (
        <BosDurum baslik={t("Kayıt bulunamadı")} aciklama={t("Arama veya filtre kriterlerine uygun bakım kaydı yok.")} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Tarih")}</TableHead>
                  <TableHead>{t("Form No")}</TableHead>
                  <TableHead>{t("Makine")}</TableHead>
                  <TableHead>{t("Bakım Türü")}</TableHead>
                  <TableHead>{t("Kaynak")}</TableHead>
                  <TableHead>{t("Yapan")}</TableHead>
                  <TableHead className="text-center">{t("Süre")}</TableHead>
                  <TableHead>{t("Sonuç")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtreli.map((k) => {
                  const sm = KAYIT_SONUC_META[k.sonuc];
                  const km = KAYIT_KAYNAK_META[k.kaynak];
                  const per = PERIYOT_META[k.periyot];
                  const tiklanabilir = !!k.isEmriId;
                  return (
                    <TableRow
                      key={k.id}
                      onClick={() => k.isEmriId && router.push(`/bakim/is-emirleri/${k.isEmriId}`)}
                      className={cn(tiklanabilir && "cursor-pointer")}
                    >
                      <TableCell className="tabular-nums whitespace-nowrap">{k.tarih}</TableCell>
                      <TableCell className="font-medium tabular-nums whitespace-nowrap">{k.formNo}</TableCell>
                      <TableCell className="whitespace-nowrap">{k.makineAd}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="whitespace-nowrap">{t(k.bakimTuru)}</span>
                          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", per.sinif)}>
                            {t(PERIYOT_ETIKET[k.periyot])}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", km.sinif)}>
                          <Icon icon={km.ikon} className="size-3" />
                          {t(km.etiket)}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{t(k.yapan)}</TableCell>
                      <TableCell className="text-center tabular-nums whitespace-nowrap">{sureBicim(k.sureSaat)}</TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", sm.sinif)}>
                          <span className={cn("size-1.5 rounded-full", sm.nokta)} />
                          {t(sm.etiket)}
                          {k.bulguSayi > 0 ? <span className="tabular-nums"> ({k.bulguSayi})</span> : null}
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
