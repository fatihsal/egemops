"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { BelgeYukleButonu } from "@/components/belgeler/belge-yukle";
import { useDil } from "@/components/providers/dil-provider";

export function BelgeFiltreler() {
  const { t } = useDil();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" className="h-9 gap-1.5 bg-card" onClick={() => toast(t("Yeni klasör oluşturuluyor"))}>
        <Icon icon="solar:folder-with-files-bold-duotone" className="size-4.5 text-muted-foreground" />
        {t("Klasör Oluştur")}
      </Button>
      <BelgeYukleButonu />
    </div>
  );
}
