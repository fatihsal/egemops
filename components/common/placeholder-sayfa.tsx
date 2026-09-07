import { Icon } from "@iconify/react";

/** Henüz doldurulmamış detay/bölüm sayfaları için tutarlı "hazırlanıyor" ekranı. */
export function PlaceholderSayfa({
  baslik,
  aciklama,
}: {
  baslik: string;
  aciklama: string;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{baslik}</h1>

      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-card py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon icon="solar:clock-circle-bold-duotone" className="size-8" />
        </span>
        <div className="max-w-md space-y-1 px-6">
          <p className="text-lg font-semibold">Bu bölüm hazırlanıyor</p>
          <p className="text-sm text-muted-foreground">{aciklama}</p>
        </div>
      </div>
    </div>
  );
}
