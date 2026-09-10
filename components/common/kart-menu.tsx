"use client";

import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDil } from "@/components/providers/dil-provider";

export function KartMenu({
  baslik = "Veri",
  detayHref,
}: {
  baslik?: string;
  detayHref?: string;
}) {
  const { t } = useDil();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("Kart menüsü")}
            className="absolute top-2 right-2 text-muted-foreground/60 hover:text-foreground"
          />
        }
      >
        <MoreVertical className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {detayHref ? (
          <DropdownMenuItem render={<Link href={detayHref} />}>
            <Icon icon="solar:eye-bold-duotone" className="size-4" />
            {t("Detayı gör")}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onClick={() => toast.success(`${t(baslik)} ${t("dışa aktarıldı")}`)}>
          <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4" />
          {t("Dışa aktar")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast(`${t(baslik)} ${t("yenilendi")}`)}>
          <Icon icon="solar:refresh-circle-bold-duotone" className="size-4" />
          {t("Yenile")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
