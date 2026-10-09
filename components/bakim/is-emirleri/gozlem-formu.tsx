"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { csvIndir } from "@/lib/disa-aktar";
import { GOZLEM_KATEGORI, GOZLEM_SONUC_META, RAG_META } from "@/components/bakim/makineler/stiller";
import type { BakimSonrasiGozlem, GozlemSonuc, IsEmri, RagDurum } from "@/lib/types/bakim";

const RAG_SECENEK: RagDurum[] = ["uygun", "takip", "uygunDegil"];
const SONUC_SECENEK: GozlemSonuc[] = ["uretimeUygun", "takip", "ekIslem"];

export function varsayilanGozlem(): BakimSonrasiGozlem {
  return {
    genelGozlem: "",
    kontrol: { mekanik: "uygun", elektrik: "uygun", pnomatik: "uygun", sensor: "uygun", emniyet: "uygun", urunAkisi: "uygun" },
    denemeYapildi: false,
    sonuc: "uretimeUygun",
    takipNotlari: "",
    onaylayan: "",
    onayTarihi: "",
  };
}

export function GozlemFormu({
  gozlem,
  setGozlem,
  duzenlenebilir,
  isEmri,
}: {
  gozlem: BakimSonrasiGozlem;
  setGozlem: (g: BakimSonrasiGozlem) => void;
  duzenlenebilir: boolean;
  isEmri: IsEmri;
}) {
  const { t } = useDil();
  const sonucMeta = GOZLEM_SONUC_META[gozlem.sonuc];

  function raporOlustur() {
    const basliklar = [t("Alan"), t("Değer")];
    const satirlar: string[][] = [
      [t("İş Emri"), isEmri.no],
      [t("Makine"), isEmri.makineAd],
      [t("Genel Gözlem"), gozlem.genelGozlem || "-"],
      ...GOZLEM_KATEGORI.map((k) => [t(k.etiket), t(RAG_META[gozlem.kontrol[k.anahtar]].etiket)] as string[]),
      [t("Deneme Çalışması"), gozlem.denemeYapildi ? t("Yapıldı") : t("Yapılmadı")],
      [t("Sonuç"), t(sonucMeta.etiket)],
      [t("Takip Notları"), gozlem.takipNotlari || "-"],
      [t("Onaylayan"), gozlem.onaylayan || "-"],
      [t("Onay Tarihi"), gozlem.onayTarihi || "-"],
    ];
    csvIndir(`bakim-gozlem-${isEmri.no}`, basliklar, satirlar);
    toast.success(t("Gözlem raporu indirildi."));
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <Icon icon="solar:clipboard-heart-bold-duotone" className="size-5 text-violet-500" />
          <h3 className="font-heading text-base font-medium">{t("Bakım Sonrası Gözlem")}</h3>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 bg-card" onClick={raporOlustur}>
          <Icon icon="solar:file-download-bold-duotone" className="size-4 text-violet-600" />
          {t("Rapor Oluştur")}
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Genel gözlem */}
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">{t("Genel Gözlem")}</p>
          {duzenlenebilir ? (
            <Textarea
              value={gozlem.genelGozlem}
              onChange={(e) => setGozlem({ ...gozlem, genelGozlem: e.target.value })}
              placeholder={t("Bakım sonrası makinenin genel durumunu özetleyin…")}
              className="min-h-20 bg-card text-sm"
            />
          ) : (
            <p className="rounded-lg bg-muted/50 p-3 text-sm">{gozlem.genelGozlem || "—"}</p>
          )}
        </div>

        {/* 6 kategori RAG */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">{t("Kategori Değerlendirmesi")}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {GOZLEM_KATEGORI.map((kat) => {
              const deger = gozlem.kontrol[kat.anahtar];
              return (
                <div key={kat.anahtar} className="flex items-center justify-between gap-2 rounded-lg border p-2">
                  <span className="inline-flex items-center gap-2 text-sm">
                    <Icon icon={kat.ikon} className="size-4 text-muted-foreground" />
                    {t(kat.etiket)}
                  </span>
                  {duzenlenebilir ? (
                    <div className="flex gap-1">
                      {RAG_SECENEK.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setGozlem({ ...gozlem, kontrol: { ...gozlem.kontrol, [kat.anahtar]: r } })}
                          className={cn(
                            "rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                            deger === r ? RAG_META[r].aktif : "bg-muted text-muted-foreground hover:bg-muted/70",
                          )}
                        >
                          {t(RAG_META[r].etiket)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", RAG_META[deger].sinif)}>
                      <span className={cn("size-1.5 rounded-full", RAG_META[deger].nokta)} />
                      {t(RAG_META[deger].etiket)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Deneme çalışması */}
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <span className="inline-flex items-center gap-2 text-sm">
            <Icon icon="solar:play-circle-bold-duotone" className="size-4 text-muted-foreground" />
            {t("Bakım sonrası deneme çalışması yapıldı")}
          </span>
          {duzenlenebilir ? (
            <button
              type="button"
              role="switch"
              aria-checked={gozlem.denemeYapildi}
              onClick={() => setGozlem({ ...gozlem, denemeYapildi: !gozlem.denemeYapildi })}
              className={cn("relative h-6 w-11 shrink-0 rounded-full transition-colors", gozlem.denemeYapildi ? "bg-emerald-500" : "bg-muted")}
            >
              <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all", gozlem.denemeYapildi ? "left-[22px]" : "left-0.5")} />
            </button>
          ) : (
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", gozlem.denemeYapildi ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300")}>
              {gozlem.denemeYapildi ? t("Yapıldı") : t("Yapılmadı")}
            </span>
          )}
        </div>

        {/* Sonuç */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">{t("Değerlendirme Sonucu")}</p>
          {duzenlenebilir ? (
            <div className="grid gap-2 sm:grid-cols-3">
              {SONUC_SECENEK.map((s) => {
                const m = GOZLEM_SONUC_META[s];
                const aktif = gozlem.sonuc === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setGozlem({ ...gozlem, sonuc: s })}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors",
                      aktif ? m.aktif : "border-border bg-card hover:bg-muted",
                    )}
                  >
                    <Icon icon={m.ikon} className="size-4" />
                    {t(m.etiket)}
                  </button>
                );
              })}
            </div>
          ) : (
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium", sonucMeta.sinif)}>
              <Icon icon={sonucMeta.ikon} className="size-4" />
              {t(sonucMeta.etiket)}
            </span>
          )}
        </div>

        {/* Takip notları (sonuç üretime uygun değilse) */}
        {gozlem.sonuc !== "uretimeUygun" ? (
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">{t("Takip / Aksiyon Notları")}</p>
            {duzenlenebilir ? (
              <Textarea
                value={gozlem.takipNotlari ?? ""}
                onChange={(e) => setGozlem({ ...gozlem, takipNotlari: e.target.value })}
                placeholder={t("Gerekli takip veya ek işlemleri yazın…")}
                className="min-h-16 bg-card text-sm"
              />
            ) : (
              <p className="rounded-lg bg-muted/50 p-3 text-sm">{gozlem.takipNotlari || "—"}</p>
            )}
          </div>
        ) : null}

        {/* Onaylayan */}
        <div className="border-t pt-4">
          {duzenlenebilir ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground">{t("Onaylayan")}:</span>
              <Input
                value={gozlem.onaylayan ?? ""}
                onChange={(e) => setGozlem({ ...gozlem, onaylayan: e.target.value })}
                placeholder={t("Ad Soyad")}
                className="h-8 w-56 bg-card text-sm"
              />
            </div>
          ) : gozlem.onaylayan ? (
            <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon icon="solar:verified-check-bold" className="size-4 text-teal-600 dark:text-teal-400" />
              {t("Onaylayan")}: <span className="font-medium text-foreground">{gozlem.onaylayan}</span>
              {gozlem.onayTarihi ? ` · ${gozlem.onayTarihi}` : ""}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
