"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useVeriGirisi } from "@/components/veri-girisi/form-store";
import { useDil } from "@/components/providers/dil-provider";

export function AksiyonAlani() {
  const { denemeVeDogrula } = useVeriGirisi();
  const { t } = useDil();
  const [hataSayisi, setHataSayisi] = React.useState(0);

  function onayla() {
    const hatalar = denemeVeDogrula();
    setHataSayisi(hatalar.length);
    if (hatalar.length > 0) {
      toast.error(`${hatalar.length} ${t("alan eksik veya hatalı")}`, {
        description: t("Kırmızı işaretli alanları düzeltip tekrar deneyin."),
      });
      return;
    }
    toast.success(t("Veriler onaylandı"), {
      description: t("Ağustos 2026 dönemi onaya gönderildi."),
    });
  }

  return (
    <div className="space-y-4">
      {/* Doğrulama durumu */}
      {hataSayisi > 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900 dark:bg-red-950/50">
          <Icon
            icon="solar:danger-triangle-bold-duotone"
            className="size-6 shrink-0 text-red-600 dark:text-red-400"
          />
          <span className="text-sm font-medium text-red-800 dark:text-red-300">
            {hataSayisi} {t("alan eksik veya hatalı. Lütfen düzeltin.")}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/50">
          <Icon
            icon="solar:check-circle-bold-duotone"
            className="size-6 shrink-0 text-emerald-600 dark:text-emerald-400"
          />
          <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            {t("Veriler doğrulandı. Kritik hata bulunmadı.")}
          </span>
        </div>
      )}

      {/* Aksiyonlar — dar sağ sütunda dikey, tam genişlik */}
      <div className="flex flex-col gap-2.5">
        <Button
          variant="outline"
          className="w-full justify-center gap-1.5"
          onClick={() => toast.success(t("Taslak kaydedildi"))}
        >
          <Icon icon="solar:diskette-bold-duotone" className="size-4" />
          {t("Taslak Kaydet")}
        </Button>
        <Button
          className="w-full justify-center gap-1.5 bg-amber-500 text-white shadow-sm hover:bg-amber-600"
          onClick={onayla}
        >
          <Icon icon="solar:shield-check-bold-duotone" className="size-4" />
          {t("Onayla")}
        </Button>
      </div>
    </div>
  );
}
