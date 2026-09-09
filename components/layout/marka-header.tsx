"use client";

import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BildirimMenu } from "@/components/layout/bildirim-menu";
import { KullaniciMenu } from "@/components/layout/kullanici-menu";
import { sayfaMeta } from "@/lib/sayfa-meta";

/**
 * Markalı üst bar (Ana Sayfa / hero header).
 * Logo + sürdürülebilirlik sloganı + breadcrumb/başlık/rozet + dekoratif dalga +
 * tema/bildirim/kullanıcı.
 */
export function MarkaHeader() {
  const { baslik, altBaslik } = sayfaMeta(usePathname());
  return (
    <header className="relative overflow-hidden border-b bg-card">
      {/* Dekoratif akışkan dalga (yalnızca geniş ekran) */}
      <div className="pointer-events-none absolute inset-y-0 right-36 left-1/4 hidden overflow-hidden lg:block">
        <svg viewBox="0 0 800 80" preserveAspectRatio="none" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="dalgaGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5eead4" stopOpacity="0" />
              <stop offset="0.35" stopColor="#2dd4bf" stopOpacity="0.9" />
              <stop offset="0.65" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="1" stopColor="#818cf8" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => {
            const amp = 9 + i * 3;
            const yoff = 40 + (i - 2) * 7;
            const phase = i * 0.7;
            const freq = 0.017 + i * 0.0016;
            const pts = Array.from({ length: 64 }, (_, x) => {
              const X = (x * 800) / 63;
              const Y = yoff + amp * Math.sin(X * freq + phase);
              return `${X.toFixed(0)},${Y.toFixed(1)}`;
            }).join(" ");
            return (
              <polyline
                key={i}
                points={pts}
                stroke="url(#dalgaGrad)"
                strokeWidth={1.3}
                strokeLinecap="round"
                strokeOpacity={0.65 - i * 0.09}
              />
            );
          })}
        </svg>
      </div>
      {/* Sağ filigran */}
      <div className="pointer-events-none absolute top-1/2 right-80 hidden -translate-y-1/2 flex-col items-center gap-0.5 text-center xl:flex">
        <Icon icon="solar:leaf-bold-duotone" className="size-4 text-emerald-400/70" />
        <span className="text-[8px] font-semibold tracking-[0.18em] text-muted-foreground/50 uppercase leading-tight">
          Bugünün Enerjisi<br />Yarının Geleceği
        </span>
      </div>

      <div className="relative flex h-20 items-stretch">
        {/* Sürdürülebilirlik sloganı (masaüstü) */}
        <div className="hidden items-center gap-1.5 border-r px-4 md:flex">
          <Icon icon="solar:leaf-bold-duotone" className="size-5 text-emerald-500" />
          <span className="text-[9px] font-semibold tracking-[0.12em] text-emerald-700 uppercase leading-tight dark:text-emerald-400">
            Daha Temiz<br />Yarınlar İçin
          </span>
        </div>

        {/* Mobil: hamburger */}
        <div className="flex items-center pl-2 md:hidden">
          <MobileNav />
        </div>

        {/* Başlık alanı */}
        <div className="flex min-w-0 flex-1 flex-col justify-center px-4">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
            <h1 className="truncate font-heading text-lg font-bold tracking-tight">{baslik}</h1>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Icon icon="solar:leaf-bold-duotone" className="size-3" />
              Sürdürülebilirlik Modülü
            </span>
          </div>
          <p className="mt-0.5 hidden text-[11px] leading-tight text-muted-foreground sm:line-clamp-2">
            {altBaslik}
          </p>
        </div>

        {/* Aksiyonlar + kullanıcı */}
        <div className="flex shrink-0 items-center gap-0.5 border-l px-2 sm:gap-1.5 sm:px-3">
          <ThemeToggle />
          <BildirimMenu />
          <KullaniciMenu />
        </div>
      </div>
    </header>
  );
}
