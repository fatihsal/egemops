"use client";

import * as React from "react";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { useDil } from "@/components/providers/dil-provider";

/** Silme işlemleri için onay penceresi. Onaylanınca onConfirm çağrılır. */
export function SilmeOnay({
  trigger,
  onConfirm,
  baslik,
  aciklama,
  open,
  onOpenChange,
}: {
  trigger?: React.ReactElement;
  onConfirm: () => void;
  baslik?: string;
  aciklama?: string;
  /** Kontrollü kullanım (ör. dropdown içinden açmak için). */
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
}) {
  const { t } = useDil();
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <AlertDialog.Trigger render={trigger} /> : null}
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <AlertDialog.Popup className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card p-5 shadow-xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
              <Icon icon="solar:trash-bin-trash-bold-duotone" className="size-5" />
            </span>
            <div className="min-w-0">
              <AlertDialog.Title className="font-heading text-base font-semibold">
                {baslik ?? t("Silmek istediğinize emin misiniz?")}
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-1 text-sm text-muted-foreground">
                {aciklama ?? t("Bu kayıt listeden kaldırılacak.")}
              </AlertDialog.Description>
            </div>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <AlertDialog.Close render={<Button variant="outline" size="sm" />}>
              {t("İptal")}
            </AlertDialog.Close>
            <AlertDialog.Close
              render={
                <Button
                  size="sm"
                  className="gap-1.5 bg-red-600 text-white hover:bg-red-700"
                  onClick={onConfirm}
                />
              }
            >
              <Icon icon="solar:trash-bin-trash-bold-duotone" className="size-4" />
              {t("Sil")}
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
