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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BosDurum } from "@/components/common/bos-durum";
import { useBulgular } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { BULGU_DURUM_META, BULGU_KAYNAK_META } from "@/components/bakim/makineler/stiller";
import type { Bulgu, BulguDurum } from "@/lib/types/bakim";

const DURUM_SIRA: Record<BulguDurum, number> = { acik: 0, planlandi: 1, tamamlandi: 2, iptal: 3 };
const DURUM_AKIS: BulguDurum[] = ["acik", "planlandi", "tamamlandi", "iptal"];

export function BulguListesi() {
  const { data, isLoading } = useBulgular();
  const { t } = useDil();

  const [bulgular, setBulgular] = React.useState<Bulgu[]>([]);
  const [arama, setArama] = React.useState("");
  const [durum, setDurum] = React.useState("hepsi");
  const [kaynak, setKaynak] = React.useState("hepsi");
  const [seciliId, setSeciliId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (data) setBulgular(data.map((b) => ({ ...b })));
  }, [data]);

  const filtreli = React.useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    return bulgular
      .filter((b) => {
        if (durum !== "hepsi" && b.durum !== durum) return false;
        if (kaynak !== "hepsi" && b.kaynak !== kaynak) return false;
        if (q) {
          const havuz = `${b.makineAd} ${b.aciklama} ${b.sorumlu ?? ""} ${b.onerilenAksiyon ?? ""}`.toLocaleLowerCase("tr");
          if (!havuz.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => DURUM_SIRA[a.durum] - DURUM_SIRA[b.durum]);
  }, [bulgular, arama, durum, kaynak]);

  const secili = bulgular.find((b) => b.id === seciliId) ?? null;

  function durumDegistir(id: string, yeni: BulguDurum) {
    setBulgular((prev) => prev.map((b) => (b.id === id ? { ...b, durum: yeni } : b)));
    toast.success(`${t("Bulgu durumu güncellendi")}: ${t(BULGU_DURUM_META[yeni].etiket)}`);
  }

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

  const say = (d: BulguDurum) => bulgular.filter((b) => b.durum === d).length;
  const ozet = [
    { ik: "solar:danger-triangle-bold-duotone", renk: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", baslik: "Toplam Bulgu", deger: String(bulgular.length) },
    { ik: "solar:danger-triangle-bold-duotone", renk: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300", baslik: "Açık", deger: String(say("acik")) },
    { ik: "solar:calendar-mark-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Planlandı", deger: String(say("planlandi")) },
    { ik: "solar:check-circle-bold-duotone", renk: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", baslik: "Tamamlandı", deger: String(say("tamamlandi")) },
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
            placeholder={t("Makine, açıklama veya sorumlu ara…")}
            className="h-9 bg-card pl-9"
          />
        </div>
        <Select value={durum} onValueChange={(v) => setDurum(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[150px] bg-card">
            <SelectValue placeholder={t("Durum")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Durumlar")}</SelectItem>
            {DURUM_AKIS.map((d) => (
              <SelectItem key={d} value={d}>{t(BULGU_DURUM_META[d].etiket)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={kaynak} onValueChange={(v) => setKaynak(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[150px] bg-card">
            <SelectValue placeholder={t("Kaynak")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Kaynaklar")}</SelectItem>
            <SelectItem value="bakim">{t("Bakım (SOP)")}</SelectItem>
            <SelectItem value="operator">{t("Operatör")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="-mt-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{filtreli.length}</span> / {bulgular.length} {t("bulgu")}
      </p>

      {filtreli.length === 0 ? (
        <BosDurum ikon="solar:check-circle-bold-duotone" baslik={t("Bulgu bulunamadı")} aciklama={t("Arama veya filtre kriterlerine uygun bulgu yok.")} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Makine")}</TableHead>
                  <TableHead>{t("Bulgu")}</TableHead>
                  <TableHead>{t("Kaynak")}</TableHead>
                  <TableHead>{t("Sorumlu")}</TableHead>
                  <TableHead className="text-center">{t("Termin")}</TableHead>
                  <TableHead>{t("Durum")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtreli.map((b) => {
                  const dm = BULGU_DURUM_META[b.durum];
                  const km = BULGU_KAYNAK_META[b.kaynak];
                  return (
                    <TableRow key={b.id} onClick={() => setSeciliId(b.id)} className="cursor-pointer">
                      <TableCell className="font-medium whitespace-nowrap">{b.makineAd}</TableCell>
                      <TableCell className="max-w-[320px]">
                        <span className="line-clamp-1">{t(b.aciklama)}</span>
                      </TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", km.sinif)}>
                          <Icon icon={km.ikon} className="size-3" />
                          {t(km.etiket)}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{b.sorumlu ? t(b.sorumlu) : "—"}</TableCell>
                      <TableCell className="text-center tabular-nums whitespace-nowrap">{b.termin ?? "—"}</TableCell>
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

      {/* Detay paneli */}
      <Sheet open={!!secili} onOpenChange={(o) => !o && setSeciliId(null)}>
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md">
          {secili ? (
            <>
              <SheetHeader className="border-b p-5 pr-12">
                <div className="flex flex-wrap items-center gap-2">
                  <SheetTitle className="text-lg">{secili.makineAd}</SheetTitle>
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", BULGU_DURUM_META[secili.durum].sinif)}>
                    <span className={cn("size-1.5 rounded-full", BULGU_DURUM_META[secili.durum].nokta)} />
                    {t(BULGU_DURUM_META[secili.durum].etiket)}
                  </span>
                </div>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium", BULGU_KAYNAK_META[secili.kaynak].sinif)}>
                    <Icon icon={BULGU_KAYNAK_META[secili.kaynak].ikon} className="size-3" />
                    {t(BULGU_KAYNAK_META[secili.kaynak].etiket)}
                  </span>
                  <span className="inline-flex items-center gap-1"><Icon icon="solar:calendar-linear" className="size-3.5" /> {secili.olusturmaTarihi}</span>
                </p>
              </SheetHeader>

              <div className="space-y-5 p-5">
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">{t("Açıklama")}</p>
                  <p className="text-sm">{t(secili.aciklama)}</p>
                </div>
                {secili.onerilenAksiyon ? (
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">{t("Önerilen Aksiyon")}</p>
                    <p className="text-sm">{t(secili.onerilenAksiyon)}</p>
                  </div>
                ) : null}

                <dl className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between border-b border-dashed pb-2">
                    <dt className="text-muted-foreground">{t("Makine")}</dt>
                    <dd><Link href={`/bakim/makineler/${secili.makineId}`} className="font-medium hover:text-blue-600 hover:underline dark:hover:text-blue-400">{secili.makineAd}</Link></dd>
                  </div>
                  {secili.isEmriId ? (
                    <div className="flex items-center justify-between border-b border-dashed pb-2">
                      <dt className="text-muted-foreground">{t("İş Emri")}</dt>
                      <dd><Link href={`/bakim/is-emirleri/${secili.isEmriId}`} className="font-medium hover:text-blue-600 hover:underline dark:hover:text-blue-400">{secili.isEmriId.toUpperCase().replace("WO-", "WO-")}</Link></dd>
                    </div>
                  ) : null}
                  {secili.sopMaddeNo ? (
                    <div className="flex items-center justify-between border-b border-dashed pb-2">
                      <dt className="text-muted-foreground">{t("SOP Madde")}</dt>
                      <dd className="font-medium tabular-nums">{secili.sopMaddeNo}</dd>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between border-b border-dashed pb-2">
                    <dt className="text-muted-foreground">{t("Sorumlu")}</dt>
                    <dd className="font-medium">{secili.sorumlu ? t(secili.sorumlu) : "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-dashed pb-2">
                    <dt className="text-muted-foreground">{t("Termin")}</dt>
                    <dd className="font-medium tabular-nums">{secili.termin ?? "—"}</dd>
                  </div>
                </dl>

                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">{t("Durumu Güncelle")}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {DURUM_AKIS.map((d) => {
                      const m = BULGU_DURUM_META[d];
                      const aktif = secili.durum === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => durumDegistir(secili.id, d)}
                          className={cn(
                            "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                            aktif ? m.sinif + " border-transparent ring-2 ring-offset-1 ring-offset-background" : "border-border bg-card hover:bg-muted",
                          )}
                        >
                          <Icon icon={m.ikon} className="size-4" />
                          {t(m.etiket)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
