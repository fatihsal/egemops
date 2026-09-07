"use client";

import { Icon } from "@iconify/react";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KayitDurumBadge, VeriKaliteNokta } from "@/components/enerji-kayitlari/durum";
import { sayi, sayi2 } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { EnerjiKayit } from "@/lib/types";

interface Props {
  kayitlar: EnerjiKayit[];
  seciliId: string | null;
  onSec: (id: string) => void;
}

function Baslik({ ana, birim }: { ana: string; birim?: string }) {
  return (
    <div className="flex items-baseline gap-1 whitespace-nowrap">
      {ana}
      {birim ? (
        <span className="text-[11px] font-normal text-muted-foreground">
          ({birim})
        </span>
      ) : null}
    </div>
  );
}

export function KayitTablosu({ kayitlar, seciliId, onSec }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead><Baslik ana="Dönem" /></TableHead>
            <TableHead className="text-right"><Baslik ana="Elektrik" birim="kWh" /></TableHead>
            <TableHead className="text-right"><Baslik ana="GES Üretimi" birim="kWh" /></TableHead>
            <TableHead className="text-right"><Baslik ana="Doğalgaz" birim="Sm³" /></TableHead>
            <TableHead className="text-right"><Baslik ana="Akaryakıt" birim="Litre" /></TableHead>
            <TableHead className="text-right"><Baslik ana="Toplam TEP" /></TableHead>
            <TableHead>Durum</TableHead>
            <TableHead className="text-center">Veri Kalitesi</TableHead>
            <TableHead className="text-right">İşlem</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kayitlar.map((k) => {
            const secili = seciliId === k.id;
            return (
              <TableRow
                key={k.id}
                onClick={() => onSec(k.id)}
                className={cn(
                  "cursor-pointer",
                  secili && "bg-primary/5 hover:bg-primary/5",
                )}
              >
                <TableCell>
                  <div className="flex items-center gap-2 font-medium whitespace-nowrap">
                    <Icon
                      icon="solar:calendar-bold-duotone"
                      className={cn(
                        "size-4.5",
                        secili ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    {k.donem}
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums">{sayi2(k.elektrik)}</TableCell>
                <TableCell className="text-right tabular-nums">{sayi2(k.gesUretim)}</TableCell>
                <TableCell className="text-right tabular-nums">{sayi2(k.dogalgaz)}</TableCell>
                <TableCell className="text-right tabular-nums">{sayi(k.akaryakit)}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {sayi2(k.toplamTep)}
                </TableCell>
                <TableCell><KayitDurumBadge durum={k.durum} /></TableCell>
                <TableCell className="text-center">
                  <VeriKaliteNokta kalite={k.veriKalitesi} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Görüntüle"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSec(k.id);
                      }}
                    >
                      <Icon icon="solar:eye-bold-duotone" className="size-4 text-muted-foreground" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Daha fazla"
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                      >
                        <MoreVertical className="size-4 text-muted-foreground" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onSec(k.id)}>
                          <Icon icon="solar:eye-bold-duotone" className="size-4" />
                          Görüntüle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success(`${k.donem} dışa aktarıldı`)}>
                          <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4" />
                          Dışa aktar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast(`${k.donem} arşivlendi`)}>
                          <Icon icon="solar:archive-bold-duotone" className="size-4" />
                          Arşivle
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
