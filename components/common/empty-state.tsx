import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  baslik: string;
  aciklama?: string;
  ikon?: LucideIcon;
  eylem?: ReactNode;
}

/** Veri olmadığında gösterilecek tutarlı boş durum bloğu. */
export function EmptyState({
  baslik,
  aciklama,
  ikon: Ikon = Inbox,
  eylem,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Ikon className="size-5" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{baslik}</p>
        {aciklama ? (
          <p className="text-sm text-muted-foreground">{aciklama}</p>
        ) : null}
      </div>
      {eylem}
    </div>
  );
}
