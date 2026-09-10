"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDil } from "@/components/providers/dil-provider";

const YILLAR = ["2026", "2025", "2024"];

export function KatsayiFiltreler() {
  const { t } = useDil();
  const [yil, setYil] = React.useState("2026");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 rounded-lg border bg-card pl-3 shadow-sm">
        <span className="text-xs font-medium text-muted-foreground">{t("Katsayı Yılı")}</span>
        <Select value={yil} onValueChange={(v) => setYil(v as string)}>
          <SelectTrigger className="h-9 w-[84px] border-0 bg-transparent shadow-none"><SelectValue /></SelectTrigger>
          <SelectContent>{YILLAR.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="h-9 gap-1.5 bg-card" onClick={() => toast(t("Resmi katsayı setinden içe aktarılıyor"))}>
        <Icon icon="solar:import-bold-duotone" className="size-4.5 text-muted-foreground" />
        {t("Resmi Setten Al")}
      </Button>
      <Button className="h-9 gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700" onClick={() => toast.success(t("Katsayı değişiklikleri kaydedildi"))}>
        <Icon icon="solar:diskette-bold-duotone" className="size-4.5" />
        {t("Değişiklikleri Kaydet")}
      </Button>
    </div>
  );
}
