"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function KullaniciMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Kullanıcı menüsü"
            className="ml-0.5 flex items-center gap-2 rounded-lg border-l pl-2 transition-colors hover:bg-muted sm:pl-2.5"
          />
        }
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-[11px] font-bold text-white">
          UM
        </span>
        <span className="hidden text-left leading-tight lg:block">
          <span className="block text-[13px] font-semibold">Uğur Melih</span>
          <span className="block text-[11px] text-muted-foreground">Enerji Yöneticisi</span>
        </span>
        <Icon icon="solar:alt-arrow-down-linear" className="mr-1 hidden size-3.5 text-muted-foreground lg:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-60">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-xs font-bold text-white">
            UM
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-sm font-semibold">Uğur Melih</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              ugur.melih@egemambalaj.com
            </span>
          </span>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/ayarlar" />}>
          <Icon icon="solar:user-circle-bold-duotone" className="size-4.5 text-muted-foreground" />
          Profilim
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/ayarlar" />}>
          <Icon icon="solar:settings-bold-duotone" className="size-4.5 text-muted-foreground" />
          Hesap Ayarları
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast("Bildirim tercihleri yakında")}>
          <Icon icon="solar:bell-bold-duotone" className="size-4.5 text-muted-foreground" />
          Bildirim Tercihleri
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => toast("Yardım merkezi yakında")}>
          <Icon icon="solar:question-circle-bold-duotone" className="size-4.5 text-muted-foreground" />
          Yardım &amp; Destek
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => toast.success("Çıkış yapıldı")}
          className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950/50 dark:focus:text-red-300"
        >
          <Icon icon="solar:logout-2-bold-duotone" className="size-4.5" />
          Çıkış Yap
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
