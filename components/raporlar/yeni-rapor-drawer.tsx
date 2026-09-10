"use client";

import * as React from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RaporOlusturForm } from "@/components/raporlar/rapor-olustur-form";
import { useDil } from "@/components/providers/dil-provider";

export function YeniRaporDrawer({ trigger }: { trigger: React.ReactElement }) {
  const { t } = useDil();
  const [acik, setAcik] = React.useState(false);

  return (
    <Sheet open={acik} onOpenChange={setAcik}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{t("Yeni Rapor")}</SheetTitle>
          <SheetDescription>{t("Rapor türünü ve dönemini seçerek yeni bir rapor oluşturun.")}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-5">
          <RaporOlusturForm onSubmitted={() => setAcik(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
