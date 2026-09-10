"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDil } from "@/components/providers/dil-provider";

export interface DuzenleAlan {
  anahtar: string;
  label: string;
  deger: string;
  birim?: string;
}

export function KatsayiDuzenleDrawer({ baslik, aciklama, alanlar, trigger, onKaydet }: {
  baslik: string;
  aciklama: string;
  alanlar: DuzenleAlan[];
  trigger: React.ReactElement;
  onKaydet?: (degerler: Record<string, string>) => void;
}) {
  const { t } = useDil();
  const [acik, setAcik] = React.useState(false);
  const [degerler, setDegerler] = React.useState<Record<string, string>>({});

  const sifirla = () => setDegerler(Object.fromEntries(alanlar.map((a) => [a.anahtar, a.deger])));

  const kaydet = () => {
    onKaydet?.(degerler);
    toast.success(`${baslik} ${t("güncellendi")}`);
    setAcik(false);
  };

  return (
    <Sheet open={acik} onOpenChange={(o) => { if (o) sifirla(); setAcik(o); }}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{baslik}</SheetTitle>
          <SheetDescription>{aciklama}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {alanlar.map((a) => (
            <div key={a.anahtar} className="space-y-1.5">
              <Label htmlFor={a.anahtar} className="text-xs text-muted-foreground">{a.label}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id={a.anahtar}
                  value={degerler[a.anahtar] ?? a.deger}
                  onChange={(e) => setDegerler((p) => ({ ...p, [a.anahtar]: e.target.value }))}
                />
                {a.birim ? <span className="shrink-0 text-sm text-muted-foreground">{a.birim}</span> : null}
              </div>
            </div>
          ))}
          <p className="rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
            {t("Katsayı değişiklikleri, kaydedildikten sonra ilgili dönem hesaplamalarına uygulanır.")}
          </p>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>{t("İptal")}</SheetClose>
          <Button className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700" onClick={kaydet}>
            <Icon icon="solar:diskette-bold-duotone" className="size-4" />
            {t("Kaydet")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
