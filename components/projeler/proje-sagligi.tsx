"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RAG_META } from "@/components/projeler/stiller";
import { useProjeAnaliz } from "@/lib/queries/projeler";
import type { ProjeRag } from "@/lib/types";

function Rag({ durum }: { durum: ProjeRag }) {
  if (durum === "yok") {
    return <span className="text-muted-foreground/50">—</span>;
  }
  return <span className={`inline-block size-2.5 rounded-full ${RAG_META[durum].nokta}`} />;
}

const LEGEND: { durum: ProjeRag }[] = [{ durum: "yesil" }, { durum: "amber" }, { durum: "kirmizi" }, { durum: "yok" }];

export function ProjeSagligi() {
  const { data, isLoading } = useProjeAnaliz();

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">Proje Sağlığı</h3>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {isLoading || !data ? (
          <Skeleton className="h-[220px] w-full" />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Proje</th>
                  <th className="pb-2 text-center font-medium">Zaman</th>
                  <th className="pb-2 text-center font-medium">Bütçe</th>
                  <th className="pb-2 text-center font-medium">Tasarruf</th>
                </tr>
              </thead>
              <tbody>
                {data.projeler.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="max-w-0 truncate py-2.5 pr-2 font-medium">{p.ad}</td>
                    <td className="py-2.5 text-center"><Rag durum={p.saglik.zaman} /></td>
                    <td className="py-2.5 text-center"><Rag durum={p.saglik.butce} /></td>
                    <td className="py-2.5 text-center"><Rag durum={p.saglik.tasarruf} /></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-3 text-[11px] text-muted-foreground">
              {LEGEND.map(({ durum }) => (
                <span key={durum} className="inline-flex items-center gap-1.5">
                  <Rag durum={durum} />
                  {RAG_META[durum].etiket}
                </span>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
