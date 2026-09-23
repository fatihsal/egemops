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
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import { katsayiEkle, katsayiGuncelle, katsayiSil } from "@/lib/data/katsayilar";

export function TepKatsayiTablo() {
  const { data, isLoading } = useKatsayiAnaliz();
  const { t } = useDil();
  const qc = useQueryClient();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <h3 className="font-heading text-base font-medium">{t("TEP Dönüşüm Katsayıları")}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("Enerji tüketimini eşdeğer petrole (TEP) çeviren katsayılar")}</p>
        </div>
        <KatsayiDuzenleDrawer
          baslik={t("Yeni TEP Katsayısı")}
          aciklama={t("Yeni bir enerji kaynağı için TEP dönüşüm katsayısı ekleyin.")}
          alanlar={[
            { anahtar: "ad", label: t("Enerji Kaynağı"), deger: "" },
            { anahtar: "birim", label: t("Birim"), deger: "" },
            { anahtar: "altIsil", label: t("Alt Isıl Değer"), deger: "" },
            { anahtar: "tep", label: t("TEP Katsayısı"), deger: "" },
            { anahtar: "referans", label: t("Referans"), deger: "" },
          ]}
          onKaydet={async (d) => {
            await katsayiEkle("tep", d);
            qc.invalidateQueries({ queryKey: queryKeys.katsayilar.analiz });
          }}
          trigger={
            <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-card">
              <Icon icon="solar:add-circle-linear" className="size-4" />
              {t("Katsayı Ekle")}
            </Button>
          }
        />
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="whitespace-nowrap">{t("Enerji Kaynağı")}</TableHead>
                  <TableHead className="whitespace-nowrap">{t("Birim")}</TableHead>
                  <TableHead className="text-right whitespace-nowrap">{t("Alt Isıl Değer")}</TableHead>
                  <TableHead className="text-right whitespace-nowrap">{t("TEP Katsayısı")}</TableHead>
                  <TableHead className="whitespace-nowrap">{t("Referans")}</TableHead>
                  <TableHead className="text-right whitespace-nowrap">{t("İşlem")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.tep.map((r) => (
                  <TableRow key={r.id} className="odd:bg-muted/20 hover:bg-muted/50">
                    <TableCell className="whitespace-nowrap font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: r.renk }} />
                        {t(r.ad)}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{r.birim}</TableCell>
                    <TableCell className="text-right tabular-nums whitespace-nowrap text-muted-foreground">{r.altIsil}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums whitespace-nowrap">{r.tep}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{t(r.referans)}</TableCell>
                    <TableCell className="text-right">
                      <KatsayiDuzenleDrawer
                        baslik={`${t(r.ad)} — ${t("TEP Katsayısı")}`}
                        aciklama={t("Alt ısıl değer ve TEP dönüşüm katsayısını güncelleyin.")}
                        alanlar={[
                          { anahtar: "altIsil", label: `${t("Alt Isıl Değer")} (${r.birim})`, deger: r.altIsil },
                          { anahtar: "tep", label: `${t("TEP Katsayısı")} (${r.birim})`, deger: r.tep },
                          { anahtar: "referans", label: t("Referans"), deger: r.referans },
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
