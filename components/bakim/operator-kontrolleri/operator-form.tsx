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
import { useOperatorKontrol } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { MADDE_TURU_ETIKET, OPERATOR_KONTROL_DURUM_META } from "@/components/bakim/makineler/stiller";
import type { Foto, OperatorDurum, OperatorKontrolDurum, OperatorMadde } from "@/lib/types/bakim";

export function OperatorForm() {
  const { t } = useDil();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data, isLoading } = useOperatorKontrol(id ?? "");

  const [maddeler, setMaddeler] = React.useState<OperatorMadde[]>([]);
  const [durum, setDurum] = React.useState<OperatorKontrolDurum>("planlandi");

  React.useEffect(() => {
    if (data) {
      setMaddeler(data.maddeler.map((m) => ({ ...m, fotograflar: [...m.fotograflar] })));
      setDurum(data.durum);
    }
  }, [data?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const duzenlenebilir = durum === "planlandi" || durum === "devam";
  const islenen = maddeler.filter((m) => m.durum !== "bekliyor").length;
  const toplam = maddeler.length;
  const yuzde = toplam ? Math.round((islenen / toplam) * 100) : 0;
  const uygunsuzluk = maddeler.filter((m) => m.durum === "uygunsuzluk").length;
  const hepsiIslendi = toplam > 0 && islenen === toplam;

  function guncelle(idx: number, patch: Partial<OperatorMadde>) {
    setMaddeler((prev) => prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)));
  }
  function durumSec(idx: number, yeni: OperatorDurum) {
    guncelle(idx, { durum: yeni });
    if (durum === "planlandi") setDurum("devam");
  }
  function fotoEkle(idx: number) {
    const foto: Foto = { id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, tur: "bulgu", url: "" };
    guncelle(idx, { fotograflar: [...(maddeler[idx]?.fotograflar ?? []), foto] });
    toast.success(t("Fotoğraf eklendi (demo)"));
  }
  function fotoSil(idx: number, fid: string) {
    guncelle(idx, { fotograflar: (maddeler[idx]?.fotograflar ?? []).filter((f) => f.id !== fid) });
  }
  function tamamla() {
    setDurum("tamamlandi");
    toast.success(uygunsuzluk > 0
      ? `${t("Form tamamlandı")} — ${uygunsuzluk} ${t("uygunsuzluk bakıma iletildi.")}`
      : t("Form tamamlandı."));
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  const dm = OPERATOR_KONTROL_DURUM_META[durum];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* Başlık */}
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button variant="outline" size="icon" className="mt-0.5 bg-card" nativeButton={false} render={<Link href="/bakim/operator-kontrolleri" />} aria-label={t("Geri")}>
                <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
              </Button>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-xl font-bold tracking-tight tabular-nums">{data.no}</h1>
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", dm.sinif)}>
                    <span className={cn("size-1.5 rounded-full", dm.nokta)} />
                    {t(dm.etiket)}
                  </span>
                </div>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
                  <Link href={`/bakim/makineler/${data.makineId}`} className="inline-flex items-center gap-1.5 hover:text-blue-600 hover:underline dark:hover:text-blue-400">
                    <Icon icon="solar:cpu-bolt-linear" className="size-4" /> {data.makineAd}
                  </Link>
                  <span className="inline-flex items-center gap-1.5"><Icon icon="solar:calendar-linear" className="size-4" /> {data.hafta}</span>
                  <span className="inline-flex items-center gap-1.5"><Icon icon="solar:user-linear" className="size-4" /> {data.operator}{data.vardiya ? ` · ${t(data.vardiya)}` : ""}</span>
                </p>
              </div>
            </div>
            {duzenlenebilir ? (
              <Button className="h-9 gap-1.5 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50" disabled={!hepsiIslendi} onClick={tamamla}>
                <Icon icon="solar:check-circle-bold" className="size-4" />
                {t("Formu Tamamla")}
              </Button>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Icon icon="solar:check-circle-bold" className="size-4" />
                {t("Tamamlandı")}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {islenen}/{toplam} {t("madde işlendi")}
                {uygunsuzluk > 0 ? <span className="ml-2 font-medium text-red-600 dark:text-red-400">· {uygunsuzluk} {t("uygunsuzluk")}</span> : null}
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
        {maddeler.map((m, idx) => {
          const uygunsuz = m.durum === "uygunsuzluk";
          return (
            <Card key={m.no} className={cn(uygunsuz && "border-red-300 dark:border-red-900")}>
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums">{m.no}</span>
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-300">{t(MADDE_TURU_ETIKET[m.turu])}</span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium">{t(m.gorev)}</p>
                    {m.aciklama ? <p className="text-xs text-muted-foreground">{t(m.aciklama)}</p> : null}
                  </div>
                  {/* Durum butonları */}
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={!duzenlenebilir}
                      onClick={() => durumSec(idx, "uygun")}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                        m.durum === "uygun" ? "border-transparent bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400 ring-offset-1 ring-offset-background dark:bg-emerald-950 dark:text-emerald-300" : "border-border bg-card hover:bg-muted",
                      )}
                    >
                      <Icon icon="solar:check-circle-bold" className={cn("size-4", m.durum === "uygun" ? "" : "text-emerald-500")} />
                      {t("Uygun")}
                    </button>
                    <button
                      type="button"
                      disabled={!duzenlenebilir}
                      onClick={() => durumSec(idx, "uygunsuzluk")}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                        m.durum === "uygunsuzluk" ? "border-transparent bg-red-100 text-red-700 ring-2 ring-red-400 ring-offset-1 ring-offset-background dark:bg-red-950 dark:text-red-300" : "border-border bg-card hover:bg-muted",
                      )}
                    >
                      <Icon icon="solar:danger-triangle-bold" className={cn("size-4", m.durum === "uygunsuzluk" ? "" : "text-red-500")} />
                      {t("Uygunsuzluk")}
                    </button>
                  </div>
                </div>

                {/* Uygunsuzluk → not + foto + bildirim */}
                {uygunsuz ? (
                  <div className="space-y-2 rounded-lg bg-red-50/60 p-3 dark:bg-red-950/30">
                    <p className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-300">
                      <Icon icon="solar:bell-bold" className="size-3.5" />
                      {t("Bu uygunsuzluk bakıma bulgu olarak iletilecek.")}
                    </p>
                    <Textarea
                      value={m.not ?? ""}
                      disabled={!duzenlenebilir}
                      onChange={(e) => guncelle(idx, { not: e.target.value })}
                      placeholder={t("Tespit edilen uygunsuzluğu açıklayın… *")}
                      className="min-h-16 bg-card text-sm"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      {m.fotograflar.map((f) => (
                        <div key={f.id} className="group relative size-16 overflow-hidden rounded-lg border bg-gradient-to-br from-red-100 to-slate-200 dark:from-red-950 dark:to-slate-800">
                          <span className="flex size-full items-center justify-center text-red-500/70"><Icon icon="solar:camera-bold-duotone" className="size-6" /></span>
                          {duzenlenebilir ? (
                            <button type="button" onClick={() => fotoSil(idx, f.id)} aria-label={t("Kaldır")} className="absolute top-0.5 right-0.5 flex size-5 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
                              <Icon icon="solar:close-circle-bold" className="size-4" />
                            </button>
                          ) : null}
                        </div>
                      ))}
                      {duzenlenebilir ? (
                        <Button variant="outline" size="sm" className="h-8 gap-1 bg-card text-xs" onClick={() => fotoEkle(idx)}>
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
