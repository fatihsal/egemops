import { Icon } from "@iconify/react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { KartMenu } from "@/components/common/kart-menu";
import { cn } from "@/lib/utils";
import { sayiOndalik } from "@/lib/format";

interface StatCardProps {
  baslik: string;
  /** Ön-biçimlenmiş değer (ör. "842,6" veya "%32"). */
  deger: string | number;
  /** Değerin yanındaki birim (ör. "TEP", "GWh"). */
  birim?: string;
  /** Bir önceki yıla göre değişim. Pozitif ▲ yeşil, negatif ▼ kırmızı. */
  degisimYuzde?: number;
  /** Değişim birimi: "%" (varsayılan) veya "puan". */
  degisimBirim?: string;
  /** Karşılaştırma etiketi, ör. "vs 2024". */
  karsilastirma?: string;
  /** Sol taraftaki alan simgesi (Iconify adı, ör. "solar:bolt-bold-duotone"). */
  ikon?: string;
  /** Simge kutusunun renk sınıfı (arka plan + metin). */
  ikonSinif?: string;
  /** ⋮ menüdeki "Detayı gör" bağlantısı. */
  detayHref?: string;
}

export function StatCard({
  baslik,
  deger,
  birim,
  degisimYuzde,
  degisimBirim = "%",
  karsilastirma,
  ikon,
  ikonSinif,
  detayHref,
}: StatCardProps) {
  const arti = (degisimYuzde ?? 0) >= 0;
  // Görseldeki gibi yön bazlı renk: yukarı yeşil, aşağı kırmızı.
  const degisimMetni =
    degisimYuzde === undefined
      ? ""
      : degisimBirim === "puan"
        ? `${sayiOndalik(Math.abs(degisimYuzde))} puan`
        : `%${sayiOndalik(Math.abs(degisimYuzde))}`;

  return (
    <Card size="sm" className="relative">
      <CardContent className="flex items-center gap-2.5 pr-5">
        {ikon ? (
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground",
              ikonSinif,
            )}
          >
            <Icon icon={ikon} className="size-6" />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs text-muted-foreground">{baslik}</div>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1">
            <span className="text-xl font-bold tracking-tight">{deger}</span>
            {birim ? (
              <span className="text-xs text-muted-foreground">{birim}</span>
            ) : null}
          </div>
          {degisimYuzde !== undefined ? (
            <div className="mt-1 flex flex-wrap items-center gap-x-1 text-xs">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-medium",
                  arti
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                <span className="text-[9px] leading-none">
                  {arti ? "▲" : "▼"}
                </span>
                {degisimMetni}
              </span>
              {karsilastirma ? (
                <span className="text-muted-foreground">{karsilastirma}</span>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Köşe menüsü (görseldeki ⋮) */}
        <KartMenu baslik={baslik} detayHref={detayHref} />
      </CardContent>
    </Card>
  );
}

/** Yüklenirken gösterilecek iskelet kart. */
export function StatCardSkeleton() {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-3">
        <Skeleton className="size-11 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
