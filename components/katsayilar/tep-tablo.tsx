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

export function TepKatsayiTablo() {
  const { data, isLoading } = useKatsayiAnaliz();
  const qc = useQueryClient();

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <h3 className="font-heading text-base font-medium">TEP Dönüşüm Katsayıları</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Enerji tüketimini eşdeğer petrole (TEP) çeviren katsayılar</p>
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-card" onClick={() => toast("Yeni katsayı satırı ekleniyor")}>
          <Icon icon="solar:add-circle-linear" className="size-4" />
          Katsayı Ekle
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="whitespace-nowrap">Enerji Kaynağı</TableHead>
                  <TableHead className="whitespace-nowrap">Birim</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Alt Isıl Değer</TableHead>
                  <TableHead className="text-right whitespace-nowrap">TEP Katsayısı</TableHead>
                  <TableHead className="whitespace-nowrap">Referans</TableHead>
                  <TableHead className="text-right whitespace-nowrap">İşlem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.tep.map((r) => (
                  <TableRow key={r.id} className="odd:bg-muted/20 hover:bg-muted/50">
                    <TableCell className="whitespace-nowrap font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="size-2.5 rounded-full" style={{ background: r.renk }} />
                        {r.ad}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{r.birim}</TableCell>
                    <TableCell className="text-right tabular-nums whitespace-nowrap text-muted-foreground">{r.altIsil}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums whitespace-nowrap">{r.tep}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{r.referans}</TableCell>
                    <TableCell className="text-right">
                      <KatsayiDuzenleDrawer
                        baslik={`${r.ad} — TEP Katsayısı`}
                        aciklama="Alt ısıl değer ve TEP dönüşüm katsayısını güncelleyin."
                        alanlar={[
                          { anahtar: "altIsil", label: `Alt Isıl Değer (${r.birim})`, deger: r.altIsil },
                          { anahtar: "tep", label: `TEP Katsayısı (${r.birim})`, deger: r.tep },
                          { anahtar: "referans", label: "Referans", deger: r.referans },
                        ]}
                        onKaydet={(d) => qc.setQueryData(queryKeys.katsayilar.analiz, (old?: KatsayiAnaliz) => old ? { ...old, tep: old.tep.map((x) => x.id === r.id ? { ...x, ...d } : x) } : old)}
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
