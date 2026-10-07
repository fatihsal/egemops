"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BosDurum } from "@/components/common/bos-durum";
import { useMakine } from "@/lib/queries/bakim";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { KRITIKLIK_META, uyumRenk } from "@/components/bakim/makineler/stiller";
import type { Makine } from "@/lib/types/bakim";

const BOLUM_IKON: Record<string, string> = {
  Laminasyon: "solar:layers-bold-duotone",
  Kesim: "solar:scissors-square-bold-duotone",
  Baskı: "solar:printer-bold-duotone",
  Yaldız: "solar:stars-bold-duotone",
  Dönüşüm: "solar:refresh-circle-bold-duotone",
  Kalite: "solar:eye-scan-bold-duotone",
  Sevkiyat: "solar:box-bold-duotone",
};

function Kunye({ m }: { m: Makine }) {
  const { t } = useDil();
  const krit = KRITIKLIK_META[m.kritiklik];
  const alanlar: { etiket: string; deger: React.ReactNode }[] = [
    { etiket: "Bölüm", deger: t(m.bolum) },
    { etiket: "Makine Grubu", deger: t(m.grup) },
    { etiket: "Marka", deger: m.marka ?? "—" },
    { etiket: "Model", deger: m.model ?? "—" },
    { etiket: "Seri No", deger: m.seriNo ?? "—" },
    { etiket: "Lokasyon", deger: m.lokasyon ? t(m.lokasyon) : "—" },
    { etiket: "Devreye Alma Yılı", deger: m.devreyeAlmaYili ?? "—" },
    { etiket: "Sorumlu Ekip", deger: m.sorumluEkip ? t(m.sorumluEkip) : "—" },
    {
      etiket: "Kritiklik",
      deger: (
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", krit.sinif)}>
          <span className={cn("size-1.5 rounded-full", krit.nokta)} />
          {t(krit.etiket)}
        </span>
      ),
    },
  ];
  return (
    <Card>
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Künye Bilgileri")}</h3>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {alanlar.map((a) => (
            <div key={a.etiket} className="flex items-center justify-between gap-3 border-b border-dashed pb-2.5 text-sm">
              <dt className="text-muted-foreground">{t(a.etiket)}</dt>
              <dd className="text-right font-medium">{a.deger}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function Istatistik({ m }: { m: Makine }) {
  const { t } = useDil();
  const uyum = uyumRenk(m.uyumOrani);
  const kartlar = [
    {
      ik: "solar:clipboard-list-bold-duotone",
      renk: m.acikIsEmri > 0 ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300",
      baslik: "Açık İş Emri",
      deger: String(m.acikIsEmri),
    },
    {
      ik: "solar:shield-check-bold-duotone",
      renk: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
      baslik: "Uyum Oranı",
      deger: `%${m.uyumOrani}`,
      renkMetin: uyum.metin,
    },
    {
      ik: "solar:history-bold-duotone",
      renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
      baslik: "Son Bakım",
      deger: m.sonBakim ?? "—",
    },
    {
      ik: "solar:calendar-mark-bold-duotone",
      renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
      baslik: "Sonraki Bakım",
      deger: m.sonrakiBakim ?? "—",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kartlar.map((k) => (
        <Card key={k.baslik}>
          <CardContent className="flex items-center gap-3 p-4">
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", k.renk)}>
              <Icon icon={k.ik} className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{t(k.baslik)}</p>
              <p className={cn("font-heading text-lg font-bold tracking-tight tabular-nums", k.renkMetin)}>{k.deger}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MakineDetay() {
  const { t } = useDil();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data: m, isLoading } = useMakine(id ?? "");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!m) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-sm text-muted-foreground">
            {t("Makine bulunamadı.")}{" "}
            <Link href="/bakim/makineler" className="font-medium text-blue-600 dark:text-blue-400">
              {t("Makine listesine dön")}
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  const krit = KRITIKLIK_META[m.kritiklik];

  return (
    <div className="space-y-6">
      {/* Başlık + aksiyonlar */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="outline" size="icon" className="mt-0.5 bg-card" nativeButton={false} render={<Link href="/bakim/makineler" />} aria-label={t("Geri")}>
            <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
          </Button>
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
            <Icon icon={BOLUM_IKON[m.bolum] ?? "solar:cpu-bolt-bold-duotone"} className="size-7" />
          </span>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-bold tracking-tight">{m.ad}</h1>
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", krit.sinif)}>
                <span className={cn("size-1.5 rounded-full", krit.nokta)} />
                {t(krit.etiket)}
              </span>
            </div>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Icon icon="solar:hashtag-linear" className="size-4" /> {m.kod}</span>
              <span className="inline-flex items-center gap-1.5"><Icon icon="solar:map-point-linear" className="size-4" /> {m.lokasyon ? t(m.lokasyon) : t(m.bolum)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-9 gap-1.5 bg-card" onClick={() => toast(t("Bu özellik yakında eklenecek."))}>
            <Icon icon="solar:clipboard-add-bold-duotone" className="size-4" />
            {t("Bakım Planı Ekle")}
          </Button>
          <Button className="h-9 gap-1.5 bg-blue-600 text-white shadow-sm hover:bg-blue-700" onClick={() => toast(t("Bu özellik yakında eklenecek."))}>
            <Icon icon="solar:add-circle-bold-duotone" className="size-4" />
            {t("İş Emri Oluştur")}
          </Button>
        </div>
      </div>

      <Istatistik m={m} />

      {/* Sekmeler */}
      <Tabs defaultValue="genel">
        <TabsList variant="line" className="w-full justify-start gap-4 border-b">
          <TabsTrigger value="genel">{t("Genel")}</TabsTrigger>
          <TabsTrigger value="planlar">{t("Bakım Planları")}</TabsTrigger>
          <TabsTrigger value="isemirleri">{t("İş Emirleri")}</TabsTrigger>
          <TabsTrigger value="bulgular">{t("Bulgular")}</TabsTrigger>
          <TabsTrigger value="dokumanlar">{t("Dokümanlar")}</TabsTrigger>
        </TabsList>

        <TabsContent value="genel" className="pt-5">
          <Kunye m={m} />
        </TabsContent>

        <TabsContent value="planlar" className="pt-5">
          <Card>
            <CardContent className="p-0">
              <BosDurum
                ikon="solar:clipboard-list-bold-duotone"
                baslik={t("Bakım planı yok")}
                aciklama={t("Bu makineye ait bakım planları ilgili modül devreye alındığında burada listelenecek.")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="isemirleri" className="pt-5">
          <Card>
            <CardContent className="p-0">
              <BosDurum
                ikon="solar:clipboard-check-bold-duotone"
                baslik={t("İş emri yok")}
                aciklama={t("Bu makineye ait planlı iş emirleri ilgili modül devreye alındığında burada listelenecek.")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulgular" className="pt-5">
          <Card>
            <CardContent className="p-0">
              <BosDurum
                ikon="solar:danger-triangle-bold-duotone"
                baslik={t("Bulgu yok")}
                aciklama={t("Bu makineye ait bakım bulguları ilgili modül devreye alındığında burada listelenecek.")}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dokumanlar" className="pt-5">
          <Card>
            <CardContent className="p-0">
              <BosDurum
                ikon="solar:folder-with-files-bold-duotone"
                baslik={t("Doküman yok")}
                aciklama={t("Bu makineye ait teknik dokümanlar ilgili modül devreye alındığında burada listelenecek.")}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
