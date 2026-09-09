"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Icon } from "@iconify/react";

import { Skeleton } from "@/components/ui/skeleton";
import { DetayKpi } from "@/components/kayit-detay/detay-kpi";
import { ElektrikGesDetay } from "@/components/kayit-detay/elektrik-ges-detay";
import { DogalgazDetay } from "@/components/kayit-detay/dogalgaz-detay";
import { AkaryakitDetay } from "@/components/kayit-detay/akaryakit-detay";
import { UretimDetay } from "@/components/kayit-detay/uretim-detay";
import { OncekiAyTablo } from "@/components/kayit-detay/onceki-ay-tablo";
import {
  NotlarKarti,
  GecmisKarti,
  BelgelerKarti,
} from "@/components/kayit-detay/ek-kartlar";
import { AksiyonBar } from "@/components/kayit-detay/aksiyon-bar";
import { useKayit } from "@/lib/queries/kayitlar";
import type { KayitDurum } from "@/lib/types";

const DURUM_ETIKET: Record<KayitDurum, string> = {
  onaylandi: "Onaylandı",
  kontrol: "Kontrol Bekliyor",
  taslak: "Taslak",
};

function BilgiBadge({
  ikon,
  etiket,
  deger,
  vurgu,
}: {
  ikon: string;
  etiket: string;
  deger: string;
  vurgu?: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm">
      <Icon
        icon={ikon}
        className={vurgu ? "size-4.5 text-emerald-500" : "size-4.5 text-muted-foreground"}
      />
      <span className="text-muted-foreground">{etiket}:</span>
      <span className={vurgu ? "font-semibold text-emerald-600 dark:text-emerald-400" : "font-semibold"}>
        {deger}
      </span>
    </div>
  );
}

export function KayitDetayIcerik({ id }: { id: string }) {
  const { data: kayit, isLoading } = useKayit(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!kayit) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
        <Icon icon="solar:danger-triangle-bold-duotone" className="size-10 text-amber-500" />
        <p className="font-medium">Kayıt bulunamadı</p>
        <Link href="/enerji-kayitlari" className="text-sm text-primary hover:underline">
          Enerji Kayıtları&apos;na dön
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>Enerji Yönetimi</span>
        <ChevronRight className="size-3.5" />
        <Link href="/enerji-kayitlari" className="hover:text-foreground">
          Enerji Kayıtları
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-medium text-foreground">{kayit.donem}</span>
      </nav>

      {/* Başlık */}
      <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
        {kayit.donem} Enerji Kaydı
        <Icon icon="solar:info-circle-bold-duotone" className="size-5 text-muted-foreground" />
      </h1>

      {/* Bilgi badge'leri */}
      <div className="flex flex-wrap gap-2">
        <BilgiBadge
          ikon="solar:check-circle-bold-duotone"
          etiket="Durum"
          deger={DURUM_ETIKET[kayit.durum]}
          vurgu={kayit.durum === "onaylandi"}
        />
        <BilgiBadge ikon="solar:clock-circle-bold-duotone" etiket="Son Güncelleme" deger={kayit.sonGuncelleme} />
        <BilgiBadge ikon="solar:user-bold-duotone" etiket="Oluşturan" deger={kayit.olusturan} />
        <BilgiBadge ikon="solar:shield-check-bold-duotone" etiket="Onaylayan" deger={kayit.onaylayan} />
      </div>

      {/* Üst KPI */}
      <DetayKpi kayit={kayit} />

      {/* Elektrik & GES — en zengin kart, tam genişlik */}
      <ElektrikGesDetay kayit={kayit} />

      {/* Diğer enerji kaynakları — dengeli 2 kolon */}
      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <UretimDetay kayit={kayit} />
        <DogalgazDetay kayit={kayit} />
        <AkaryakitDetay kayit={kayit} />
        <OncekiAyTablo kayit={kayit} />
      </div>

      {/* Notlar + geçmiş — 2 kolon */}
      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <NotlarKarti kayit={kayit} />
        <GecmisKarti kayit={kayit} />
      </div>

      {/* Kaynak belgeler */}
      <BelgelerKarti kayit={kayit} />

      {/* Aksiyon bar */}
      <AksiyonBar />
    </div>
  );
}
