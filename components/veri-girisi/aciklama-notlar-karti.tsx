"use client";

import * as React from "react";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useDil } from "@/components/providers/dil-provider";

const VARSAYILAN =
  "GES üretimi planlanan seviyede gerçekleşmiştir. Kompresör dairesindeki yük artışı nedeniyle elektrik tüketimi geçen aya göre yükselmiştir.";
const LIMIT = 1000;

export function AciklamaNotlarKarti() {
  const { t } = useDil();
  const [metin, setMetin] = React.useState(() => t(VARSAYILAN));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon icon="solar:chat-square-like-bold-duotone" className="size-5 text-primary" />
          {t("Açıklama / Notlar")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={metin}
          onChange={(e) => setMetin(e.target.value.slice(0, LIMIT))}
          rows={4}
          className="resize-none"
        />
        <div className="mt-2 text-right text-xs text-muted-foreground tabular-nums">
          {metin.length} / {LIMIT}
        </div>
      </CardContent>
    </Card>
  );
}
