"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/common/sparkline";
import { KayitDurumBadge } from "@/components/enerji-kayitlari/durum";
import { useDil } from "@/components/providers/dil-provider";
import { sayi2, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { EnerjiKayit, KayitGecmis } from "@/lib/types";

const GECMIS_IKON: Record<KayitGecmis["tur"], { ikon: string; renk: string }> = {
  onay: { ikon: "solar:check-circle-bold-duotone", renk: "text-emerald-500" },
  duzenleme: { ikon: "solar:pen-new-square-bold-duotone", renk: "text-amber-500" },
  ekleme: { ikon: "solar:document-text-bold-duotone", renk: "text-primary" },
};

function KirilimKart({
  etiket,
  deger,
  birim,
  oran,
  renk,
  spark,
}: {
  etiket: string;
  deger: string;
  birim?: string;
  oran: string;
  renk: string;
  spark: number[];
}) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{etiket}</span>
        <span className="size-2 rounded-full" style={{ background: renk }} />
      </div>
      <div className="mt-1 text-lg font-bold tracking-tight">
        {deger}
        {birim ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {birim}
          </span>
        ) : null}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{oran}</span>
        <Sparkline data={spark} renk={renk} className="h-4 w-14" />
      </div>
    </div>
  );
}

export function KayitDetayPaneli({
  kayit,
  onKapat,
}: {
  kayit: EnerjiKayit | null;
  onKapat: () => void;
}) {
  const { t } = useDil();
  const arti = (kayit?.degisimYuzde ?? 0) >= 0;

  return (
    <Sheet open={!!kayit} onOpenChange={(o) => !o && onKapat()}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-md"
      >
        {kayit ? (
          <>
            {/* Başlık */}
            <SheetHeader className="border-b p-5 pr-12">
              <SheetTitle className="text-lg">{t(kayit.donem)}</SheetTitle>
              <div className="mt-1">
                <KayitDurumBadge durum={kayit.durum} />
              </div>
              <div className="mt-3">
                <div className="text-xs text-muted-foreground">{t("Toplam Enerji")}</div>
                <div className="text-3xl font-bold tracking-tight">
                  {sayi2(kayit.toplamTep)}
                  <span className="ml-1 text-base font-normal text-muted-foreground">
                    TEP
                  </span>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-5 p-5">
              {/* Enerji kırılımı */}
              <div className="grid grid-cols-2 gap-3">
                <KirilimKart
                  etiket={t("Elektrik")}
                  deger={sayi2(kayit.elektrikTep)}
                  birim="TEP"
                  oran="%59,0"
                  renk="#3b82f6"
                  spark={[5, 5.4, 5.2, 5.8, 5.6, 6]}
                />
                <KirilimKart
                  etiket={t("Doğalgaz")}
                  deger={sayi2(kayit.dogalgazTep)}
                  birim="TEP"
                  oran="%39,4"
                  renk="#8b5cf6"
                  spark={[3, 3.2, 3.1, 3.4, 3.3, 3.5]}
                />
                <KirilimKart
                  etiket={t("Akaryakıt")}
                  deger={sayi2(kayit.akaryakitTep)}
                  birim="TEP"
                  oran="%1,6"
                  renk="#f97316"
                  spark={[1, 1.1, 1.05, 1.2, 1.15, 1.25]}
                />
                <KirilimKart
                  etiket={t("GES Karşılama")}
                  deger={`%${sayiOndalik(kayit.gesKarsilama)}`}
                  oran={t("Yenilenebilir")}
                  renk="#0d9488"
                  spark={[28, 29, 30, 30.5, 31, 31.4]}
                />
              </div>

              {/* Önceki aya göre değişim */}
              {kayit.oncekiDonem ? (
                <div className="rounded-lg border p-4">
                  <div className="text-sm font-medium">{t("Önceki Aya Göre Değişim")}</div>
                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {t(kayit.oncekiDonem)}
                      </div>
                      <div className="text-lg font-bold tracking-tight">
                        {sayi2(kayit.oncekiTep ?? 0)}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
                          TEP
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 text-sm font-semibold",
                        arti
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400",
                      )}
                    >
                      <span className="text-[10px] leading-none">
                        {arti ? "▲" : "▼"}
                      </span>
                      %{sayiOndalik(Math.abs(kayit.degisimYuzde ?? 0))}
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Kayıt bilgileri */}
              <div className="rounded-lg border p-4">
                <dl className="space-y-2.5 text-sm">
                  {[
                    { e: "Son Güncelleme", d: kayit.sonGuncelleme, ik: "solar:clock-circle-bold-duotone" },
                    { e: "Güncelleyen", d: t(kayit.guncelleyen), ik: "solar:user-bold-duotone" },
                    { e: "Kaydı Oluşturan", d: t(kayit.olusturan), ik: "solar:user-plus-bold-duotone" },
                    { e: "Belgeler", d: `${kayit.belgeSayisi} ${t("dosya")}`, ik: "solar:documents-bold-duotone" },
                  ].map((s) => (
                    <div key={s.e} className="flex items-center justify-between gap-2">
                      <dt className="flex items-center gap-2 text-muted-foreground">
                        <Icon icon={s.ik} className="size-4" />
                        {t(s.e)}
                      </dt>
                      <dd className="font-medium tabular-nums">{s.d}</dd>
                    </div>
                  ))}
                </dl>
                <Button
                  render={<Link href={`/enerji-kayitlari/${kayit.id}`} />}
                  nativeButton={false}
                  className="mt-4 w-full gap-1.5 bg-teal-600 text-white hover:bg-teal-700"
                >
                  <Icon icon="solar:eye-bold-duotone" className="size-4" />
                  {t("Kaydı Görüntüle")}
                </Button>
              </div>

              {/* Kayıt geçmişi */}
              <div>
                <div className="mb-3 text-sm font-semibold">{t("Kayıt Geçmişi")}</div>
                <ol className="relative space-y-4 border-l pl-5">
                  {kayit.gecmis.map((g, i) => {
                    const ik = GECMIS_IKON[g.tur];
                    return (
                      <li key={i} className="relative">
                        <span className="absolute top-0.5 -left-[27px] flex size-4 items-center justify-center rounded-full bg-card">
                          <Icon icon={ik.ikon} className={cn("size-4", ik.renk)} />
                        </span>
                        <div className="text-xs text-muted-foreground tabular-nums">
                          {g.tarih}
                        </div>
                        <div className="text-sm font-medium">{t(g.baslik)}</div>
                        {g.aciklama ? (
                          <div className="text-xs text-muted-foreground">
                            {t("Açıklama")}: {t(g.aciklama)}
                          </div>
                        ) : null}
                        <div className="text-xs text-muted-foreground">
                          {t(g.kullanici)}
                        </div>
                      </li>
                    );
                  })}
                </ol>
                <button
                  type="button"
                  onClick={() => toast(t("Tüm geçmiş açılıyor"))}
                  className="mt-3 text-xs font-medium text-primary hover:underline"
                >
                  {t("Tüm geçmişi görüntüle")}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
