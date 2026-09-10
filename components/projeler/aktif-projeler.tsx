"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DURUM_META, KAYNAK_ETIKET, KAYNAK_RENK, KAYNAK_STIL } from "@/components/projeler/stiller";
import { ProjeDetayDrawer } from "@/components/projeler/proje-detay-drawer";
import { useProjeAnaliz } from "@/lib/queries/projeler";
import { useDil } from "@/components/providers/dil-provider";
import { sayi, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Proje } from "@/lib/types";

function Alan({ etiket, deger, vurgu }: { etiket: string; deger: string; vurgu?: string }) {
  return (
    <div className="min-w-0">
      <dt className="truncate text-xs text-muted-foreground">{etiket}</dt>
      <dd className={cn("mt-0.5 truncate text-sm font-medium tabular-nums", vurgu)}>{deger}</dd>
    </div>
  );
}

function ProjeKart({ p }: { p: Proje }) {
  const { t } = useDil();
  const stil = KAYNAK_STIL[p.kaynak];
  const durum = DURUM_META[p.durum];
  const kalan = p.butce - p.harcanan;

  return (
    <div className="rounded-xl border p-4 transition-shadow hover:shadow-sm">
      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* Kimlik + ilerleme */}
        <div className="min-w-0 space-y-3">
          <div className="flex items-start gap-3">
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", stil.sinif)}>
              <Icon icon={stil.ikon} className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{t(p.ad)}</p>
              <p className="truncate text-xs text-muted-foreground">{t(p.aciklama)}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                  <span className="size-1.5 rounded-full" style={{ background: KAYNAK_RENK[p.kaynak] }} />
                  {t(KAYNAK_ETIKET[p.kaynak])}
                </span>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", durum.sinif)}>{t(durum.etiket)}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("İlerleme")}</span>
              <span className="font-medium tabular-nums text-foreground">%{p.ilerleme}</span>
            </div>
            <span className="block h-2 w-full overflow-hidden rounded-full bg-muted">
              <span className="block h-full rounded-full bg-teal-500" style={{ width: `${p.ilerleme}%` }} />
            </span>
          </div>
        </div>

        {/* Bilgi ızgarası — hizalı 4×2 */}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 lg:border-l lg:pl-5">
          <Alan etiket={t("Başlangıç")} deger={p.baslangic} />
          <Alan etiket={t("Hedef Bitiş")} deger={p.hedefBitis} />
          <Alan etiket={t("Sorumlu")} deger={t(p.sorumlu)} />
          <Alan etiket={t("Geri Dönüş")} deger={`${sayiOndalik(p.geriDonus)} ${t("yıl")}`} />
          <Alan etiket={t("Bütçe")} deger={`${sayi(p.butce)} TL`} />
          <Alan etiket={t("Harcanan")} deger={`${sayi(p.harcanan)} TL`} />
          <Alan etiket={t("Kalan Bütçe")} deger={`${sayi(kalan)} TL`} />
          <Alan etiket={t("Beklenen Tasarruf")} deger={`${sayiOndalik(p.beklenenTasarruf)} TEP/yıl`} vurgu="text-emerald-600" />
        </dl>
      </div>

      <div className="mt-3 flex justify-end border-t pt-3">
        <ProjeDetayDrawer
          proje={p}
          trigger={
            <button type="button" className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-80">
              {t("Projeyi Görüntüle")}
              <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
            </button>
          }
        />
      </div>
    </div>
  );
}

export function AktifProjeler() {
  const { data, isLoading } = useProjeAnaliz();
  const { t } = useDil();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Aktif Projeler")}</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading || !data ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}</div>
        ) : (
          <>
            {data.projeler.slice(0, 3).map((p) => <ProjeKart key={p.id} p={p} />)}
            <Link
              href="#tum-projeler"
              className="mt-auto inline-flex items-center gap-1 self-start text-sm font-medium text-primary transition-opacity hover:opacity-80"
            >
              {t("Tüm Projeleri Görüntüle")}
              <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
