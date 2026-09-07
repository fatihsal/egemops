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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TURLER = ["Tüketim Raporu", "Performans Raporu", "Maliyet Raporu", "TEP Raporu", "Karşılaştırma Raporu", "Özel Rapor"];
const FORMATLAR = ["PDF", "Excel"];
const VARSAYILAN: DateRange = { from: new Date(2026, 0, 1), to: new Date(2026, 7, 26) };

export function RaporOlusturForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [tur, setTur] = React.useState("");
  const [ad, setAd] = React.useState("");
  const [format2, setFormat2] = React.useState("PDF");
  const [aralik, setAralik] = React.useState<DateRange | undefined>(VARSAYILAN);
  const [acik, setAcik] = React.useState(false);

  const donemEtiket = aralik?.from && aralik?.to
    ? `${format(aralik.from, "dd.MM.yyyy")} – ${format(aralik.to, "dd.MM.yyyy")}`
    : "Dönem seçiniz";

  const olustur = () => {
    if (!tur) {
      toast.error("Rapor türü seçiniz");
      return;
    }
    toast.success(`${ad.trim() || tur} oluşturuluyor (${format2})`);
    onSubmitted?.();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Rapor Türü</Label>
        <Select value={tur} onValueChange={(v) => setTur(v as string)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Seçiniz" /></SelectTrigger>
          <SelectContent>{TURLER.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="rapor-adi" className="text-xs text-muted-foreground">Rapor Adı</Label>
        <Input id="rapor-adi" value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Rapor adı giriniz" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Dönem</Label>
        <Popover open={acik} onOpenChange={setAcik}>
          <PopoverTrigger render={<Button variant="outline" className="h-9 w-full justify-start gap-2 bg-card font-normal" />}>
            <CalendarDays className="size-4 text-muted-foreground" />
            <span className="flex-1 text-left tabular-nums">{donemEtiket}</span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="range" numberOfMonths={2} selected={aralik} onSelect={setAralik} locale={tr} autoFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Format</Label>
        <Select value={format2} onValueChange={(v) => setFormat2(v as string)}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>{FORMATLAR.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <Button className="w-full gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700" onClick={olustur}>
        <Icon icon="solar:document-add-bold-duotone" className="size-4.5" />
        Rapor Oluştur
      </Button>
    </div>
  );
}
