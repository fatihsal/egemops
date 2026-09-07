"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DURUM_META, FORMAT_STIL, KATEGORI_META } from "@/components/belgeler/stiller";
import { cn } from "@/lib/utils";
import type { Belge } from "@/lib/types";

function Satir({ etiket, deger, vurgu }: { etiket: string; deger: string; vurgu?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0">
      <dt className="text-xs text-muted-foreground">{etiket}</dt>
      <dd className={cn("text-sm font-medium tabular-nums", vurgu)}>{deger}</dd>
    </div>
  );
}

export function BelgeDetayDrawer({ belge, trigger }: { belge: Belge; trigger: React.ReactElement }) {
  const kat = KATEGORI_META[belge.kategori];
  const durum = DURUM_META[belge.durum];
  const anaFormat = belge.format.split(", ")[0];
  const fmt = FORMAT_STIL[anaFormat] ?? FORMAT_STIL.PDF;

  return (
    <Sheet>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <div className="flex items-start gap-3">
            <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", fmt.sinif)}>
              <Icon icon={fmt.ikon} className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <SheetTitle className="leading-snug">{belge.ad}</SheetTitle>
              <SheetDescription>{belge.aciklama}</SheetDescription>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                  <span className="size-1.5 rounded-full" style={{ background: kat.nokta }} />
                  {kat.etiket}
                </span>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", durum.sinif)}>{durum.etiket}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5">
          <dl>
            <Satir etiket="Kategori" deger={kat.etiket} />
            <Satir etiket="Dosya Biçimi" deger={belge.format} />
            <Satir etiket="Boyut" deger={belge.boyut} />
            <Satir etiket="Yükleyen" deger={belge.yukleyen} />
            <Satir etiket="Yüklenme Tarihi" deger={belge.tarih} />
            <Satir
              etiket="Geçerlilik"
              deger={belge.gecerlilik ?? "Süresiz"}
              vurgu={belge.durum === "doldu" ? "text-red-500" : belge.durum === "yaklasiyor" ? "text-amber-600" : undefined}
            />
            <Satir etiket="Durum" deger={durum.etiket} />
          </dl>

          {/* Önizleme yer tutucu */}
          <div className="mt-5 flex flex-col items-center gap-2 rounded-xl border border-dashed bg-muted/30 px-4 py-10 text-center">
            <Icon icon={fmt.ikon} className="size-10 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Belge önizlemesi indirme sonrası görüntülenir.</p>
          </div>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <Button variant="outline" className="gap-1.5" onClick={() => toast("Yazdırma penceresi açılıyor")}>
            <Icon icon="solar:printer-bold-duotone" className="size-4" />
            Yazdır
          </Button>
          <Button className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700" onClick={() => toast.success(`${belge.ad} indiriliyor`)}>
            <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4" />
            İndir
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
