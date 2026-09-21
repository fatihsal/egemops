"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDil } from "@/components/providers/dil-provider";
import { useVeriGirisi } from "@/components/veri-girisi/form-store";

const YILLAR = [2024, 2025, 2026];
const AYLAR = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export function YilAySecim() {
  const { t } = useDil();
  const { yil, ay, setDonem } = useVeriGirisi();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">{t("Yıl")}</span>
        <Select value={String(yil)} onValueChange={(v) => setDonem(Number(v), ay)}>
          <SelectTrigger className="w-28 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YILLAR.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">{t("Ay")}</span>
        <Select value={String(ay)} onValueChange={(v) => setDonem(yil, Number(v))}>
          <SelectTrigger className="w-32 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AYLAR.map((a, i) => (
              <SelectItem key={a} value={String(i + 1)}>
                {t(a)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
