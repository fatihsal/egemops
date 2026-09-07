import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

/** Ortalanmış dönen yükleniyor göstergesi. */
export function LoadingState({ mesaj = "Yükleniyor…" }: { mesaj?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
      <Loader2 className="size-4 animate-spin" />
      {mesaj}
    </div>
  );
}

/** Tablo/liste için satır iskeletleri. */
export function TableSkeleton({ satir = 5 }: { satir?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: satir }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
