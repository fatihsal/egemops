"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { BelgeYukleDrawer } from "@/components/belgeler/yukle-drawer";

export function BelgeFiltreler() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" className="h-9 gap-1.5 bg-card" onClick={() => toast("Yeni klasör oluşturuluyor")}>
        <Icon icon="solar:folder-with-files-bold-duotone" className="size-4.5 text-muted-foreground" />
        Klasör Oluştur
      </Button>
      <BelgeYukleDrawer
        trigger={
          <Button className="h-9 gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700">
            <Icon icon="solar:upload-minimalistic-bold-duotone" className="size-4.5" />
            Belge Yükle
          </Button>
        }
      />
    </div>
  );
}
