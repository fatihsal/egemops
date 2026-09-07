"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkline } from "@/components/common/sparkline";
import { useTepAnaliz } from "@/lib/queries/tep";

export function TepUcNoktaKarti({ tur }: { tur: "yuksek" | "dusuk" }) {
  const { data, isLoading } = useTepAnaliz();

  const baslik = tur === "yuksek" ? "En Yüksek TEP Tüketimi" : "En Düşük TEP Tüketimi";
  const renk = tur === "yuksek" ? "#059669" : "#2563eb";

  if (isLoading || !data) {
    return (
      <Card className="h-full">
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    );
  }

  const nokta = tur === "yuksek" ? data.enYuksek : data.enDusuk;

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{baslik}</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-1.5">
        <div className="text-xs text-muted-foreground">{nokta.donem}</div>
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-2xl font-bold tracking-tight tabular-nums">{nokta.deger}</span>
          <span className="text-sm text-muted-foreground">TEP</span>
        </div>
        <Sparkline data={nokta.trend} renk={renk} className="mt-auto h-9 w-full" />
      </CardContent>
    </Card>
  );
}
