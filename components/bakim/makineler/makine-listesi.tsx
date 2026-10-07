"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
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
import { useMakineler } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { KRITIKLIK_META, uyumRenk } from "@/components/bakim/makineler/stiller";
import type { Kritiklik, Makine } from "@/lib/types/bakim";

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

const KRITIKLIK_SIRA: Record<Kritiklik, number> = { kritik: 0, yuksek: 1, orta: 2, dusuk: 3 };

function Ozet({ makineler }: { makineler: Makine[] }) {
  const { t } = useDil();
  const toplam = makineler.length;
  const kritikSayi = makineler.filter((m) => m.kritiklik === "kritik" || m.kritiklik === "yuksek").length;
  const acikIsEmri = makineler.reduce((s, m) => s + m.acikIsEmri, 0);
  const ortUyum = toplam ? Math.round(makineler.reduce((s, m) => s + m.uyumOrani, 0) / toplam) : 0;

  const kartlar = [
    { ik: "solar:cpu-bolt-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Toplam Makine", deger: String(toplam) },
    { ik: "solar:danger-triangle-bold-duotone", renk: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300", baslik: "Kritik / Yüksek", deger: String(kritikSayi) },
    { ik: "solar:clipboard-list-bold-duotone", renk: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300", baslik: "Açık İş Emri", deger: String(acikIsEmri) },
    { ik: "solar:shield-check-bold-duotone", renk: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", baslik: "Ortalama Uyum", deger: `%${ortUyum}` },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kartlar.map((k) => (
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
  );
}

function MakineKarti({ m }: { m: Makine }) {
  const { t } = useDil();
  const krit = KRITIKLIK_META[m.kritiklik];
  const uyum = uyumRenk(m.uyumOrani);
  return (
    <Link
      href={`/bakim/makineler/${m.id}`}
      className="group flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:hover:border-blue-800"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
          <Icon icon={BOLUM_IKON[m.bolum] ?? VARSAYILAN_IKON} className="size-6" />
        </span>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", krit.sinif)}>
          <span className={cn("size-1.5 rounded-full", krit.nokta)} />
          {t(krit.etiket)}
        </span>
      </div>

      <h3 className="mt-3 truncate font-heading text-base font-semibold tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {m.ad}
      </h3>
      <p className="text-xs text-muted-foreground">
        {m.kod} · {t(m.bolum)}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t pt-3 text-xs">
        <span className="text-muted-foreground">{t("Son Bakım")}</span>
        <span className="text-right font-medium tabular-nums">{m.sonBakim ?? "—"}</span>
        <span className="text-muted-foreground">{t("Sonraki Bakım")}</span>
        <span className="text-right font-medium tabular-nums">{m.sonrakiBakim ?? "—"}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Icon icon="solar:clipboard-list-linear" className="size-3.5" />
          {m.acikIsEmri > 0 ? (
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {m.acikIsEmri} {t("açık iş emri")}
            </span>
          ) : (
            t("açık iş emri yok")
          )}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
            <span className={cn("block h-full rounded-full", uyum.bar)} style={{ width: `${m.uyumOrani}%` }} />
          </span>
          <span className={cn("text-[11px] font-semibold tabular-nums", uyum.metin)}>%{m.uyumOrani}</span>
        </span>
      </div>
    </Link>
  );
}

export function MakineListesi() {
  const { data, isLoading } = useMakineler();
  const { t } = useDil();
  const router = useRouter();

  const [arama, setArama] = React.useState("");
  const [bolum, setBolum] = React.useState("hepsi");
  const [kritiklik, setKritiklik] = React.useState("hepsi");
  const [gorunum, setGorunum] = React.useState<"kart" | "tablo">("kart");

  const bolumler = React.useMemo(
    () => Array.from(new Set((data ?? []).map((m) => m.bolum))).sort(),
    [data],
  );

  const filtreli = React.useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    return (data ?? [])
      .filter((m) => {
        if (bolum !== "hepsi" && m.bolum !== bolum) return false;
        if (kritiklik !== "hepsi" && m.kritiklik !== kritiklik) return false;
        if (q) {
          const havuz = `${m.ad} ${m.kod} ${m.marka ?? ""} ${m.model ?? ""} ${m.seriNo ?? ""}`.toLocaleLowerCase("tr");
          if (!havuz.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => KRITIKLIK_SIRA[a.kritiklik] - KRITIKLIK_SIRA[b.kritiklik] || a.ad.localeCompare(b.ad, "tr"));
  }, [data, arama, bolum, kritiklik]);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Ozet makineler={data} />

      {/* Araç çubuğu */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Icon icon="solar:magnifer-linear" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            placeholder={t("Makine adı, kod, marka veya seri no ara…")}
            className="h-9 bg-card pl-9"
          />
        </div>

        <Select value={bolum} onValueChange={(v) => setBolum(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[160px] bg-card">
            <SelectValue placeholder={t("Bölüm")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Bölümler")}</SelectItem>
            {bolumler.map((b) => (
              <SelectItem key={b} value={b}>{t(b)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={kritiklik} onValueChange={(v) => setKritiklik(v ?? "hepsi")}>
          <SelectTrigger size="sm" className="w-[150px] bg-card">
            <SelectValue placeholder={t("Kritiklik")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hepsi">{t("Tüm Kritiklikler")}</SelectItem>
            {(["kritik", "yuksek", "orta", "dusuk"] as Kritiklik[]).map((k) => (
              <SelectItem key={k} value={k}>{t(KRITIKLIK_META[k].etiket)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1 rounded-lg border bg-card p-0.5">
          {(["kart", "tablo"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGorunum(g)}
              aria-label={t(g === "kart" ? "Kart görünümü" : "Tablo görünümü")}
              className={cn(
                "flex size-7 items-center justify-center rounded-md transition-colors",
                gorunum === g ? "bg-blue-600 text-white" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon icon={g === "kart" ? "solar:widget-5-bold" : "solar:list-bold"} className="size-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Sonuç sayısı */}
      <p className="-mt-2 text-xs text-muted-foreground">
        <span className="tabular-nums">{filtreli.length}</span> / {data.length} {t("makine")}
      </p>

      {filtreli.length === 0 ? (
        <BosDurum baslik={t("Makine bulunamadı")} aciklama={t("Arama veya filtre kriterlerine uygun makine yok.")} />
      ) : gorunum === "kart" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtreli.map((m) => <MakineKarti key={m.id} m={m} />)}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Makine / Ekipman")}</TableHead>
                  <TableHead>{t("Bölüm")}</TableHead>
                  <TableHead>{t("Kritiklik")}</TableHead>
                  <TableHead className="text-center">{t("Son Bakım")}</TableHead>
                  <TableHead className="text-center">{t("Sonraki Bakım")}</TableHead>
                  <TableHead className="text-center">{t("Açık İş Emri")}</TableHead>
                  <TableHead className="text-right">{t("Uyum")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtreli.map((m) => {
                  const krit = KRITIKLIK_META[m.kritiklik];
                  const uyum = uyumRenk(m.uyumOrani);
                  return (
                    <TableRow
                      key={m.id}
                      onClick={() => router.push(`/bakim/makineler/${m.id}`)}
                      className="cursor-pointer"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                            <Icon icon={BOLUM_IKON[m.bolum] ?? VARSAYILAN_IKON} className="size-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="truncate font-medium">{m.ad}</div>
                            <div className="text-xs text-muted-foreground">{m.kod}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{t(m.bolum)}</TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", krit.sinif)}>
                          <span className={cn("size-1.5 rounded-full", krit.nokta)} />
                          {t(krit.etiket)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center tabular-nums">{m.sonBakim ?? "—"}</TableCell>
                      <TableCell className="text-center tabular-nums">{m.sonrakiBakim ?? "—"}</TableCell>
                      <TableCell className="text-center">
                        {m.acikIsEmri > 0 ? (
                          <span className="inline-flex items-center justify-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 tabular-nums dark:bg-amber-950 dark:text-amber-300">
                            {m.acikIsEmri}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn("font-semibold tabular-nums", uyum.metin)}>%{m.uyumOrani}</span>
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
