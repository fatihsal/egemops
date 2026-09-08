"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavList } from "@/components/layout/nav-list";

export function MobileNav() {
  const [acik, setAcik] = React.useState(false);

  return (
    <Sheet open={acik} onOpenChange={setAcik}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menüyü aç"
            className="md:hidden"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-64 flex-col p-0">
        <SheetHeader className="h-14 shrink-0 flex-row items-center gap-2.5 border-b px-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon icon="solar:box-bold-duotone" className="size-5" />
          </div>
          <SheetTitle className="leading-tight">
            <span className="block font-heading text-sm font-bold text-primary">
              EGEM
            </span>
            <span className="block text-[10px] font-medium tracking-[0.15em] text-muted-foreground">
              AMBALAJ
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-3">
          <NavList onNavigate={() => setAcik(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
