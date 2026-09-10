"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDil } from "@/components/providers/dil-provider";

const YILLAR = ["2024", "2025", "2026"];
const AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export function YilAySecim() {
  const { t } = useDil();
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">{t("Yıl")}</span>
        <Select defaultValue="2026">
          <SelectTrigger className="w-28 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YILLAR.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">{t("Ay")}</span>
        <Select defaultValue="Ağustos">
          <SelectTrigger className="w-32 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AYLAR.map((a) => (
              <SelectItem key={a} value={a}>
                {t(a)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
