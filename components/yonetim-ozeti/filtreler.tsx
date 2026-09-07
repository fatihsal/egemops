"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Icon } from "@iconify/react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VARSAYILAN: DateRange = { from: new Date(2026, 0, 1), to: new Date(2026, 7, 26) };
const YILLAR = ["2026", "2025", "2024"];
const TESISLER = ["Tüm Tesisler", "Fabrika 1", "Fabrika 2", "İdari Bina"];

export function OzetFiltreler() {
  const [aralik, setAralik] = React.useState<DateRange | undefined>(VARSAYILAN);
  const [acik, setAcik] = React.useState(false);
  const [yil, setYil] = React.useState("2026");
  const [tesis, setTesis] = React.useState("Tüm Tesisler");

  const etiket = aralik?.from && aralik?.to
    ? `${format(aralik.from, "dd.MM.yyyy")} – ${format(aralik.to, "dd.MM.yyyy")}`
    : "Tarih aralığı";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={acik} onOpenChange={setAcik}>
        <PopoverTrigger render={<Button variant="outline" className="h-9 gap-2 bg-card font-normal" />}>
          <CalendarDays className="size-4 text-muted-foreground" />
          <span className="tabular-nums">{etiket}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar mode="range" numberOfMonths={2} selected={aralik} onSelect={setAralik} locale={tr} autoFocus />
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2 rounded-lg border bg-card pl-3 shadow-sm">
        <span className="text-xs font-medium text-muted-foreground">Yıl</span>
        <Select value={yil} onValueChange={(v) => setYil(v as string)}>
          <SelectTrigger className="h-9 w-[84px] border-0 bg-transparent shadow-none"><SelectValue /></SelectTrigger>
          <SelectContent>{YILLAR.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <Select value={tesis} onValueChange={(v) => setTesis(v as string)}>
        <SelectTrigger className="h-9 w-[150px] bg-card"><SelectValue /></SelectTrigger>
        <SelectContent>{TESISLER.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
      </Select>

      <Button className="h-9 gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700" render={<Link href="/raporlar" />} nativeButton={false}>
        <Icon icon="solar:add-circle-bold-duotone" className="size-4.5" />
        Rapor Oluştur
      </Button>
    </div>
  );
}
