"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTepAnaliz } from "@/lib/queries/tep";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

export function TepYtdKarti() {
  const { data, isLoading } = useTepAnaliz();

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
    );
  }

  const o = data.ytd;
  const arti = o.degisim >= 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Yılbaşından Bu Yana (YTD)</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground">2025 YTD</p>
            <p className="mt-0.5 font-heading text-lg font-bold tracking-tight tabular-nums">{o.yil2025}</p>
            <p className="text-[11px] text-muted-foreground">TEP</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">2026 YTD</p>
            <p className="mt-0.5 font-heading text-lg font-bold tracking-tight tabular-nums">{o.yil2026}</p>
            <p className="text-[11px] text-muted-foreground">TEP</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Fark</p>
            <p className={cn("mt-0.5 font-heading text-lg font-bold tracking-tight tabular-nums", arti ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
              {o.fark}
            </p>
            <p className="text-[11px] text-muted-foreground">TEP</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t pt-3 text-sm">
          <span className="text-muted-foreground">Değişim</span>
          <span className={cn("inline-flex items-center gap-0.5 font-semibold", arti ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
            <span className="text-[10px] leading-none">{arti ? "▲" : "▼"}</span>
            %{sayiOndalik(Math.abs(o.degisim))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
