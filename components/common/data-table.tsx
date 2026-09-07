import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/empty-state";
import { TableSkeleton } from "@/components/common/loading-state";
import { cn } from "@/lib/utils";

export interface DataTableKolon<T> {
  anahtar: string;
  baslik: string;
  /** Hücre içeriğini üretir. Verilmezse satırdan anahtara göre okunur. */
  hucre?: (satir: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  kolonlar: DataTableKolon<T>[];
  veri: T[] | undefined;
  satirAnahtari: (satir: T) => string;
  yukleniyor?: boolean;
  bosMesaj?: string;
}

/**
 * Projedeki tüm tablolar için ortak bileşen.
 * Yükleniyor ve boş durumları da kendi içinde yönetir; her sayfada
 * sıfırdan tablo kurulmaz.
 */
export function DataTable<T>({
  kolonlar,
  veri,
  satirAnahtari,
  yukleniyor,
  bosMesaj = "Kayıt bulunamadı.",
}: DataTableProps<T>) {
  if (yukleniyor) {
    return <TableSkeleton />;
  }

  if (!veri || veri.length === 0) {
    return <EmptyState baslik="Veri yok" aciklama={bosMesaj} />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            {kolonlar.map((k) => (
              <TableHead key={k.anahtar} className={k.className}>
                {k.baslik}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {veri.map((satir) => (
            <TableRow key={satirAnahtari(satir)}>
              {kolonlar.map((k) => (
                <TableCell key={k.anahtar} className={cn(k.className)}>
                  {k.hucre
                    ? k.hucre(satir)
                    : String((satir as Record<string, unknown>)[k.anahtar] ?? "")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
