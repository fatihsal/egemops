import { Badge } from "@/components/ui/badge";
import { DURUM_TANIMLARI } from "@/lib/durum";
import { cn } from "@/lib/utils";
import type { DurumKodu } from "@/lib/types";

interface StatusBadgeProps {
  durum: DurumKodu;
  className?: string;
}

/** Durum koduna göre renkli, Türkçe etiketli rozet. */
export function StatusBadge({ durum, className }: StatusBadgeProps) {
  const tanim = DURUM_TANIMLARI[durum];
  return (
    <Badge className={cn(tanim.sinif, className)}>
      <span
        className="size-1.5 rounded-full bg-current opacity-70"
        aria-hidden
      />
      {tanim.etiket}
    </Badge>
  );
}
