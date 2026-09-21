"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDil } from "@/components/providers/dil-provider";
import { useVeriGirisi } from "@/components/veri-girisi/form-store";
import {
  belgeleriGetir,
  belgeYukle,
  belgeSil,
  type KaynakBelge,
} from "@/lib/data/kaynak-belgeler";

function turIkon(tur: string | null): string {
  switch (tur) {
    case "PDF":
      return "vscode-icons:file-type-pdf2";
    case "Excel":
      return "vscode-icons:file-type-excel";
    case "Word":
      return "vscode-icons:file-type-word";
    case "Görsel":
      return "solar:gallery-bold-duotone";
    default:
      return "solar:file-bold-duotone";
  }
}

function boyutBicim(byte: number | null): string {
  if (!byte) return "";
  if (byte < 1024) return `${byte} B`;
  if (byte < 1024 * 1024) return `${Math.round(byte / 1024)} KB`;
  return `${(byte / (1024 * 1024)).toFixed(1)} MB`;
}

export function KaynakBelgelerKarti() {
  const { t } = useDil();
  const { yil, ay } = useVeriGirisi();
  const [belgeler, setBelgeler] = React.useState<KaynakBelge[]>([]);
  const [yukleniyor, setYukleniyor] = React.useState(false);
  const [acik, setAcik] = React.useState(false);
  const dosyaRef = React.useRef<HTMLInputElement>(null);

  const yenile = React.useCallback(() => {
    belgeleriGetir(yil, ay)
      .then(setBelgeler)
      .catch(() => setBelgeler([]));
  }, [yil, ay]);

  React.useEffect(() => {
    yenile();
  }, [yenile]);

  async function dosyaSecildi(e: React.ChangeEvent<HTMLInputElement>) {
    const dosya = e.target.files?.[0];
    e.target.value = ""; // aynı dosya tekrar seçilebilsin
    if (!dosya) return;

    if (dosya.size > 20 * 1024 * 1024) {
      toast.error(t("Dosya en fazla 20 MB olabilir"));
      return;
    }

    setYukleniyor(true);
    try {
      await belgeYukle(dosya, yil, ay);
      toast.success(t("Belge yüklendi"));
      setAcik(false);
      yenile();
    } catch (err) {
      toast.error(t("Yükleme başarısız"), {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setYukleniyor(false);
    }
  }

  async function sil(b: KaynakBelge) {
    try {
      await belgeSil(b);
      toast.success(t("Belge silindi"));
      yenile();
    } catch (err) {
      toast.error(t("Silme başarısız"), {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon icon="solar:documents-bold-duotone" className="size-5 text-primary" />
            {t("Kaynak Belgeler")}
          </CardTitle>

          <Sheet open={acik} onOpenChange={setAcik}>
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
              </SheetHeader>
              <div className="p-5">
                <input
                  ref={dosyaRef}
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={dosyaSecildi}
                />
                <button
                  type="button"
                  disabled={yukleniyor}
                  onClick={() => dosyaRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-14 text-center transition-colors hover:border-primary/50 hover:bg-muted/40 disabled:opacity-60"
                >
                  <Icon
                    icon={yukleniyor ? "svg-spinners:180-ring" : "solar:cloud-upload-bold-duotone"}
                    className="size-10 text-muted-foreground"
                  />
                  <div className="text-sm">
                    <span className="font-medium text-primary">{t("Dosya seç")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("PDF, XLSX, JPG · en fazla 20 MB")}
                  </p>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {belgeler.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-muted-foreground">
            <Icon icon="solar:folder-open-bold-duotone" className="size-9 opacity-60" />
            <span className="text-sm">{t("Bu dönem için belge yok.")}</span>
          </div>
        ) : (
          belgeler.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2 transition-colors hover:bg-muted/50"
            >
              <Icon icon={turIkon(b.tur)} className="size-6 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{b.ad}</p>
                {b.boyut ? (
                  <p className="text-xs text-muted-foreground">{boyutBicim(b.boyut)}</p>
                ) : null}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                render={
                  <a href={b.url} target="_blank" rel="noopener noreferrer">
                    <Icon icon="solar:eye-bold-duotone" className="size-4" />
                    {t("Görüntüle")}
                  </a>
                }
              />
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={t("Sil")}
                onClick={() => sil(b)}
              >
                <Icon icon="solar:trash-bin-trash-bold-duotone" className="size-4 text-red-500" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
