"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BosDurum } from "@/components/common/bos-durum";
import { useDil } from "@/components/providers/dil-provider";

/** Faz 0 iskeleti — henüz geliştirilmemiş ekranlar için dürüst yer tutucu. */
export function Yakinda({ ikon, baslik, aciklama }: { ikon: string; baslik: string; aciklama: string }) {
  const { t } = useDil();
  return (
    <Card>
      <CardContent className="p-0">
        <BosDurum ikon={ikon} baslik={t(baslik)} aciklama={t(aciklama)} />
      </CardContent>
    </Card>
  );
}
