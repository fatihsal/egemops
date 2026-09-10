"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import { useDil } from "@/components/providers/dil-provider";
import { OzetFiltreler } from "@/components/yonetim-ozeti/filtreler";
import { OzetKpiKartlari } from "@/components/yonetim-ozeti/kpi";
import { OzetTuketimUretim } from "@/components/yonetim-ozeti/tuketim-uretim";
import { OzetKaynakDonut } from "@/components/yonetim-ozeti/kaynak-donut";
import { OzetPerformansTrend } from "@/components/yonetim-ozeti/performans-trend";
import { OzetHedefGerceklesme } from "@/components/yonetim-ozeti/hedef-gerceklesme";
import { OzetOneCikan } from "@/components/yonetim-ozeti/one-cikan";
import { OzetAktifProjeler } from "@/components/yonetim-ozeti/aktif-projeler";
import { OzetSonRaporlar } from "@/components/yonetim-ozeti/son-raporlar";
import { OzetSistemDurumu } from "@/components/yonetim-ozeti/sistem-durumu";

export default function YonetimOzetiPage() {
  const { t } = useDil();
  return (
    <div className="space-y-6">
      {/* Filtreler */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <OzetFiltreler />
      </div>

      <OzetKpiKartlari />

      {/* Aylık tüketim & üretim — tam genişlik */}
      <OzetTuketimUretim />

      {/* Kaynak + maliyet dağılımı — ikili */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <OzetKaynakDonut baslik="Enerji Kaynakları Dağılımı (TEP)" tur="tep" />
        <OzetKaynakDonut baslik="Enerji Maliyet Dağılımı" tur="maliyet" />
      </div>

      {/* Performans trendi — tam genişlik */}
      <OzetPerformansTrend />

      {/* Hedef + öne çıkanlar — ikili */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <OzetHedefGerceklesme />
        <OzetOneCikan />
      </div>

      {/* Aktif projeler — tam genişlik */}
      <OzetAktifProjeler />

      {/* Raporlar + sistem — ikili */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <OzetSonRaporlar />
        <OzetSistemDurumu />
      </div>

      {/* Alt bilgi çubuğu */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-xs text-muted-foreground shadow-sm">
        <span className="inline-flex items-center gap-2">
          <Icon icon="solar:info-circle-linear" className="size-4" />
          {t("Son güncelleme")}: 26.08.2026 10:45 · {t("Veriler taslaktır. Resmi raporlar için")} <Link href="/raporlar" className="font-medium text-primary">{t("Raporlar sayfasını")}</Link> {t("kullanın.")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Icon icon="solar:leaf-bold-duotone" className="size-4 text-emerald-500" />
          {t("Daha Verimli Bir Gelecek İçin")} · <span className="font-semibold text-foreground">EgemOps</span>
        </span>
      </div>
    </div>
  );
}
