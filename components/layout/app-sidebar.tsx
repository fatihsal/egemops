import { Code2 } from "lucide-react";

import { NavList } from "@/components/layout/nav-list";
import { EnerjiIllustrasyon } from "@/components/layout/enerji-illustrasyon";
import { MarkaLogo } from "@/components/layout/marka-logo";

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-52 shrink-0 border-r bg-sidebar text-sidebar-foreground md:flex md:flex-col">
      {/* Logo / marka */}
      <div className="flex h-20 items-center justify-center border-b px-4">
        <MarkaLogo />
      </div>

      <div className="flex-1 overflow-y-auto p-3 [scrollbar-color:rgb(148_163_184_/_0.4)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50">
        <NavList />
      </div>

      <EnerjiIllustrasyon className="w-full shrink-0 px-3" />

      <div className="border-t px-3 py-4">
        <div className="flex items-center gap-2">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
          <span className="group inline-flex items-center gap-1.5 rounded-full border border-teal-500/25 bg-gradient-to-r from-teal-50 to-cyan-50/50 py-1 pr-3 pl-1 shadow-sm transition-colors hover:border-teal-500/40 dark:border-teal-400/20 dark:from-teal-950/40 dark:to-cyan-950/20">
            <span className="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-sm">
              <Code2 className="size-3" />
            </span>
            <span className="text-[11px] font-semibold tracking-tight text-teal-700 dark:text-teal-300">
              Fatih Sal
            </span>
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>
        <p className="mt-2 text-center text-[8.5px] font-semibold tracking-[0.2em] text-muted-foreground/55 uppercase">
          Design &amp; Development
        </p>
      </div>
    </aside>
  );
}
