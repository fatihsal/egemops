"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { SilmeOnay } from "@/components/ui/silme-onay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KatsayiDuzenleDrawer } from "@/components/katsayilar/duzenle-drawer";
import { useKatsayiAnaliz } from "@/lib/queries/katsayilar";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import { cn } from "@/lib/utils";
import { katsayiEkle, katsayiGuncelle, katsayiSil } from "@/lib/data/katsayilar";

export function GenelParametreler() {
  const { data, isLoading } = useKatsayiAnaliz();
  const { t } = useDil();
  const qc = useQueryClient();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <h3 className="font-heading text-base font-medium">{t("Genel Parametreler")}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("EnPI ve hesaplamalarda kullanılan referans değerler")}</p>
        </div>
        <KatsayiDuzenleDrawer
          baslik={t("Yeni Parametre")}
          aciklama={t("Yeni bir genel parametre ekleyin.")}
          alanlar={[
            { anahtar: "ad", label: t("Parametre Adı"), deger: "" },
            { anahtar: "deger", label: t("Değer"), deger: "" },
            { anahtar: "aciklama", label: t("Açıklama"), deger: "" },
          ]}
          onKaydet={async (d) => {
            await katsayiEkle("genel", {
              ...d,
              ikon: "solar:settings-bold-duotone",
              sinif: "bg-muted text-muted-foreground",
            });
            qc.invalidateQueries({ queryKey: queryKeys.katsayilar.analiz });
          }}
          trigger={
            <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-card">
              <Icon icon="solar:add-circle-linear" className="size-4" />
              {t("Parametre Ekle")}
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.genel.map((p) => (
              <div key={p.id} className="group flex items-start gap-3 rounded-xl border p-4">
                <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", p.sinif)}>
                  <Icon icon={p.ikon} className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{t(p.ad)}</p>
                  <p className="mt-0.5 font-heading text-lg font-bold tracking-tight tabular-nums">{t(p.deger)}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{t(p.aciklama)}</p>
                </div>
                <KatsayiDuzenleDrawer
                  baslik={t(p.ad)}
                  aciklama={t("Parametre değerini güncelleyin.")}
                  alanlar={[{ anahtar: "deger", label: t(p.ad), deger: p.deger }]}
                  onKaydet={async (d) => {
                    await katsayiGuncelle(p.id, d);
                    qc.invalidateQueries({ queryKey: queryKeys.katsayilar.analiz });
                  }}
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label={t("Düzenle")} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                      <Icon icon="solar:pen-2-bold-duotone" className="size-4 text-muted-foreground" />
                    </Button>
                  }
                />
                <SilmeOnay
                  baslik={`${t(p.ad)} ${t("silinsin mi?")}`}
                  onConfirm={async () => {
                    try {
                      await katsayiSil(p.id);
                      toast.success(`${t(p.ad)} ${t("silindi")}`);
                      qc.invalidateQueries({ queryKey: queryKeys.katsayilar.analiz });
                    } catch (e) {
                      toast.error(t("Silme başarısız"), { description: e instanceof Error ? e.message : undefined });
                    }
                  }}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("Sil")}
                      className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Icon icon="solar:trash-bin-trash-bold-duotone" className="size-4 text-red-500" />
                    </Button>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
