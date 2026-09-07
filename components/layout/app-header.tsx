import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <MobileNav />
        <span className="font-heading text-sm font-semibold">
          Enerji Yönetimi
        </span>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
      </div>
    </header>
  );
}
