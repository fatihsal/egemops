import type { ReactNode } from "react";

interface PageHeaderProps {
  baslik: string;
  aciklama?: string;
  /** Sağ tarafa eylem düğmeleri vb. yerleştirmek için. */
  eylem?: ReactNode;
}

/** Her sayfanın üstünde tutarlı başlık bloğu. */
export function PageHeader({ baslik, aciklama, eylem }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{baslik}</h1>
        {aciklama ? (
          <p className="text-sm text-muted-foreground">{aciklama}</p>
        ) : null}
      </div>
      {eylem ? <div className="flex items-center gap-2">{eylem}</div> : null}
    </div>
  );
}
