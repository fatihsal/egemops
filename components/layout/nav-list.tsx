"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navGruplari } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Sidebar ve mobil menüde ortak kullanılan, bölümlü navigasyon. */
export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-5">
      {navGruplari.map((grup) => (
        <div key={grup.baslik} className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {grup.baslik}
          </div>
          {grup.ogeler.map((oge) => {
            const aktif =
              oge.href === "/"
                ? pathname === "/"
                : pathname.startsWith(oge.href);
            const Ikon = oge.ikon;
            return (
              <Link
                key={oge.baslik}
                href={oge.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  aktif
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Ikon className="size-4" />
                {oge.baslik}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
