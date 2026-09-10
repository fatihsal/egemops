"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDil } from "@/components/providers/dil-provider";

const BELGELER = [
  { ad: "Elektrik Faturası.pdf", ikon: "vscode-icons:file-type-pdf2", tur: "PDF" },
  { ad: "Doğalgaz Faturası.pdf", ikon: "vscode-icons:file-type-pdf2", tur: "PDF" },
  { ad: "GES_Agustos_2026_Raporu.xlsx", ikon: "vscode-icons:file-type-excel", tur: "Excel" },
  { ad: "Akaryakıt_Belgesi.pdf", ikon: "vscode-icons:file-type-pdf2", tur: "PDF" },
];

export function KaynakBelgelerKarti() {
  const { t } = useDil();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:documents-bold-duotone" className="size-5 text-primary" />
            {t("Kaynak Belgeler")}
          </CardTitle>

          {/* Yükleme drawer'ı */}
          <Sheet>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label={t("Belge yükle")}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                />
              }
            >
              <Icon icon="solar:cloud-upload-bold-duotone" className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
              <SheetHeader className="border-b p-5">
                <SheetTitle>{t("Belge Yükle")}</SheetTitle>
                <SheetDescription>
                  {t("Fatura, rapor veya destekleyici belgeleri ekleyin.")}
                </SheetDescription>
              </SheetHeader>
              <div className="p-5">
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-14 text-center">
                  <Icon
                    icon="solar:cloud-upload-bold-duotone"
                    className="size-10 text-muted-foreground"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-primary">{t("Dosya seç")}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      {t("veya buraya sürükleyip bırak")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("PDF, XLSX, JPG · en fazla 20 MB")}
                  </p>
                </div>
                <Button
                  className="mt-4 w-full gap-1.5"
                  onClick={() => toast.success(t("Belge yüklendi"))}
                >
                  <Icon icon="solar:upload-minimalistic-bold-duotone" className="size-4" />
                  {t("Yükle")}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {BELGELER.map((b) => (
          <div
            key={b.ad}
            className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 transition-colors hover:bg-muted/50"
          >
            <Icon icon={b.ikon} className="size-6 shrink-0" />
            <span className="flex-1 truncate text-sm font-medium">{b.ad}</span>

            {/* Önizleme drawer'ı */}
            <Sheet>
              <SheetTrigger
                render={<Button variant="outline" size="sm" className="gap-1.5" />}
              >
                <Icon icon="solar:eye-bold-duotone" className="size-4" />
                {t("Görüntüle")}
              </SheetTrigger>
              <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-lg">
                <SheetHeader className="border-b p-5">
                  <SheetTitle className="flex items-center gap-2">
                    <Icon icon={b.ikon} className="size-5" />
                    <span className="truncate">{b.ad}</span>
                  </SheetTitle>
                  <SheetDescription>{b.tur} {t("belgesi · önizleme")}</SheetDescription>
                </SheetHeader>
                <div className="p-5">
                  <div className="flex aspect-[3/4] flex-col items-center justify-center gap-3 rounded-xl border bg-muted/40 text-center">
                    <Icon icon={b.ikon} className="size-16" />
                    <p className="text-sm text-muted-foreground">
                      {t("Belge önizlemesi burada gösterilecek")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 w-full gap-1.5"
                    onClick={() => toast.success(`${b.ad} ${t("indiriliyor")}`)}
                  >
                    <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4" />
                    {t("İndir")}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
