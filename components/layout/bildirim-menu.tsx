"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Bildirim {
  id: string;
  ikon: string;
  renk: string;
  baslik: string;
  aciklama: string;
  zaman: string;
  okundu: boolean;
}

const BASLANGIC: Bildirim[] = [
  {
    id: "b1",
    ikon: "solar:clock-circle-bold-duotone",
    renk: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300",
    baslik: "Ağustos 2026 kaydı onay bekliyor",
    aciklama: "Taslak kayıt kontrol edilmeyi bekliyor.",
    zaman: "5 dk önce",
    okundu: false,
  },
  {
    id: "b2",
    ikon: "solar:sun-2-bold-duotone",
    renk: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
    baslik: "GES üretimi hedefin %5 üzerinde",
    aciklama: "Bu ay güneş enerjisi üretimi beklentiyi aştı.",
    zaman: "1 sa önce",
    okundu: false,
  },
  {
    id: "b3",
    ikon: "solar:danger-triangle-bold-duotone",
    renk: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300",
    baslik: "EnPI sapması: Hat-2 eşik aşımı",
    aciklama: "Enerji yoğunluğu belirlenen eşiği aştı.",
    zaman: "3 sa önce",
    okundu: false,
  },
  {
    id: "b4",
    ikon: "solar:file-check-bold-duotone",
    renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
    baslik: "Doğalgaz faturası yüklendi",
    aciklama: "Temmuz 2026 doğalgaz faturası belgelere eklendi.",
    zaman: "Dün",
    okundu: true,
  },
  {
    id: "b5",
    ikon: "solar:user-plus-bold-duotone",
    renk: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
    baslik: "Yeni kullanıcı davet edildi",
    aciklama: "Ayşe Kaya enerji analisti olarak eklendi.",
    zaman: "2 gün önce",
    okundu: true,
  },
];

export function BildirimMenu() {
  const [bildirimler, setBildirimler] = React.useState<Bildirim[]>(BASLANGIC);
  const okunmamis = bildirimler.filter((b) => !b.okundu).length;

  const tumunuOku = () =>
    setBildirimler((prev) => prev.map((b) => ({ ...b, okundu: true })));

  const okuIsaretle = (id: string) =>
    setBildirimler((prev) =>
      prev.map((b) => (b.id === id ? { ...b, okundu: true } : b)),
    );

  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label={`Bildirimler${okunmamis ? ` (${okunmamis} okunmamış)` : ""}`}
            className="relative inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-popup-open:bg-muted data-popup-open:text-foreground"
          />
        }
      >
        <Icon icon="solar:bell-linear" className="size-4.5" />
        {okunmamis > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white ring-2 ring-card">
            {okunmamis}
          </span>
        ) : null}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 gap-0 p-0"
      >
        {/* Başlık */}
        <div className="flex items-center justify-between border-b px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Bildirimler</span>
            {okunmamis > 0 ? (
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {okunmamis} yeni
              </span>
            ) : null}
          </div>
          {okunmamis > 0 ? (
            <button
              type="button"
              onClick={tumunuOku}
              className="text-xs font-medium text-primary hover:underline"
            >
              Tümünü okundu işaretle
            </button>
          ) : null}
        </div>

        {/* Liste */}
        <div className="max-h-80 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar]:w-1.5">
          {bildirimler.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 py-10 text-center">
              <Icon icon="solar:bell-off-linear" className="size-7 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Bildiriminiz yok</p>
            </div>
          ) : (
            bildirimler.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => okuIsaretle(b.id)}
                className={cn(
                  "flex w-full items-start gap-3 border-b px-3.5 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/60",
                  !b.okundu && "bg-primary/[0.035]",
                )}
              >
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", b.renk)}>
                  <Icon icon={b.ikon} className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-[13px] leading-snug", !b.okundu ? "font-semibold" : "font-medium")}>
                      {b.baslik}
                    </p>
                    {!b.okundu ? (
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-emerald-500" />
                    ) : null}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{b.aciklama}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/80">{b.zaman}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Alt */}
        <div className="border-t p-1.5">
          <button
            type="button"
            onClick={() => toast("Tüm bildirimler yakında")}
            className="w-full rounded-md py-2 text-center text-xs font-medium text-primary transition-colors hover:bg-muted"
          >
            Tüm bildirimleri gör
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
