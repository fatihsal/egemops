"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { aktifModul, modulGruplari } from "@/lib/nav";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

/** Sidebar ve mobil menüde ortak kullanılan, bölümlü navigasyon.
 *  Aktif modül URL'den türetilir; yalnızca o modülün grupları gösterilir. */
export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useDil();
  const gruplar = modulGruplari(aktifModul(pathname));

  return (
    <nav className="space-y-5">
      {gruplar.map((grup) => (
        <div key={grup.baslik} className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {t(grup.baslik)}
          </div>
          {grup.ogeler.map((oge) => {
            // Modül kökleri ("/" ve "/bakim") yalnızca tam eşleşmede aktif;
            // diğerleri alt rotalarda da aktif.
            const kokMu = oge.href === "/" || oge.href === "/bakim";
            const aktif = kokMu
              ? pathname === oge.href
              : pathname === oge.href || pathname.startsWith(`${oge.href}/`);
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
                {t(oge.baslik)}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
