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

export function KartMenu({
  baslik = "Veri",
  detayHref,
}: {
  baslik?: string;
  detayHref?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Kart menüsü"
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
            Detayı gör
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onClick={() => toast.success(`${baslik} dışa aktarıldı`)}>
          <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4" />
          Dışa aktar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toast(`${baslik} yenilendi`)}>
          <Icon icon="solar:refresh-circle-bold-duotone" className="size-4" />
          Yenile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
