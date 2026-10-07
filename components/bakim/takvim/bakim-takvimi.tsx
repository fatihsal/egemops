"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlanlar, useMakineler } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { PERIYOT_ETIKET, PERIYOT_META } from "@/components/bakim/makineler/stiller";
import {
  AY_ADLARI,
  GUN_KISA,
  ayIzgarasi,
  ayniGun,
  planAyOlusumlari,
  tarihBicim,
} from "@/lib/bakim/tarih";
import type { BakimPeriyot, BakimPlani } from "@/lib/types/bakim";

type Olay = { plan: BakimPlani; makineAd: string };

function sureBicim(saat: number): string {
  return saat < 1 ? `${Math.round(saat * 60)} dk` : `${saat} sa`;
}

export function BakimTakvimi() {
  const { data: planlar, isLoading } = usePlanlar();
  const { data: makineler } = useMakineler();
  const { t } = useDil();

  const bugun = React.useMemo(() => new Date(), []);
  const [yil, setYil] = React.useState(bugun.getFullYear());
  const [ay, setAy] = React.useState(bugun.getMonth());
  const [secili, setSecili] = React.useState<Date>(bugun);

  const makineAd = React.useMemo(
    () => new Map((makineler ?? []).map((m) => [m.id, m.ad])),
    [makineler],
  );

  // Ayın günlerine göre olaylar (gün numarası → olaylar).
  const gunOlaylari = React.useMemo(() => {
    const harita = new Map<number, Olay[]>();
    for (const plan of planlar ?? []) {
      const ad = makineAd.get(plan.makineId) ?? plan.makineId;
      for (const d of planAyOlusumlari(plan, yil, ay)) {
        const g = d.getDate();
        const liste = harita.get(g) ?? [];
        liste.push({ plan, makineAd: ad });
        harita.set(g, liste);
      }
    }
    return harita;
  }, [planlar, makineAd, yil, ay]);

  const izgara = React.useMemo(() => ayIzgarasi(yil, ay), [yil, ay]);
  const toplamOlay = React.useMemo(
    () => Array.from(gunOlaylari.values()).reduce((s, l) => s + l.length, 0),
    [gunOlaylari],
  );

  const seciliOlaylar: Olay[] =
    secili.getFullYear() === yil && secili.getMonth() === ay
      ? gunOlaylari.get(secili.getDate()) ?? []
      : [];

  function ayDegistir(delta: number) {
    const d = new Date(yil, ay + delta, 1);
    setYil(d.getFullYear());
    setAy(d.getMonth());
    // Seçili günü yeni ayın içinde tut (bugün aynı aydaysa bugünü seç).
    if (bugun.getFullYear() === d.getFullYear() && bugun.getMonth() === d.getMonth()) {
      setSecili(bugun);
    } else {
      setSecili(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }

  function buguneGit() {
    setYil(bugun.getFullYear());
    setAy(bugun.getMonth());
    setSecili(bugun);
  }

  if (isLoading || !planlar) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-[520px] w-full" />
          <Skeleton className="h-[520px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Üst bar: ay navigasyonu + lejant */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" className="bg-card" aria-label={t("Önceki ay")} onClick={() => ayDegistir(-1)}>
            <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
          </Button>
          <h2 className="min-w-[150px] text-center font-heading text-lg font-bold tracking-tight tabular-nums">
            {t(AY_ADLARI[ay])} {yil}
          </h2>
          <Button variant="outline" size="icon-sm" className="bg-card" aria-label={t("Sonraki ay")} onClick={() => ayDegistir(1)}>
            <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
          </Button>
          <Button variant="outline" size="sm" className="ml-1 bg-card" onClick={buguneGit}>
            {t("Bugün")}
          </Button>
          <span className="ml-1 text-xs text-muted-foreground">
            {toplamOlay} {t("planlı bakım")}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {(["haftalik", "aylik", "3aylik", "6aylik", "yillik"] as BakimPeriyot[]).map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-full", PERIYOT_META[p].nokta)} />
              {t(PERIYOT_ETIKET[p])}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Takvim ızgarası */}
        <Card>
          <CardContent className="p-3 sm:p-4">
            {/* Gün başlıkları */}
            <div className="grid grid-cols-7 gap-1 pb-1">
              {GUN_KISA.map((g) => (
                <div key={g} className="py-1 text-center text-[11px] font-medium text-muted-foreground">
                  {t(g)}
                </div>
              ))}
            </div>
            {/* Günler */}
            <div className="grid grid-cols-7 gap-1">
              {izgara.map((d, i) => {
                const buAy = d.getMonth() === ay;
                const olaylar = buAy ? gunOlaylari.get(d.getDate()) ?? [] : [];
                const buGun = ayniGun(d, bugun);
                const seciliMi = ayniGun(d, secili);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setSecili(d); if (!buAy) { setYil(d.getFullYear()); setAy(d.getMonth()); } }}
                    className={cn(
                      "flex min-h-[78px] flex-col gap-1 rounded-lg border p-1.5 text-left transition-colors",
                      buAy ? "bg-card hover:border-blue-300 dark:hover:border-blue-800" : "bg-muted/40 text-muted-foreground",
                      seciliMi && "border-blue-500 ring-1 ring-blue-500/40",
                      !seciliMi && "border-border",
                    )}
                  >
                    <span className={cn(
                      "flex size-6 items-center justify-center self-start rounded-full text-xs tabular-nums",
                      buGun ? "bg-blue-600 font-semibold text-white" : "font-medium",
                    )}>
                      {d.getDate()}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      {olaylar.slice(0, 3).map((o, j) => (
                        <span
                          key={j}
                          title={`${o.makineAd} · ${t(o.plan.ad)}`}
                          className={cn("flex items-center gap-1 truncate rounded px-1 py-0.5 text-[10px] font-medium", PERIYOT_META[o.plan.periyot].sinif)}
                        >
                          <span className={cn("size-1.5 shrink-0 rounded-full", PERIYOT_META[o.plan.periyot].nokta)} />
                          <span className="truncate">{o.makineAd}</span>
                        </span>
                      ))}
                      {olaylar.length > 3 ? (
                        <span className="px-1 text-[10px] font-medium text-muted-foreground">
                          +{olaylar.length - 3} {t("daha")}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Seçili gün detayı */}
        <Card className="lg:sticky lg:top-4 lg:self-start">
          <CardHeader>
            <h3 className="font-heading text-base font-medium">{tarihBicim(secili)}</h3>
            <p className="text-xs text-muted-foreground">
              {seciliOlaylar.length} {t("planlı bakım")}
            </p>
          </CardHeader>
          <CardContent>
            {seciliOlaylar.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <Icon icon="solar:calendar-minimalistic-linear" className="size-8 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">{t("Bu gün için planlı bakım yok.")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {seciliOlaylar.map((o, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/bakim/makineler/${o.plan.makineId}`}
                        className="truncate text-sm font-semibold hover:text-blue-600 hover:underline dark:hover:text-blue-400"
                      >
                        {o.makineAd}
                      </Link>
                      <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", PERIYOT_META[o.plan.periyot].sinif)}>
                        <span className={cn("size-1.5 rounded-full", PERIYOT_META[o.plan.periyot].nokta)} />
                        {t(PERIYOT_ETIKET[o.plan.periyot])}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{t(o.plan.ad)}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Icon icon="solar:user-linear" className="size-3.5" /> {t(o.plan.sorumlu)}</span>
                      <span className="inline-flex items-center gap-1"><Icon icon="solar:clock-circle-linear" className="size-3.5" /> {sureBicim(o.plan.tahminiSureSaat)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
