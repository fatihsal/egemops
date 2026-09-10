"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjeAnaliz } from "@/lib/queries/projeler";
import { useDil } from "@/components/providers/dil-provider";

const ETIKET_GENISLIK = 150; // px — sol proje adı sütunu

export function ProjeGantt() {
  const { data, isLoading } = useProjeAnaliz();
  const { t } = useDil();

  // Bugün çizgisinin sol konumu: etiket sütunu + zaman ekseninin bugün oranı.
  const bugunSol = (b: number) => `calc(${ETIKET_GENISLIK}px + (100% - ${ETIKET_GENISLIK}px) * ${b / 100})`;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Proje Takvimi (Gantt)")}</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {isLoading || !data ? (
          <Skeleton className="min-h-[260px] w-full flex-1" />
        ) : (
          <>
            <div className="flex flex-1 overflow-x-auto">
              <div className="flex min-w-[600px] flex-1 flex-col">
                {/* Ay başlıkları */}
                <div className="grid" style={{ gridTemplateColumns: `${ETIKET_GENISLIK}px 1fr` }}>
                  <div />
                  <div className="grid grid-cols-7 border-b">
                    {data.ganttEksen.map((m) => (
                      <div key={m} className="border-l px-1 py-1.5 text-center text-[11px] font-medium text-muted-foreground first:border-l-0">
                        {t(m)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Satırlar + bugün çizgisi */}
                <div className="relative flex flex-1 flex-col">
                  {data.gantt.map((g) => (
                    <div key={g.id} className="grid min-h-[52px] flex-1 items-center" style={{ gridTemplateColumns: `${ETIKET_GENISLIK}px 1fr` }}>
                      <div className="truncate pr-3 text-xs font-medium">{t(g.ad)}</div>
                      <div className="relative h-full">
                        {/* Ay ızgara çizgileri */}
                        <div className="absolute inset-0 grid grid-cols-7">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="border-l border-border/60 first:border-l-0" />
                          ))}
                        </div>
                        {/* Çubuk */}
                        <div
                          className="absolute top-1/2 h-4 -translate-y-1/2 rounded-full shadow-sm"
                          style={{ left: `${g.sol}%`, width: `${g.genislik}%`, background: g.renk }}
                        >
                          {g.gecikme ? (
                            <span
                              className="absolute top-0 right-0 h-full rounded-r-full"
                              style={{
                                width: `${g.gecikme}%`,
                                backgroundImage:
                                  "repeating-linear-gradient(45deg, rgba(255,255,255,0.55) 0, rgba(255,255,255,0.55) 3px, transparent 3px, transparent 7px)",
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Bugün — dikey kesikli çizgi */}
                  <div
                    className="pointer-events-none absolute inset-y-0 border-l border-dashed border-red-400"
                    style={{ left: bugunSol(data.ganttBugun) }}
                  />
                  <span
                    className="pointer-events-none absolute -bottom-5 -translate-x-1/2 text-[11px] font-medium text-red-500"
                    style={{ left: bugunSol(data.ganttBugun) }}
                  >
                    {t("Bugün")}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
