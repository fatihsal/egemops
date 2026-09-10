"use client";

import * as React from "react";
import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const YILLAR = ["Tümü", "2023", "2024", "2025", "2026"];
const AYLAR = [
  "Tümü", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
const DURUMLAR = ["Tümü", "Taslak", "Kontrol Bekliyor", "Onaylandı"];
const TURLER = ["Tümü", "Elektrik", "GES", "Doğalgaz", "Akaryakıt"];

export interface FiltreDegerleri {
  yil: string;
  ay: string;
  durum: string;
  tur: string;
}

export const VARSAYILAN_FILTRE: FiltreDegerleri = {
  yil: "Tümü",
  ay: "Tümü",
  durum: "Tümü",
  tur: "Tümü",
};

function FiltreSecim({
  etiket,
  secenekler,
  value,
  onChange,
}: {
  etiket: string;
  secenekler: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{etiket}</Label>
      <Select value={value} onValueChange={(v) => onChange(v as string)}>
        <SelectTrigger className="w-full bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {secenekler.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function KayitFiltreleri({
  onFiltrele,
  onTemizle,
}: {
  onFiltrele: (f: FiltreDegerleri) => void;
  onTemizle: () => void;
}) {
  const [taslak, setTaslak] = React.useState<FiltreDegerleri>(VARSAYILAN_FILTRE);
  const guncelle = (k: keyof FiltreDegerleri) => (v: string) =>
    setTaslak((p) => ({ ...p, [k]: v }));

  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-4">
        <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
          <FiltreSecim etiket="Yıl" secenekler={YILLAR} value={taslak.yil} onChange={guncelle("yil")} />
          <FiltreSecim etiket="Ay" secenekler={AYLAR} value={taslak.ay} onChange={guncelle("ay")} />
          <FiltreSecim etiket="Durum" secenekler={DURUMLAR} value={taslak.durum} onChange={guncelle("durum")} />
          <FiltreSecim etiket="Enerji Türü" secenekler={TURLER} value={taslak.tur} onChange={guncelle("tur")} />
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700"
            onClick={() => onFiltrele(taslak)}
          >
            <Icon icon="solar:filter-bold-duotone" className="size-4" />
            Filtrele
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              setTaslak(VARSAYILAN_FILTRE);
              onTemizle();
            }}
          >
            <Icon icon="solar:refresh-circle-bold-duotone" className="size-4" />
            Temizle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
