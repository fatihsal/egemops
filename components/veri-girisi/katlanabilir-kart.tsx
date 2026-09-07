"use client";

import * as React from "react";
import { ChevronUp } from "lucide-react";
import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Başlığa tıklanınca içeriği açıp kapatan kart (veri girişi kartları için). */
export function KatlanabilirKart({
  baslik,
  ikon,
  ikonSinif,
  children,
}: {
  baslik: string;
  ikon: string;
  ikonSinif: string;
  children: React.ReactNode;
}) {
  const [acik, setAcik] = React.useState(true);

  return (
    <Card>
      <CardContent className="@container space-y-5">
        <button
          type="button"
          onClick={() => setAcik((a) => !a)}
          aria-expanded={acik}
          className="flex w-full items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-lg",
                ikonSinif,
              )}
            >
              <Icon icon={ikon} className="size-5" />
            </span>
            <h3 className="font-heading text-base font-semibold">{baslik}</h3>
          </div>
          <ChevronUp
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              !acik && "rotate-180",
            )}
          />
        </button>

        {acik ? children : null}
      </CardContent>
    </Card>
  );
}
