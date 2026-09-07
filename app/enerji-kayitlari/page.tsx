import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { EnerjiKayitlariIcerik } from "@/components/enerji-kayitlari/enerji-kayitlari-icerik";

export default function EnerjiKayitlariPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            Enerji Kayıtları
            <Icon
              icon="solar:info-circle-bold-duotone"
              className="size-5 text-muted-foreground"
            />
          </h1>
          <p className="text-sm text-muted-foreground">
            Aylık enerji verilerini görüntüleyin, filtreleyin ve yönetin.
          </p>
        </div>

        <Button
          render={<Link href="/veri-girisi" />}
          nativeButton={false}
          className="gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700"
        >
          <Icon icon="solar:add-circle-bold-duotone" className="size-4.5" />
          Yeni Aylık Kayıt
        </Button>
      </div>

      <EnerjiKayitlariIcerik />
    </div>
  );
}
