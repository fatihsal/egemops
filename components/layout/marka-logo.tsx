"use client";

import * as React from "react";
import { Icon } from "@iconify/react";

/**
 * Marka logosu: `public/logo.png` görseli + "EGEM AMBALAJ" yazısı yan yana.
 * Logo dosyası yoksa (veya yüklenemezse) görsel yerine varsayılan kutu ikonu
 * gösterilir; yazı her durumda kalır. Logoyu değiştirmek için tek yapılacak:
 * kendi logo dosyanı `public/logo.png` olarak eklemek.
 */
export function MarkaLogo() {
  const [hata, setHata] = React.useState(false);

  return (
    <div className="flex items-center gap-2.5">
      {!hata ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="EGEM Ambalaj logosu"
          className="h-10 w-auto max-w-[72px] shrink-0 object-contain"
          onError={() => setHata(true)}
        />
      ) : (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Icon icon="solar:box-bold-duotone" className="size-5" />
        </div>
      )}
      <div className="leading-tight">
        <div className="font-heading text-sm font-bold text-primary">EGEM</div>
        <div className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground">AMBALAJ</div>
      </div>
    </div>
  );
}
