"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useYonetimOzeti } from "@/lib/queries/yonetim-ozeti";

export function OzetSonRaporlar() {
  const { data, isLoading } = useYonetimOzeti();

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <h3 className="font-heading text-base font-medium">Son Raporlar</h3>
        <Link href="/raporlar" className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-80">
          Tümünü Gör <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : (
          <ul className="divide-y">
            {data.raporlar.map((r) => {
              const pdf = r.format.includes("PDF");
              return (
                <li key={r.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <Link href={`/raporlar/${r.id}`} className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium hover:text-primary">{r.ad}</p>
                    <p className="text-xs tabular-nums text-muted-foreground">{r.tarih}</p>
                  </Link>
                  <span className={pdf ? "text-red-500" : "text-emerald-600"} title={r.format}>
                    <Icon icon={pdf ? "solar:file-text-bold-duotone" : "solar:file-bold-duotone"} className="size-5" />
                  </span>
                  <button
                    type="button"
                    onClick={() => toast.success(`${r.ad} indiriliyor`)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="İndir"
                  >
                    <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
