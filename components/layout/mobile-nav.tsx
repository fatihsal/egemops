"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavList } from "@/components/layout/nav-list";
import { MarkaLogo } from "@/components/layout/marka-logo";
import { useDil } from "@/components/providers/dil-provider";

export function MobileNav() {
  const { t } = useDil();
  const [acik, setAcik] = React.useState(false);

  return (
    <Sheet open={acik} onOpenChange={setAcik}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("Menüyü aç")}
            className="md:hidden"
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-64 flex-col p-0">
        <SheetHeader className="h-16 shrink-0 flex-row items-center border-b px-4">
          <SheetTitle className="sr-only">{t("EGEM Ambalaj menüsü")}</SheetTitle>
          <MarkaLogo />
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-3">
          <NavList onNavigate={() => setAcik(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
