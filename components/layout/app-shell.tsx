"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { MarkaHeader } from "@/components/layout/marka-header";
import { SayfaGecis } from "@/components/layout/sayfa-gecis";

// Uygulama kabuğu (sidebar + üst bar) olmadan tam ekran açılan rotalar.
const CERCEVESIZ_ROTALAR = ["/login"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const cercevesiz = CERCEVESIZ_ROTALAR.some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );

  if (cercevesiz) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MarkaHeader />
        <main className="flex-1 p-4 sm:p-6">
          <div className="w-full">
            <SayfaGecis>{children}</SayfaGecis>
          </div>
        </main>
      </div>
    </div>
  );
}
