"use client";

import * as React from "react";
import { Icon } from "@iconify/react";

import { cn } from "@/lib/utils";

/** Tutarlı boş durum gösterimi (liste/tablo/sonuç yok). */
export function BosDurum({
  ikon = "solar:inbox-line-bold-duotone",
  baslik,
  aciklama,
  aksiyon,
  className,
}: {
  ikon?: string;
  baslik: string;
  aciklama?: string;
  aksiyon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Icon icon={ikon} className="size-7" />
      </span>
      <div className="space-y-1">
        <p className="font-medium">{baslik}</p>
        {aciklama ? (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{aciklama}</p>
        ) : null}
      </div>
      {aksiyon}
    </div>
  );
}
