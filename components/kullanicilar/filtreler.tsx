"use client";

import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { KullaniciOlusturDrawer } from "@/components/kullanicilar/kullanici-olustur-drawer";
import { useDil } from "@/components/providers/dil-provider";

export function KullaniciFiltreler() {
  const { t } = useDil();
  return (
    <KullaniciOlusturDrawer
      trigger={
        <Button className="h-9 gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700">
          <Icon icon="solar:user-plus-bold-duotone" className="size-4.5" />
          {t("Kullanıcı Ekle")}
        </Button>
      }
    />
  );
}
