"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function AksiyonAlani() {
  return (
    <div className="space-y-4">
      {/* Doğrulama kartı */}
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/50">
        <Icon
          icon="solar:check-circle-bold-duotone"
          className="size-6 shrink-0 text-emerald-600 dark:text-emerald-400"
        />
        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
          Veriler doğrulandı. Kritik hata bulunmadı.
        </span>
      </div>

      {/* Aksiyonlar — dar sağ sütunda dikey, tam genişlik */}
      <div className="flex flex-col gap-2.5">
        <Button
          variant="outline"
          className="w-full justify-center gap-1.5"
          onClick={() => toast.success("Taslak kaydedildi")}
        >
          <Icon icon="solar:diskette-bold-duotone" className="size-4" />
          Taslak Kaydet
        </Button>
        <Button
          className="w-full justify-center gap-1.5 bg-amber-500 text-white shadow-sm hover:bg-amber-600"
          onClick={() =>
            toast.success("Veriler onaylandı", {
              description: "Ağustos 2026 dönemi onaya gönderildi.",
            })
          }
        >
          <Icon icon="solar:shield-check-bold-duotone" className="size-4" />
          Onayla
        </Button>
      </div>
    </div>
  );
}
