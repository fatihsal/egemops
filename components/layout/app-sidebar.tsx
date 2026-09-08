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

      <div className="border-t p-3 text-xs text-muted-foreground">
        Sürüm 0.1.0
      </div>
    </aside>
  );
}
