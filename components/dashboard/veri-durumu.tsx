"use client";

import { useIsFetching } from "@tanstack/react-query";
import { format } from "date-fns";
import { tr, enUS } from "date-fns/locale";

import { BUGUN } from "@/lib/donem";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

/** Veri durumu göstergesi — sorgular çalışırken "Güncelleniyor", aksi halde "Güncel". */
export function VeriDurumu() {
  const fetching = useIsFetching();
  const { t, dil } = useDil();
  const yukleniyor = fetching > 0;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-transparent px-2 py-0.5 font-medium",
          yukleniyor
            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            yukleniyor
              ? "animate-pulse bg-amber-500"
              : "bg-emerald-500",
          )}
          aria-hidden
        />
        {yukleniyor ? t("Güncelleniyor…") : t("Veri güncel")}
      </span>
      <span className="hidden sm:inline">
        {t("Son güncelleme")}: {format(BUGUN, "d MMM yyyy", { locale: dil === "en" ? enUS : tr })}
      </span>
    </div>
  );
}
