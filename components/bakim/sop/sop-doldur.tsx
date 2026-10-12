"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useSop, useMakineler } from "@/lib/queries/bakim";
import { useProfil } from "@/lib/hooks/use-profil";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import {
  CHECKLIST_TIP_META,
  MADDE_DURUM_META,
  MADDE_TURU_ETIKET,
  OPERATOR_DURUM_META,
} from "@/components/bakim/makineler/stiller";
import type { Foto, SopMadde } from "@/lib/types/bakim";

type DolduruluyorMadde = SopMadde & { durum: string; not?: string; fotograflar: Foto[] };
type DurumMeta = { etiket: string; sinif: string; renk: string; ikon: string };

export function SopDoldur() {
  const { t } = useDil();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data: sop, isLoading } = useSop(id ?? "");
  const { data: makineler } = useMakineler();
  const { profil } = useProfil();
  const personel = profil?.ad_soyad ?? "Teknisyen";

  const [maddeler, setMaddeler] = React.useState<DolduruluyorMadde[]>([]);
  const [tamam, setTamam] = React.useState(false);

  const aktif = sop?.versiyonlar.find((v) => v.id === sop.aktifVersiyonId) ?? sop?.versiyonlar[sop.versiyonlar.length - 1];

  React.useEffect(() => {
    if (aktif) {
      setMaddeler(aktif.maddeler.map((m) => ({ ...m, durum: "bekliyor", not: "", fotograflar: [] })));
      setTamam(false);
    }
  }, [aktif?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const operatorMu = sop?.tip === "OPERATOR_INSPECTION";
  const secimler = operatorMu ? ["uygun", "uygunsuzluk"] : ["tamamlandi", "bulguVar", "uygulanmadi", "uygulanamaz"];
  const metaMap = (operatorMu ? OPERATOR_DURUM_META : MADDE_DURUM_META) as Record<string, DurumMeta>;

  const islenen = maddeler.filter((m) => m.durum !== "bekliyor").length;
  const toplam = maddeler.length;
  const yuzde = toplam ? Math.round((islenen / toplam) * 100) : 0;
  const hepsi = toplam > 0 && islenen === toplam;
  const bulgu = maddeler.filter((m) => m.durum === "bulguVar" || m.durum === "uygunsuzluk").length;

  function guncelle(i: number, p: Partial<DolduruluyorMadde>) {
    setMaddeler((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...p } : m)));
  }
  function fotoEkle(i: number) {
    const f: Foto = { id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, tur: "yapilanIs", url: "" };
    guncelle(i, { fotograflar: [...(maddeler[i]?.fotograflar ?? []), f] });
    toast.success(t("Fotoğraf eklendi (demo)"));
  }
  function fotoSil(i: number, fid: string) {
    guncelle(i, { fotograflar: (maddeler[i]?.fotograflar ?? []).filter((x) => x.id !== fid) });
  }

  if (isLoading || !sop || !aktif) {
    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <Skeleton className="h-28 w-full" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  const tm = CHECKLIST_TIP_META[sop.tip];
  const makineAd = sop.makineId ? makineler?.find((m) => m.id === sop.makineId)?.ad ?? sop.makineId : null;
  const duzenlenebilir = !tamam;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Başlık */}
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button variant="outline" size="icon" className="mt-0.5 bg-card" nativeButton={false} render={<Link href={`/bakim/sop/${sop.id}`} />} aria-label={t("Geri")}>
                <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
              </Button>
              <div className="space-y-1">
                <h1 className="font-heading text-xl font-bold tracking-tight">{t(sop.ad)}</h1>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", tm.sinif)}>
                    <Icon icon={tm.ikon} className="size-3" /> {t(tm.etiket)}
                  </span>
                  {makineAd ? <span className="inline-flex items-center gap-1.5"><Icon icon="solar:cpu-bolt-linear" className="size-4" /> {makineAd}</span> : null}
                  <span className="inline-flex items-center gap-1.5"><Icon icon="solar:bookmark-linear" className="size-4" /> Rev {aktif.rev}</span>
                  <span className="inline-flex items-center gap-1.5"><Icon icon="solar:user-linear" className="size-4" /> {personel}</span>
                </p>
              </div>
            </div>
            {duzenlenebilir ? (
              <Button className="h-9 gap-1.5 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50" disabled={!hepsi} onClick={() => { setTamam(true); toast.success(bulgu > 0 ? `${t("Form tamamlandı")} — ${bulgu} ${t("bulgu")}` : t("Form tamamlandı.")); }}>
                <Icon icon="solar:check-circle-bold" className="size-4" /> {t("Formu Tamamla")}
              </Button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Icon icon="solar:check-circle-bold" className="size-4" /> {t("Tamamlandı")}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {islenen}/{toplam} {t("madde işlendi")}
                {bulgu > 0 ? <span className="ml-2 font-medium text-red-600 dark:text-red-400">· {bulgu} {t("bulgu")}</span> : null}
              </span>
              <span className="font-semibold tabular-nums">%{yuzde}</span>
            </div>
            <span className="block h-2 overflow-hidden rounded-full bg-muted">
              <span className="block h-full rounded-full bg-blue-500 transition-all" style={{ width: `${yuzde}%` }} />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <div className="space-y-3">
        {maddeler.map((m, i) => {
          const bulguluMu = m.durum === "bulguVar" || m.durum === "uygunsuzluk";
          return (
            <Card key={m.id} className={cn(bulguluMu && "border-red-300 dark:border-red-900")}>
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium tabular-nums">{m.no}</span>
                  {m.bolum ? <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{t(m.bolum)}</span> : null}
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-300">{t(MADDE_TURU_ETIKET[m.turu])}</span>
                  {m.fotoGereksinimi === "zorunlu" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      <Icon icon="solar:camera-bold" className="size-3" /> {t("Fotoğraf zorunlu")}
                    </span>
                  ) : null}
                </div>
                <div>
                  <p className="text-sm font-medium">{t(m.baslik)}</p>
                  {m.aciklama ? <p className="text-xs text-muted-foreground">{t(m.aciklama)}</p> : null}
                </div>

                {/* Durum seçimi */}
                <div className={cn("grid gap-2", operatorMu ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4")}>
                  {secimler.map((d) => {
                    const dm = metaMap[d];
                    const sec = m.durum === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        disabled={!duzenlenebilir}
                        onClick={() => guncelle(i, { durum: d })}
                        className={cn(
                          "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                          sec ? dm.sinif + " border-transparent font-semibold" : "border-border bg-card hover:bg-muted",
                        )}
                      >
                        <Icon icon={dm.ikon} className={cn("size-4", sec ? "" : dm.renk)} />
                        {t(dm.etiket)}
                      </button>
                    );
                  })}
                </div>

                {/* Not + foto (işlenmişse göster) */}
                {m.durum !== "bekliyor" ? (
                  <div className="space-y-2">
                    <Textarea
                      value={m.not ?? ""}
                      disabled={!duzenlenebilir}
                      onChange={(e) => guncelle(i, { not: e.target.value })}
                      placeholder={bulguluMu ? t("Tespit edilen sorunu açıklayın…") : t("İsteğe bağlı not ekleyin…")}
                      className="min-h-14 bg-card text-sm"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      {m.fotograflar.map((f) => (
                        <div key={f.id} className="group relative size-16 overflow-hidden rounded-lg border bg-gradient-to-br from-blue-100 to-slate-200 dark:from-blue-950 dark:to-slate-800">
                          <span className="flex size-full items-center justify-center text-blue-500/70"><Icon icon="solar:camera-bold-duotone" className="size-6" /></span>
                          {duzenlenebilir ? (
                            <button type="button" onClick={() => fotoSil(i, f.id)} aria-label={t("Kaldır")} className="absolute top-0.5 right-0.5 flex size-5 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
                              <Icon icon="solar:close-circle-bold" className="size-4" />
                            </button>
                          ) : null}
                        </div>
                      ))}
                      {duzenlenebilir ? (
                        <Button variant="outline" size="sm" className={cn("h-8 gap-1 bg-card text-xs", m.fotoGereksinimi === "zorunlu" && m.fotograflar.length === 0 && "border-amber-300 text-amber-700 dark:border-amber-800 dark:text-amber-400")} onClick={() => fotoEkle(i)}>
                          <Icon icon="solar:camera-add-bold" className="size-3.5" /> {t("Fotoğraf Ekle")}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
