"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { aktifModul, moduller } from "@/lib/nav";
import { useDil } from "@/components/providers/dil-provider";

/** Sidebar üstünde aktif modülü gösterir + modül seçim hub'ına dönüş. */
export function ModulGecis({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useDil();
  const modul = moduller.find((m) => m.anahtar === aktifModul(pathname));

  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="group flex items-center gap-2 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/40 px-2.5 py-2 transition-colors hover:bg-sidebar-accent"
    >
      <ChevronLeft className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
      <span className="min-w-0 leading-tight">
        <span className="block text-[9px] font-medium tracking-[0.1em] text-muted-foreground uppercase">
          {t("Modüller")}
        </span>
        <span className="block truncate text-[13px] font-semibold text-sidebar-foreground">
          {t(modul?.ad ?? "Enerji Yönetimi")}
        </span>
      </span>
    </Link>
  );
}
