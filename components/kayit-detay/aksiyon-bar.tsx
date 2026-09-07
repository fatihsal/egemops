"use client";

import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AksiyonBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-3 shadow-sm">
      <Button
        variant="outline"
        render={<Link href="/enerji-kayitlari" />}
        nativeButton={false}
        className="gap-1.5"
      >
        <ArrowLeft className="size-4" />
        Geri
      </Button>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          render={<Link href="/veri-girisi" />}
          nativeButton={false}
          className="gap-1.5"
        >
          <Icon icon="solar:pen-new-square-bold-duotone" className="size-4" />
          Düzenle
        </Button>
        <Button
          className="gap-1.5 bg-amber-500 text-white hover:bg-amber-600"
          onClick={() =>
            toast("Kayıt revizyona açıldı", {
              description: "Onaylı kayıt yeniden düzenlenebilir.",
            })
          }
        >
          <Icon icon="solar:refresh-circle-bold-duotone" className="size-4" />
          Revizyona Aç
        </Button>

        {/* Rapor Oluştur — bölünmüş buton */}
        <div className="flex">
          <Button
            className="gap-1.5 rounded-r-none bg-teal-600 text-white hover:bg-teal-700"
            onClick={() => toast.success("Rapor oluşturuldu")}
          >
            <Icon icon="solar:file-download-bold-duotone" className="size-4" />
            Rapor Oluştur
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  aria-label="Rapor biçimi"
                  className="rounded-l-none border-l border-teal-500/50 bg-teal-600 px-2 text-white hover:bg-teal-700"
                />
              }
            >
              <ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.success("PDF raporu oluşturuldu")}>
                <Icon icon="vscode-icons:file-type-pdf2" className="size-4" />
                PDF olarak
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Excel raporu oluşturuldu")}>
                <Icon icon="vscode-icons:file-type-excel" className="size-4" />
                Excel olarak
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
