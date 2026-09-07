import { Icon } from "@iconify/react";

import { NavList } from "@/components/layout/nav-list";
import { EnerjiIllustrasyon } from "@/components/layout/enerji-illustrasyon";

export function AppSidebar() {
  return (
    <aside className="hidden w-52 shrink-0 border-r bg-sidebar text-sidebar-foreground md:flex md:flex-col">
      {/* Logo / marka */}
      <div className="flex h-14 items-center gap-2.5 border-b px-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
          <Icon icon="solar:box-bold-duotone" className="size-5" />
        </div>
        <div className="leading-tight">
          <div className="font-heading text-sm font-bold text-primary">EGEM</div>
          <div className="text-[10px] font-medium tracking-[0.15em] text-muted-foreground">
            AMBALAJ
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <NavList />
      </div>

      <EnerjiIllustrasyon className="w-full shrink-0 px-3" />

      <div className="border-t p-3 text-xs text-muted-foreground">
        Sürüm 0.1.0
      </div>
    </aside>
  );
}
