"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { SilmeOnay } from "@/components/ui/silme-onay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KatsayiDuzenleDrawer } from "@/components/katsayilar/duzenle-drawer";
import { useKatsayiAnaliz } from "@/lib/queries/katsayilar";
import { katsayiEkle, katsayiGuncelle, katsayiSil } from "@/lib/data/katsayilar";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";

export function FiyatTablo() {
  const { data, isLoading } = useKatsayiAnaliz();
  const { t } = useDil();
  const qc = useQueryClient();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <h3 className="font-heading text-base font-medium">{t("Birim Fiyatlar / Tarifeler")}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("Maliyet hesaplarında kullanılan güncel birim fiyatlar")}</p>
        </div>
        <KatsayiDuzenleDrawer
          baslik={t("Yeni Birim Fiyat")}
          aciklama={t("Yeni bir kaynak için birim fiyat ekleyin.")}
          alanlar={[
            { anahtar: "ad", label: t("Kaynak"), deger: "" },
            { anahtar: "birim", label: t("Birim"), deger: "" },
            { anahtar: "fiyat", label: t("Birim Fiyat"), deger: "" },
            { anahtar: "guncelleme", label: t("Geçerlilik Tarihi"), deger: "" },
          ]}
          onKaydet={async (d) => {
            await katsayiEkle("fiyat", d);
            qc.invalidateQueries({ queryKey: queryKeys.katsayilar.analiz });
          }}
          trigger={
            <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-card">
              <Icon icon="solar:add-circle-linear" className="size-4" />
              {t("Fiyat Ekle")}
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[240px] w-full" />
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="whitespace-nowrap">{t("Kaynak")}</TableHead>
                  <TableHead className="whitespace-nowrap">{t("Birim")}</TableHead>
                  <TableHead className="text-right whitespace-nowrap">{t("Birim Fiyat")}</TableHead>
                  <TableHead className="whitespace-nowrap">{t("Son Güncelleme")}</TableHead>
                  <TableHead className="text-right whitespace-nowrap">{t("İşlem")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.fiyat.map((r) => (
                  <TableRow key={r.id} className="odd:bg-muted/20 hover:bg-muted/50">
                    <TableCell className="whitespace-nowrap font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: r.renk }} />
                        {t(r.ad)}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{r.birim}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums whitespace-nowrap">{r.fiyat}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{r.guncelleme}</TableCell>
                    <TableCell className="text-right">
                      <KatsayiDuzenleDrawer
                        baslik={`${t(r.ad)} — ${t("Birim Fiyat")}`}
                        aciklama={t("Birim fiyatı güncelleyin.")}
                        alanlar={[
                          { anahtar: "fiyat", label: `${t("Birim Fiyat")} (${r.birim})`, deger: r.fiyat },
                          { anahtar: "guncelleme", label: t("Geçerlilik Tarihi"), deger: r.guncelleme },
                        ]}
                        onKaydet={async (d) => {
                          await katsayiGuncelle(r.id, d);
                          qc.invalidateQueries({ queryKey: queryKeys.katsayilar.analiz });
                        }}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label={t("Düzenle")}>
                            <Icon icon="solar:pen-2-bold-duotone" className="size-4 text-muted-foreground" />
                          </Button>
                        }
                      />
                      <SilmeOnay
                        baslik={`${t(r.ad)} ${t("silinsin mi?")}`}
                        onConfirm={async () => {
                          try {
                            await katsayiSil(r.id);
                            toast.success(`${t(r.ad)} ${t("silindi")}`);
                            qc.invalidateQueries({ queryKey: queryKeys.katsayilar.analiz });
                          } catch (e) {
                            toast.error(t("Silme başarısız"), { description: e instanceof Error ? e.message : undefined });
                          }
                        }}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label={t("Sil")}>
                            <Icon icon="solar:trash-bin-trash-bold-duotone" className="size-4 text-red-500" />
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
