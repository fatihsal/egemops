"use client";

import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTepAnaliz } from "@/lib/queries/tep";
import { useDil } from "@/components/providers/dil-provider";
import { sayiOndalik } from "@/lib/format";
import type { TepWaterfall } from "@/lib/types";

const RENK = { baz: "#14b8a6", sonuc: "#0d9488", azalis: "#ef4444", artis: "#22c55e" };

interface Adim {
  etiket: string;
  base: number;
  gorunen: number;
  renk: string;
  etiketDeger: string;
}

function adimlariUret(veri: TepWaterfall[]): Adim[] {
  let running = 0;
  return veri.map((w) => {
    if (w.tur === "baz" || w.tur === "sonuc") {
      if (w.tur === "baz") running = w.deger;
      return { etiket: w.etiket, base: 0, gorunen: w.deger, renk: RENK[w.tur], etiketDeger: sayiOndalik(w.deger) };
    }
    const before = running;
    const after = Math.round((running + w.deger) * 100) / 100;
    running = after;
    return {
      etiket: w.etiket,
      base: Math.min(before, after),
      gorunen: Math.abs(w.deger),
      renk: w.deger >= 0 ? RENK.artis : RENK.azalis,
      etiketDeger: `${w.deger >= 0 ? "+" : "−"}${sayiOndalik(Math.abs(w.deger))}`,
    };
  });
}

export function TepDegisimWaterfall() {
  const { data, isLoading } = useTepAnaliz();
  const { t } = useDil();
  const adimlar = data ? adimlariUret(data.waterfall) : [];

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">
          {t("TEP Değişim Analizi")} <span className="text-sm font-normal text-muted-foreground">(YTD)</span>
        </h3>
      </CardHeader>
      <CardContent className="flex-1">
        {isLoading || !data ? (
          <Skeleton className="h-[240px] w-full" />
        ) : (
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adimlar} margin={{ left: 0, right: 8, top: 24, bottom: 0 }}>
                <XAxis dataKey="etiket" tickLine={false} axisLine={false} fontSize={11} interval={0} stroke="var(--muted-foreground)" />
                <YAxis hide domain={[0, "dataMax + 40"]} />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "0.5rem", fontSize: "12px", color: "var(--popover-foreground)" }}
                  formatter={(_v, name, item) =>
                    name === "base" ? ["", ""] : [`${item?.payload?.etiketDeger} TEP`, t("Değişim")]
                  }
                />
                <Bar dataKey="base" stackId="w" fill="transparent" />
                <Bar dataKey="gorunen" stackId="w" radius={[3, 3, 0, 0]} maxBarSize={48} isAnimationActive={false}>
                  {adimlar.map((a, i) => (
                    <Cell key={i} fill={a.renk} />
                  ))}
                  <LabelList
                    dataKey="gorunen"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content={(p: any) => {
                      const cx = Number(p.x ?? 0) + Number(p.width ?? 0) / 2;
                      const lbl = adimlar[p.index ?? 0]?.etiketDeger ?? "";
                      return (
                        <text x={cx} y={Number(p.y ?? 0) - 8} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
                          {lbl}
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
