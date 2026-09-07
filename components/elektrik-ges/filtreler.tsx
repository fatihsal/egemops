"use client";

import * as React from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Icon } from "@iconify/react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VARSAYILAN: DateRange = {
  from: new Date(2026, 0, 1),
  to: new Date(2026, 6, 31),
};
const YILLAR = ["2024", "2025", "2026"];

/** Analiz ekranının üst filtre alanı — tarih aralığı, yıl ve Excel dışa aktar.
 *  Tasarım aşaması: filtreleme mantığı gerçek değildir (mock). */
export function ElektrikFiltreler() {
  const [aralik, setAralik] = React.useState<DateRange | undefined>(VARSAYILAN);
  const [acik, setAcik] = React.useState(false);
  const [yil, setYil] = React.useState("2026");

  const etiket =
    aralik?.from && aralik?.to
      ? `${format(aralik.from, "dd.MM.yyyy")} – ${format(aralik.to, "dd.MM.yyyy")}`
      : "Tarih aralığı seçin";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={acik} onOpenChange={setAcik}>
        <PopoverTrigger
          render={
            <Button variant="outline" className="h-9 gap-2 bg-card font-normal" />
          }
        >
          <CalendarDays className="size-4 text-muted-foreground" />
          <span className="tabular-nums">{etiket}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={aralik}
            onSelect={setAralik}
            locale={tr}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2 rounded-lg border bg-card px-3 h-9">
        <span className="text-sm text-muted-foreground">Yıl</span>
        <Select value={yil} onValueChange={(v) => setYil(v as string)}>
          <SelectTrigger size="sm" className="w-[84px] border-0 bg-transparent px-1 shadow-none focus-visible:ring-0">
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

      <Button
        variant="outline"
        className="h-9 gap-1.5 bg-card"
        onClick={() => toast.success("Rapor Excel'e aktarıldı")}
      >
        <Icon icon="vscode-icons:file-type-excel" className="size-4" />
        Excel&apos;e Aktar
      </Button>
    </div>
  );
}
