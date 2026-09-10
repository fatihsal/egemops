"use client";

import * as React from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { tr, enUS } from "date-fns/locale";
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
import { useDil } from "@/components/providers/dil-provider";

const VARSAYILAN: DateRange = { from: new Date(2026, 0, 1), to: new Date(2026, 7, 26) };
const YILLAR = ["2024", "2025", "2026"];
const BAZ_YILLAR = ["2022", "2023", "2024"];
const ENPI = [
  "Toplam Enerji TEP/ton",
  "Elektrik kWh/ton",
  "Doğalgaz Sm³/ton",
  "Elektrik TEP/ton",
  "Doğalgaz TEP/ton",
];

function EtiketliSecim({ etiket, deger, secenekler, etiketler, onChange, w = "w-[130px]" }: { etiket: string; deger: string; secenekler: string[]; etiketler?: string[]; onChange: (v: string) => void; w?: string }) {
  return (
    <div className="flex h-9 items-center gap-2 rounded-lg border bg-card px-3">
      <span className="whitespace-nowrap text-sm text-muted-foreground">{etiket}</span>
      <Select value={deger} onValueChange={(v) => onChange(v as string)}>
        <SelectTrigger size="sm" className={`${w} border-0 bg-transparent px-1 shadow-none focus-visible:ring-0`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {secenekler.map((s, i) => (
            <SelectItem key={s} value={s}>{etiketler?.[i] ?? s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Enerji Performansı üst filtreleri — tarih aralığı, yıl, baz yıl, EnPI (mock). */
export function PerformansFiltreler() {
  const { t, dil } = useDil();
  const [aralik, setAralik] = React.useState<DateRange | undefined>(VARSAYILAN);
  const [acik, setAcik] = React.useState(false);
  const [yil, setYil] = React.useState("2026");
  const [bazYil, setBazYil] = React.useState("2024");
  const [enpi, setEnpi] = React.useState(ENPI[0]);

  const etiket = aralik?.from && aralik?.to
    ? `${format(aralik.from, "dd.MM.yyyy")} – ${format(aralik.to, "dd.MM.yyyy")}`
    : t("Tarih aralığı");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={acik} onOpenChange={setAcik}>
        <PopoverTrigger render={<Button variant="outline" className="h-9 gap-2 bg-card font-normal" />}>
          <CalendarDays className="size-4 text-muted-foreground" />
          <span className="tabular-nums">{etiket}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar mode="range" numberOfMonths={2} selected={aralik} onSelect={setAralik} locale={dil === "en" ? enUS : tr} autoFocus />
        </PopoverContent>
      </Popover>

      <EtiketliSecim
        etiket={t("Yıl:")}
        deger={yil}
        secenekler={YILLAR}
        onChange={(v) => {
          setYil(v);
          toast.success(`${v} ${t("yılı verileri yüklendi")}`);
        }}
        w="w-[76px]"
      />
      <EtiketliSecim
        etiket={t("Baz Yıl:")}
        deger={bazYil}
        secenekler={BAZ_YILLAR}
        onChange={(v) => {
          setBazYil(v);
          toast(`${t("Baz yıl")} ${v} ${t("olarak ayarlandı")}`);
        }}
        w="w-[76px]"
      />
      <EtiketliSecim
        etiket={t("EnPI:")}
        deger={enpi}
        etiketler={ENPI.map((e) => t(e))}
        secenekler={ENPI}
        onChange={(v) => {
          setEnpi(v);
          toast(`${t("Gösterge")}: ${t(v)}`);
        }}
        w="w-[168px]"
      />
    </div>
  );
}
