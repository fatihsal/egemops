"use client";

import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjeFormDrawer } from "@/components/projeler/proje-form-drawer";
import { useProjeFiltre, type ProjeFiltre } from "@/components/projeler/filtre-store";
import { useDil } from "@/components/providers/dil-provider";

const YILLAR = ["2026", "2025", "2024"];
const DURUMLAR = ["Tümü", "Planlama", "Mühendislik", "Satın Alma / Hazırlık", "Uygulama", "Devreye Alma", "Tamamlandı"];
const TURLER = ["Tümü", "Elektrik", "Doğalgaz", "Akaryakıt"];
const SORUMLULAR = ["Tümü", "Bakım Onarım", "Enerji Ekibi"];

function Filtre({ etiket, deger, anahtar, secenekler, genislik }: {
  etiket: string;
  deger: string;
  anahtar: keyof ProjeFiltre;
  secenekler: string[];
  genislik: string;
}) {
  const { set } = useProjeFiltre();
  const { t } = useDil();
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card pl-3 shadow-sm">
      <span className="text-xs font-medium text-muted-foreground">{etiket}</span>
      <Select value={deger} onValueChange={(v) => set(anahtar, v as string)}>
        <SelectTrigger className={`h-9 border-0 bg-transparent shadow-none ${genislik}`}><SelectValue /></SelectTrigger>
        <SelectContent>{secenekler.map((s) => <SelectItem key={s} value={s}>{t(s)}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

export function ProjeFiltreler() {
  const { yil, durum, tur, sorumlu, aktifMi, sifirla } = useProjeFiltre();
  const { t } = useDil();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Filtre etiket={t("Yıl")} deger={yil} anahtar="yil" secenekler={YILLAR} genislik="w-[84px]" />
      <Filtre etiket={t("Durum")} deger={durum} anahtar="durum" secenekler={DURUMLAR} genislik="w-[150px]" />
      <Filtre etiket={t("Enerji Türü")} deger={tur} anahtar="tur" secenekler={TURLER} genislik="w-[110px]" />
      <Filtre etiket={t("Sorumlu")} deger={sorumlu} anahtar="sorumlu" secenekler={SORUMLULAR} genislik="w-[128px]" />

      {aktifMi ? (
        <Button variant="ghost" size="sm" className="h-9 gap-1 text-muted-foreground" onClick={sifirla}>
          <Icon icon="solar:restart-linear" className="size-4" />
          {t("Sıfırla")}
        </Button>
      ) : null}

      <ProjeFormDrawer
        trigger={
          <Button className="h-9 gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700">
            <Icon icon="solar:add-circle-bold-duotone" className="size-4.5" />
            {t("Yeni Proje")}
          </Button>
        }
      />
    </div>
  );
}
