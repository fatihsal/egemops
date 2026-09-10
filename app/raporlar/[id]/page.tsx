"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DURUM_META, KATEGORI_META } from "@/components/raporlar/stiller";
import { RaporOnizlemeIcerik } from "@/components/raporlar/onizleme";
import { useRaporAnaliz } from "@/lib/queries/raporlar";
import { csvIndir } from "@/lib/disa-aktar";
import { cn } from "@/lib/utils";

export default function RaporOnizlemePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data, isLoading } = useRaporAnaliz();

  const rapor = data?.raporlar.find((r) => r.id === id);
  const sonRapor = data?.sonRaporlar.find((r) => r.id === id);
  const ad = rapor?.ad ?? sonRapor?.ad ?? "Rapor Önizleme";
  const kategori = rapor?.kategori ?? sonRapor?.kategori;

  return (
    <div className="space-y-6">
      {/* Başlık + aksiyonlar */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{isLoading ? "Yükleniyor…" : ad}</h1>
            {kategori ? (
              <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", KATEGORI_META[kategori].sinif)}>
                {KATEGORI_META[kategori].etiket}
              </span>
            ) : null}
            {rapor ? (
              <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", DURUM_META[rapor.durum].sinif)}>
                {DURUM_META[rapor.durum].etiket}
              </span>
            ) : null}
          </div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Icon icon="solar:calendar-linear" className="size-4" /> Dönem: 01.01.2026 – 26.08.2026</span>
            <span className="inline-flex items-center gap-1.5"><Icon icon="solar:user-linear" className="size-4" /> Uğur Melih</span>
            <span className="inline-flex items-center gap-1.5"><Icon icon="solar:refresh-linear" className="size-4" /> Son güncelleme 26.08.2026</span>
          </p>
        </div>

        <div data-noprint className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-9 gap-1.5 bg-card" nativeButton={false} render={<Link href="/raporlar" />}>
            <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
            Geri
          </Button>
          <Button variant="outline" className="h-9 gap-1.5 bg-card" onClick={() => window.print()}>
            <Icon icon="solar:printer-bold-duotone" className="size-4" />
            Yazdır
          </Button>
          <Button
            variant="outline"
            className="h-9 gap-1.5 bg-card"
            onClick={() => {
              csvIndir(`rapor-${id ?? "rapor"}`, ["Alan", "Değer"], [
                ["Rapor Adı", ad],
                ["Kategori", kategori ? KATEGORI_META[kategori].etiket : "-"],
                ["Format", rapor?.format ?? "-"],
                ["Sıklık", rapor?.siklik ?? "-"],
                ["Son Oluşturulma", rapor?.sonOlusturma ?? "-"],
              ]);
              toast.success(`${ad} Excel'e aktarıldı`);
            }}
          >
            <Icon icon="solar:file-bold-duotone" className="size-4 text-emerald-600" />
            Excel İndir
          </Button>
          <Button
            className="h-9 gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700"
            onClick={() => {
              toast("PDF için 'Hedef' olarak 'PDF olarak kaydet' seçin");
              window.print();
            }}
          >
            <Icon icon="solar:file-download-bold-duotone" className="size-4" />
            PDF İndir
          </Button>
        </div>
      </div>

      {/* İçerik */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-28 w-full" />
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
          <Skeleton className="h-[320px] w-full" />
        </div>
      ) : kategori ? (
        <RaporOnizlemeIcerik kategori={kategori} />
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-sm text-muted-foreground">Rapor bulunamadı. <Link href="/raporlar" className="font-medium text-primary">Rapor listesine dön</Link></p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
