"use client";

import * as React from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Icon } from "@iconify/react";
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
const KAYNAKLAR = ["Tümü", "Elektrik", "Doğalgaz", "Akaryakıt"];
const DURUMLAR = ["Tüm Durumlar", "Fizibilite", "Teklif / Planlama", "Onaylandı", "Uygulama", "Tamamlandı"];

export function FirsatFiltreler() {
  const { t, dil } = useDil();
  const [aralik, setAralik] = React.useState<DateRange | undefined>(VARSAYILAN);
  const [acik, setAcik] = React.useState(false);
  const [kaynak, setKaynak] = React.useState("Tümü");
  const [durum, setDurum] = React.useState("Tüm Durumlar");

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

      <Select value={kaynak} onValueChange={(v) => setKaynak(v as string)}>
        <SelectTrigger className="h-9 w-[120px] bg-card"><SelectValue /></SelectTrigger>
        <SelectContent>{KAYNAKLAR.map((k) => <SelectItem key={k} value={k}>{t(k)}</SelectItem>)}</SelectContent>
      </Select>

      <Select value={durum} onValueChange={(v) => setDurum(v as string)}>
        <SelectTrigger className="h-9 w-[150px] bg-card"><SelectValue /></SelectTrigger>
        <SelectContent>{DURUMLAR.map((d) => <SelectItem key={d} value={d}>{t(d)}</SelectItem>)}</SelectContent>
      </Select>

      <Button className="h-9 gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700" onClick={() => toast.success(t("Yeni fırsat formu açılıyor"))}>
        <Icon icon="solar:add-circle-bold-duotone" className="size-4.5" />
        {t("Yeni Fırsat Ekle")}
      </Button>
    </div>
  );
}
