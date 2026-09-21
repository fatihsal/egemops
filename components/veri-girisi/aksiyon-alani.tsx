"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useVeriGirisi } from "@/components/veri-girisi/form-store";
import { useDil } from "@/components/providers/dil-provider";
import { enerjiKaydiKaydet } from "@/lib/data/veri-girisi";

const AY_ADLARI = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export function AksiyonAlani() {
  const { denemeVeDogrula, degerleriAl, yil, ay } = useVeriGirisi();
  const { t } = useDil();
  const [hataSayisi, setHataSayisi] = React.useState(0);
  const [kaydediliyor, setKaydediliyor] = React.useState(false);

  const donemMetni = `${t(AY_ADLARI[ay - 1])} ${yil}`;

  async function kaydet(durum: "taslak" | "onayli") {
    if (kaydediliyor) return;

    if (durum === "onayli") {
      const hatalar = denemeVeDogrula();
      setHataSayisi(hatalar.length);
      if (hatalar.length > 0) {
        toast.error(`${hatalar.length} ${t("alan eksik veya hatalı")}`, {
          description: t("Kırmızı işaretli alanları düzeltip tekrar deneyin."),
        });
        return;
      }
    }

    setKaydediliyor(true);
    try {
      await enerjiKaydiKaydet({ yil, ay, durum, degerler: degerleriAl() });
      if (durum === "onayli") {
        setHataSayisi(0);
        toast.success(t("Veriler onaylandı"), {
          description: `${donemMetni} ${t("dönemi kaydedildi.")}`,
        });
      } else {
        toast.success(t("Taslak kaydedildi"), { description: donemMetni });
      }
    } catch (e) {
      toast.error(t("Kayıt başarısız"), {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setKaydediliyor(false);
    }
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
          disabled={kaydediliyor}
          onClick={() => kaydet("taslak")}
        >
          <Icon icon="solar:diskette-bold-duotone" className="size-4" />
          {t("Taslak Kaydet")}
        </Button>
        <Button
          className="w-full justify-center gap-1.5 bg-amber-500 text-white shadow-sm hover:bg-amber-600"
          disabled={kaydediliyor}
          onClick={() => kaydet("onayli")}
        >
          <Icon icon="solar:shield-check-bold-duotone" className="size-4" />
          {t("Onayla")}
        </Button>
      </div>
    </div>
  );
}
