"use client";

import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DonemBar() {
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Icon icon="solar:calendar-bold-duotone" className="size-5 text-primary" />
          <span className="text-muted-foreground">Dönem:</span>
          <span className="font-semibold">2026 / Ağustos</span>
        </div>

        <div className="hidden h-5 w-px bg-border sm:block" />

        <div className="flex items-center gap-2 text-sm">
          <Icon icon="solar:document-text-bold-duotone" className="size-5 text-amber-500" />
          <span className="text-muted-foreground">Kayıt Durumu:</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            Taslak
          </span>
        </div>

        <div className="hidden h-5 w-px bg-border sm:block" />

        <div className="flex items-center gap-2 text-sm">
          <Icon icon="solar:clock-circle-bold-duotone" className="size-5 text-primary" />
          <span className="text-muted-foreground">Son Güncelleme:</span>
          <span className="font-semibold tabular-nums">26.08.2026 15:20</span>
        </div>

        <Button
          className="ml-auto gap-1.5 bg-teal-600 text-white hover:bg-teal-700"
          onClick={() => toast("Enerji verisi görünümü", { description: "Dönem verileri yenilendi." })}
        >
          <Icon icon="solar:database-bold-duotone" className="size-4" />
          Enerji Verisi
        </Button>
      </CardContent>
    </Card>
  );
}
