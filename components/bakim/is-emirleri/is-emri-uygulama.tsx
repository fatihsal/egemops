"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useIsEmri } from "@/lib/queries/bakim";
import { useProfil } from "@/lib/hooks/use-profil";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import {
  IS_EMRI_DURUM_META,
  MADDE_DURUM_META,
  MADDE_TURU_ETIKET,
  PERIYOT_ETIKET,
  PERIYOT_META,
} from "@/components/bakim/makineler/stiller";
import { GozlemFormu, varsayilanGozlem } from "@/components/bakim/is-emirleri/gozlem-formu";
import type { BakimSonrasiGozlem, Foto, IsEmriDurum, IsEmriMadde, MaddeDurum } from "@/lib/types/bakim";

const SECIM_DURUMLARI: MaddeDurum[] = ["tamamlandi", "bulguVar", "uygulanmadi", "uygulanamaz"];

function simdiStr(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function IsEmriUygulama() {
  const { t } = useDil();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data, isLoading } = useIsEmri(id ?? "");
  const { profil } = useProfil();
  const personel = profil?.ad_soyad ?? "Teknisyen";

  const [maddeler, setMaddeler] = React.useState<IsEmriMadde[]>([]);
  const [durum, setDurum] = React.useState<IsEmriDurum>("planlandi");
  const [secili, setSecili] = React.useState(0);
  const [gozlem, setGozlem] = React.useState<BakimSonrasiGozlem>(varsayilanGozlem());

  React.useEffect(() => {
    if (data) {
      setMaddeler(data.maddeler.map((m) => ({ ...m, fotograflar: [...m.fotograflar] })));
      setDurum(data.durum);
      setSecili(0);
      setGozlem(data.gozlem ?? { ...varsayilanGozlem(), onaylayan: personel });
    }
  }, [data?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const duzenlenebilir = durum === "planlandi" || durum === "devam";
  const islenen = maddeler.filter((m) => m.durum !== "bekliyor").length;
  const toplam = maddeler.length;
  const yuzde = toplam ? Math.round((islenen / toplam) * 100) : 0;
  const hepsiIslendi = toplam > 0 && islenen === toplam;
  const bulguSayi = maddeler.filter((m) => m.durum === "bulguVar").length;

  // Bölümlere göre gruplama (flat index korunur).
  const gruplar = React.useMemo(() => {
    const harita = new Map<string, { madde: IsEmriMadde; idx: number }[]>();
    maddeler.forEach((m, idx) => {
      const b = m.bolum ?? "Genel";
      const l = harita.get(b) ?? [];
      l.push({ madde: m, idx });
      harita.set(b, l);
    });
    return Array.from(harita.entries());
  }, [maddeler]);

  function maddeGuncelle(idx: number, patch: Partial<IsEmriMadde>) {
    setMaddeler((prev) => prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)));
  }

  function durumSec(idx: number, yeni: MaddeDurum) {
    maddeGuncelle(idx, { durum: yeni, yapanPersonel: personel, tamamlanmaZamani: simdiStr() });
    if (durum === "planlandi") setDurum("devam");
  }

  function fotoEkle(idx: number) {
    const foto: Foto = { id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, tur: "yapilanIs", url: "" };
    maddeGuncelle(idx, { fotograflar: [...(maddeler[idx]?.fotograflar ?? []), foto] });
    toast.success(t("Fotoğraf eklendi (demo)"));
  }
  function fotoSil(idx: number, fotoId: string) {
    maddeGuncelle(idx, { fotograflar: (maddeler[idx]?.fotograflar ?? []).filter((f) => f.id !== fotoId) });
  }

  function durumIlerlet(hedef: IsEmriDurum, mesaj: string) {
    setDurum(hedef);
    toast.success(t(mesaj));
  }

  function onayla() {
    if (!gozlem.genelGozlem.trim()) {
      toast.error(t("Onaylamadan önce bakım sonrası gözlemi doldurun."));
      return;
    }
    setGozlem((g) => ({ ...g, onayTarihi: simdiStr().slice(0, 10), onaylayan: g.onaylayan?.trim() || personel }));
    durumIlerlet("onaylandi", "İş emri onaylandı.");
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full" />
        <div className="grid gap-4 lg:grid-cols-[260px_1fr_270px]">
          <Skeleton className="h-[480px] w-full" />
          <Skeleton className="h-[480px] w-full" />
          <Skeleton className="h-[480px] w-full" />
        </div>
      </div>
    );
  }

  const secM = maddeler[secili];
  const dm = IS_EMRI_DURUM_META[durum];

  return (
    <div className="space-y-5">
      {/* Üst başlık */}
      <Card>
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Button variant="outline" size="icon" className="mt-0.5 bg-card" nativeButton={false} render={<Link href="/bakim/is-emirleri" />} aria-label={t("Geri")}>
                <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
              </Button>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-xl font-bold tracking-tight tabular-nums">{data.no}</h1>
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", dm.sinif)}>
                    <span className={cn("size-1.5 rounded-full", dm.nokta)} />
                    {t(dm.etiket)}
                  </span>
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", PERIYOT_META[data.periyot].sinif)}>
                    {t(PERIYOT_ETIKET[data.periyot])}
                  </span>
                </div>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
                  <Link href={`/bakim/makineler/${data.makineId}`} className="inline-flex items-center gap-1.5 hover:text-blue-600 hover:underline dark:hover:text-blue-400">
                    <Icon icon="solar:cpu-bolt-linear" className="size-4" /> {data.makineAd}
                  </Link>
                  <span className="inline-flex items-center gap-1.5"><Icon icon="solar:wrench-linear" className="size-4" /> {t(data.bakimTuru)}</span>
                  <span className="inline-flex items-center gap-1.5"><Icon icon="solar:calendar-linear" className="size-4" /> {data.planlananTarih}</span>
                  <span className="inline-flex items-center gap-1.5"><Icon icon="solar:users-group-rounded-linear" className="size-4" /> {data.teknisyenler.join(", ")}</span>
                </p>
              </div>
            </div>

            {/* Aksiyonlar */}
            <div className="flex flex-wrap items-center gap-2">
              {(durum === "planlandi" || durum === "devam") ? (
                <Button
                  className="h-9 gap-1.5 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                  disabled={!hepsiIslendi}
                  onClick={() => durumIlerlet("tamamlandi", "İş emri tamamlandı.")}
                >
                  <Icon icon="solar:check-circle-bold" className="size-4" />
                  {t("İşi Tamamla")}
                </Button>
              ) : durum === "tamamlandi" ? (
                <>
                  <Button variant="outline" className="h-9 gap-1.5 bg-card" onClick={() => durumIlerlet("devam", "Düzenlemeye dönüldü.")}>
                    <Icon icon="solar:pen-linear" className="size-4" /> {t("Düzenle")}
                  </Button>
                  <Button className="h-9 gap-1.5 bg-violet-600 text-white shadow-sm hover:bg-violet-700" onClick={() => durumIlerlet("muhendisKontrol", "Mühendis kontrolüne gönderildi.")}>
                    <Icon icon="solar:check-read-bold" className="size-4" /> {t("Mühendis Kontrolüne Gönder")}
                  </Button>
                </>
              ) : durum === "muhendisKontrol" ? (
                <>
                  <Button variant="outline" className="h-9 gap-1.5 bg-card" onClick={() => durumIlerlet("devam", "Revizyona gönderildi.")}>
                    <Icon icon="solar:rewind-back-linear" className="size-4" /> {t("Revizyona Gönder")}
                  </Button>
                  <Button className="h-9 gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700" onClick={onayla}>
                    <Icon icon="solar:verified-check-bold" className="size-4" /> {t("Onayla")}
                  </Button>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                  <Icon icon="solar:verified-check-bold" className="size-4" />
                  {t("Onaylayan")}: {data.onaylayan} · {data.onayTarihi}
                </span>
              )}
            </div>
          </div>

          {/* İlerleme */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {islenen}/{toplam} {t("madde işlendi")}
                {bulguSayi > 0 ? <span className="ml-2 font-medium text-red-600 dark:text-red-400">· {bulguSayi} {t("bulgu")}</span> : null}
              </span>
              <span className="font-semibold tabular-nums">%{yuzde}</span>
            </div>
            <span className="block h-2 overflow-hidden rounded-full bg-muted">
              <span className="block h-full rounded-full bg-blue-500 transition-all" style={{ width: `${yuzde}%` }} />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 3 panel */}
      <div className="grid gap-4 lg:grid-cols-[minmax(230px,260px)_1fr_minmax(240px,280px)]">
        {/* SOL: madde listesi */}
        <Card className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
          <CardContent className="space-y-4 p-3">
            {gruplar.map(([bolum, items]) => (
              <div key={bolum} className="space-y-1">
                <p className="px-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{t(bolum)}</p>
                {items.map(({ madde: m, idx }) => {
                  const md = MADDE_DURUM_META[m.durum as MaddeDurum] ?? MADDE_DURUM_META.bekliyor;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSecili(idx)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                        idx === secili ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" : "hover:bg-muted",
                      )}
                    >
                      <Icon icon={md.ikon} className={cn("size-4 shrink-0", md.renk)} />
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{m.no}</span>
                      <span className="truncate">{t(m.baslik)}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ORTA: seçili madde */}
        <Card>
          <CardContent className="space-y-5 p-4 sm:p-5">
            {secM ? (
              <>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium tabular-nums">{secM.no}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{t(secM.bolum ?? "Genel")}</span>
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-300">{t(MADDE_TURU_ETIKET[secM.turu])}</span>
                    {secM.fotoGereksinimi === "zorunlu" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        <Icon icon="solar:camera-bold" className="size-3" /> {t("Fotoğraf zorunlu")}
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-2 font-heading text-lg font-semibold">{t(secM.baslik)}</h2>
                  {secM.aciklama ? <p className="mt-1 text-sm text-muted-foreground">{t(secM.aciklama)}</p> : null}
                </div>

                {/* Durum seçimi */}
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">{t("Durum")}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {SECIM_DURUMLARI.map((d) => {
                      const md = MADDE_DURUM_META[d];
                      const aktif = secM.durum === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          disabled={!duzenlenebilir}
                          onClick={() => durumSec(secili, d)}
                          className={cn(
                            "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                            aktif ? md.sinif + " border-transparent ring-2 ring-offset-1 ring-offset-background" : "border-border bg-card hover:bg-muted",
                            aktif && d === "tamamlandi" && "ring-emerald-400",
                            aktif && d === "bulguVar" && "ring-red-400",
                            aktif && d === "uygulanmadi" && "ring-amber-400",
                            aktif && d === "uygulanamaz" && "ring-slate-400",
                          )}
                        >
                          <Icon icon={md.ikon} className={cn("size-4", aktif ? "" : md.renk)} />
                          {t(md.etiket)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Not */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                    {secM.durum === "bulguVar" ? t("Bulgu açıklaması") : t("Not")}
                    {secM.durum === "bulguVar" ? <span className="text-red-500"> *</span> : null}
                  </p>
                  <Textarea
                    value={secM.not ?? ""}
                    disabled={!duzenlenebilir}
                    onChange={(e) => maddeGuncelle(secili, { not: e.target.value })}
                    placeholder={secM.durum === "bulguVar" ? t("Tespit edilen sorunu açıklayın…") : t("İsteğe bağlı not ekleyin…")}
                    className="min-h-20 bg-card text-sm"
                  />
                </div>

                {/* Fotoğraflar */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t("Fotoğraflar")} {secM.fotograflar.length > 0 ? `(${secM.fotograflar.length})` : ""}
                    </p>
                    {duzenlenebilir ? (
                      <Button variant="outline" size="sm" className="h-7 gap-1 bg-card text-xs" onClick={() => fotoEkle(secili)}>
                        <Icon icon="solar:camera-add-bold" className="size-3.5" /> {t("Fotoğraf Ekle")}
                      </Button>
                    ) : null}
                  </div>
                  {secM.fotograflar.length === 0 ? (
                    <div className={cn(
                      "flex items-center justify-center gap-2 rounded-lg border border-dashed py-6 text-xs",
                      secM.fotoGereksinimi === "zorunlu" ? "border-amber-300 text-amber-600 dark:border-amber-800 dark:text-amber-400" : "text-muted-foreground",
                    )}>
                      <Icon icon="solar:gallery-linear" className="size-4" />
                      {secM.fotoGereksinimi === "zorunlu" ? t("Bu madde için fotoğraf zorunlu") : t("Henüz fotoğraf yok")}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {secM.fotograflar.map((f) => (
                        <div key={f.id} className="group relative size-20 overflow-hidden rounded-lg border bg-gradient-to-br from-blue-100 to-slate-200 dark:from-blue-950 dark:to-slate-800">
                          <span className="flex size-full items-center justify-center text-blue-500/70">
                            <Icon icon="solar:camera-bold-duotone" className="size-7" />
                          </span>
                          {duzenlenebilir ? (
                            <button
                              type="button"
                              onClick={() => fotoSil(secili, f.id)}
                              aria-label={t("Kaldır")}
                              className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100"
                            >
                              <Icon icon="solar:close-circle-bold" className="size-4" />
                            </button>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        {/* SAĞ: madde bilgisi + geçmiş + navigasyon */}
        <Card className="lg:sticky lg:top-4 lg:self-start">
          <CardHeader>
            <h3 className="font-heading text-sm font-medium">{t("Madde Bilgisi")}</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {secM ? (
              <>
                <dl className="space-y-2.5 text-sm">
                  {[
                    { e: "Tür", d: t(MADDE_TURU_ETIKET[secM.turu]) },
                    { e: "Fotoğraf", d: secM.fotoGereksinimi === "zorunlu" ? t("Zorunlu") : secM.fotoGereksinimi === "opsiyonel" ? t("Opsiyonel") : t("Gerekli değil") },
                    { e: "Durum", d: t(MADDE_DURUM_META[secM.durum as MaddeDurum]?.etiket ?? "Bekliyor") },
                    { e: "Yapan", d: secM.yapanPersonel ?? "—" },
                    { e: "Zaman", d: secM.tamamlanmaZamani ?? "—" },
                  ].map((r) => (
                    <div key={r.e} className="flex items-center justify-between gap-3 border-b border-dashed pb-2">
                      <dt className="text-muted-foreground">{t(r.e)}</dt>
                      <dd className="text-right font-medium">{r.d}</dd>
                    </div>
                  ))}
                </dl>

                <div className="rounded-lg bg-muted/50 p-3 text-xs">
                  <p className="font-medium">{t("Önceki Bakım")}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <Icon icon="solar:check-circle-bold" className="size-3.5" /> {t("Uygun")} · {data.planlananTarih}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1 bg-card" disabled={secili === 0} onClick={() => setSecili((i) => Math.max(0, i - 1))}>
                    <Icon icon="solar:alt-arrow-left-linear" className="size-4" /> {t("Önceki")}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1 bg-card" disabled={secili >= toplam - 1} onClick={() => setSecili((i) => Math.min(toplam - 1, i + 1))}>
                    {t("Sonraki")} <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
                  </Button>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Bakım Sonrası Gözlem — mühendis kontrol/onay aşamasında */}
      {durum === "muhendisKontrol" || durum === "onaylandi" ? (
        <GozlemFormu
          gozlem={gozlem}
          setGozlem={setGozlem}
          duzenlenebilir={durum === "muhendisKontrol"}
          isEmri={data}
        />
      ) : null}
    </div>
  );
}
