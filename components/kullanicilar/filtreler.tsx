"use client";

import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { KullaniciFormDrawer } from "@/components/kullanicilar/kullanici-form-drawer";

export function KullaniciFiltreler() {
  return (
    <KullaniciFormDrawer
      trigger={
        <Button className="h-9 gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700">
          <Icon icon="solar:user-plus-bold-duotone" className="size-4.5" />
          Kullanıcı Davet Et
        </Button>
      }
    />
  );
}
