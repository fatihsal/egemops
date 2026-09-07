"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkline } from "@/components/common/sparkline";
import { RadialOran } from "@/components/kayit-detay/parcalar";
import { useElektrikGesAnaliz } from "@/lib/queries/elektrik-ges";
import { sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Küçük yön göstergesi — % ya da puan. */
function MiniDegisim({ yuzde, puan }: { yuzde: number; puan?: boolean }) {
  const arti = yuzde >= 0;
  const metin = puan
    ? `${sayiOndalik(Math.abs(yuzde))} puan`
    : `%${sayiOndalik(Math.abs(yuzde))}`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold",
        arti ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
      )}
    >
      <span className="text-[9px] leading-none">{arti ? "▲" : "▼"}</span>
      {metin}
    </span>
  );
}

function Baslik({ children, ek }: { children: React.ReactNode; ek?: string }) {
  return (
    <h3 className="text-sm font-medium">
      {children}
      {ek ? <span className="ml-1 text-xs font-normal text-muted-foreground">{ek}</span> : null}
    </h3>
  );
}

export function ElektrikOzetKartlari() {
  const { data, isLoading } = useElektrikGesAnaliz();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-6 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const o = data.ozet;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {/* YTD */}
      <Card className="h-full">
        <CardContent className="flex h-full flex-col gap-3">
          <Baslik>Yılbaşından Bu Yana (YTD)</Baslik>
          <ul className="space-y-2.5">
            <li>
              <div className="text-[11px] text-muted-foreground">Toplam Elektrik</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-lg font-bold tracking-tight">{o.ytd.toplamElektrik}</span>
                <span className="text-xs text-muted-foreground">GWh</span>
                <MiniDegisim yuzde={o.ytd.toplamDegisim} />
              </div>
            </li>
            <li>
              <div className="text-[11px] text-muted-foreground">GES Üretimi</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-lg font-bold tracking-tight">{o.ytd.gesUretim}</span>
                <span className="text-xs text-muted-foreground">GWh</span>
                <MiniDegisim yuzde={o.ytd.gesUretimDegisim} />
              </div>
            </li>
            <li>
              <div className="text-[11px] text-muted-foreground">GES Karşılama</div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-heading text-lg font-bold tracking-tight">%{o.ytd.gesKarsilama}</span>
                <MiniDegisim yuzde={o.ytd.gesKarsilamaDegisim} puan />
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* En Yüksek Tüketim */}
      <Card className="h-full">
        <CardContent className="flex h-full flex-col gap-1.5">
          <Baslik>En Yüksek Tüketim</Baslik>
          <div className="text-xs text-muted-foreground">{o.enYuksek.donem}</div>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-2xl font-bold tracking-tight">{o.enYuksek.gwh}</span>
            <span className="text-sm text-muted-foreground">GWh</span>
          </div>
          <Sparkline
            data={o.enYuksek.trend}
            renk="#059669"
            className="mt-auto h-8 w-full text-emerald-600"
          />
        </CardContent>
      </Card>

      {/* En Düşük Tüketim */}
      <Card className="h-full">
        <CardContent className="flex h-full flex-col gap-1.5">
          <Baslik>En Düşük Tüketim</Baslik>
          <div className="text-xs text-muted-foreground">{o.enDusuk.donem}</div>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-2xl font-bold tracking-tight">{o.enDusuk.gwh}</span>
            <span className="text-sm text-muted-foreground">GWh</span>
          </div>
          <Sparkline
            data={o.enDusuk.trend}
            renk="#2563eb"
            className="mt-auto h-8 w-full text-blue-600"
          />
        </CardContent>
      </Card>

      {/* Ortalama Aylık Tüketim */}
      <Card className="h-full">
        <CardContent className="flex h-full flex-col gap-1.5">
          <Baslik>Ortalama Aylık Tüketim</Baslik>
          <div className="mt-auto flex items-baseline gap-1">
            <span className="font-heading text-2xl font-bold tracking-tight">{o.ortalama}</span>
            <span className="text-sm text-muted-foreground">GWh</span>
          </div>
          <p className="text-[11px] text-muted-foreground">Seçili dönem ortalaması</p>
        </CardContent>
      </Card>

      {/* Elektrik Yoğunluğu */}
      <Card className="h-full">
        <CardContent className="flex h-full flex-col gap-1.5">
          <Baslik ek="(kWh/ton)">Elektrik Yoğunluğu</Baslik>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-2xl font-bold tracking-tight">{o.yogunluk.deger}</span>
            <span className="text-sm text-muted-foreground">kWh/ton</span>
          </div>
          <div className="mt-auto space-y-0.5">
            <MiniDegisim yuzde={o.yogunluk.degisim} />
            <p className="text-[11px] leading-tight text-muted-foreground">
              Geçen yılın aynı dönemine göre
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Şebekeye Bağımlılık Oranı */}
      <Card className="h-full">
        <CardContent className="flex h-full flex-col items-center gap-2 text-center">
          <Baslik>Şebekeye Bağımlılık Oranı</Baslik>
          <RadialOran
            deger={o.sebekeBagimlilik}
            renk="#0d9488"
            className="my-auto size-24"
            yaziSinif="text-lg"
          />
        </CardContent>
      </Card>
    </div>
  );
}
