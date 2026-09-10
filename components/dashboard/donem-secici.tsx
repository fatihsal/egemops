"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDonem } from "@/components/providers/donem-provider";
import { useDil } from "@/components/providers/dil-provider";
import {
  donemOlustur,
  ozelDonem,
  type DonemTuru,
} from "@/lib/donem";

const HAZIR: { tur: Exclude<DonemTuru, "ozel">; etiket: string }[] = [
  { tur: "gun", etiket: "Gün" },
  { tur: "hafta", etiket: "Hafta" },
  { tur: "ay", etiket: "Ay" },
];

export function DonemSecici() {
  const { donem, setDonem } = useDonem();
  const { t } = useDil();
  const [acik, setAcik] = React.useState(false);
  const [aralik, setAralik] = React.useState<DateRange | undefined>();

  function ozelUygula(secim: DateRange | undefined) {
    setAralik(secim);
    if (secim?.from && secim?.to) {
      setDonem(ozelDonem(secim.from, secim.to));
      setAcik(false);
    }
  }

  const ozelEtiket =
    donem.tur === "ozel"
      ? `${format(new Date(donem.baslangic), "d MMM", { locale: tr })} – ${format(
          new Date(donem.bitis),
          "d MMM",
          { locale: tr },
        )}`
      : t("Özel");

  return (
    <div className="flex items-center gap-1 rounded-lg border p-0.5">
      {HAZIR.map((h) => (
        <button
          key={h.tur}
          type="button"
          onClick={() => setDonem(donemOlustur(h.tur))}
          className={cn(
            "rounded-md px-3 py-1 text-sm font-medium transition-colors",
            donem.tur === h.tur
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {t(h.etiket)}
        </button>
      ))}

      <Popover open={acik} onOpenChange={setAcik}>
        <PopoverTrigger
          render={
            <Button
              variant={donem.tur === "ozel" ? "default" : "ghost"}
              size="sm"
              className="gap-1.5"
            />
          }
        >
          <CalendarDays className="size-3.5" />
          {ozelEtiket}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={aralik}
            onSelect={ozelUygula}
            locale={tr}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
