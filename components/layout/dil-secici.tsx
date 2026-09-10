"use client";

import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import type { Dil } from "@/lib/i18n/sozluk";

const DILLER: Dil[] = ["tr", "en"];

/** TR / EN segmentli dil seçici. `ton="acik"` giriş sayfası gibi açık zeminler için. */
export function DilSecici({
  ton = "auto",
  className,
}: {
  ton?: "auto" | "acik";
  className?: string;
}) {
  const { dil, setDil } = useDil();
  const acik = ton === "acik";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border p-0.5 text-[11px] font-semibold shadow-sm",
        acik ? "border-slate-200 bg-white" : "border-border bg-card",
        className,
      )}
    >
      {DILLER.map((d) => {
        const seciliMi = dil === d;
        return (
          <button
            key={d}
            type="button"
            onClick={() => setDil(d)}
            aria-pressed={seciliMi}
            className={cn(
              "rounded-md px-2 py-1 uppercase transition-colors",
              seciliMi
                ? acik
                  ? "bg-teal-600 text-white"
                  : "bg-primary text-primary-foreground"
                : acik
                  ? "text-slate-500 hover:text-slate-800"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            {d}
          </button>
        );
      })}
    </div>
  );
}
