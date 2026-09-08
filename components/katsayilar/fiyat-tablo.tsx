"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
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
import { queryKeys } from "@/lib/queries/keys";
import type { KatsayiAnaliz } from "@/lib/types";

export function FiyatTablo() {
  const { data, isLoading } = useKatsayiAnaliz();
  const qc = useQueryClient();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <h3 className="font-heading text-base font-medium">Birim Fiyatlar / Tarifeler</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Maliyet hesaplarında kullanılan güncel birim fiyatlar</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-card" onClick={() => toast("Yeni birim fiyat ekleniyor")}>
          <Icon icon="solar:add-circle-linear" className="size-4" />
          Fiyat Ekle
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[240px] w-full" />
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="whitespace-nowrap">Kaynak</TableHead>
                  <TableHead className="whitespace-nowrap">Birim</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Birim Fiyat</TableHead>
                  <TableHead className="whitespace-nowrap">Son Güncelleme</TableHead>
                  <TableHead className="text-right whitespace-nowrap">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.fiyat.map((r) => (
                  <TableRow key={r.id} className="odd:bg-muted/20 hover:bg-muted/50">
                    <TableCell className="whitespace-nowrap font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: r.renk }} />
                        {r.ad}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{r.birim}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums whitespace-nowrap">{r.fiyat}</TableCell>
                    <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{r.guncelleme}</TableCell>
                    <TableCell className="text-right">
                      <KatsayiDuzenleDrawer
                        baslik={`${r.ad} — Birim Fiyat`}
                        aciklama="Birim fiyatı güncelleyin."
                        alanlar={[
                          { anahtar: "fiyat", label: `Birim Fiyat (${r.birim})`, deger: r.fiyat },
                          { anahtar: "guncelleme", label: "Geçerlilik Tarihi", deger: r.guncelleme },
                        ]}
                        onKaydet={(d) => qc.setQueryData(queryKeys.katsayilar.analiz, (old?: KatsayiAnaliz) => old ? { ...old, fiyat: old.fiyat.map((x) => x.id === r.id ? { ...x, ...d } : x) } : old)}
                        trigger={
                          <Button variant="ghost" size="icon-sm" aria-label="Düzenle">
                            <Icon icon="solar:pen-2-bold-duotone" className="size-4 text-muted-foreground" />
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
