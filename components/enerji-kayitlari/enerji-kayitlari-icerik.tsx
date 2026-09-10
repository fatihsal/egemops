"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  KayitFiltreleri,
  VARSAYILAN_FILTRE,
  type FiltreDegerleri,
} from "@/components/enerji-kayitlari/kayit-filtreleri";
import { KayitKpi } from "@/components/enerji-kayitlari/kayit-kpi";
import { KayitTablosu } from "@/components/enerji-kayitlari/kayit-tablosu";
import { YillikOzetTablosu } from "@/components/enerji-kayitlari/yillik-ozet-tablosu";
import { KayitDetayPaneli } from "@/components/enerji-kayitlari/kayit-detay-paneli";
import { BosDurum } from "@/components/common/bos-durum";
import { useEnerjiKayitlari } from "@/lib/queries/kayitlar";
import { csvIndir } from "@/lib/disa-aktar";
import { sayi, sayi2 } from "@/lib/format";
import { cn } from "@/lib/utils";

const DURUM_ETIKET: Record<string, string> = {
  onaylandi: "Onaylandı",
  kontrol: "Kontrol Bekliyor",
  taslak: "Taslak",
};
const KALITE_ETIKET: Record<string, string> = {
  tam: "Tam",
  kontrol: "Kontrol Bekliyor",
  eksik: "Eksik",
};

const SEKMELER = [
  { anahtar: "aylik", etiket: "Aylık Kayıtlar" },
  { anahtar: "yillik", etiket: "Yıllık Özet" },
] as const;

const AY_MAP: Record<string, number> = {
  Ocak: 1, Şubat: 2, Mart: 3, Nisan: 4, Mayıs: 5, Haziran: 6,
  Temmuz: 7, Ağustos: 8, Eylül: 9, Ekim: 10, Kasım: 11, Aralık: 12,
};
const DURUM_MAP: Record<string, string> = {
  Onaylandı: "onaylandi",
  "Kontrol Bekliyor": "kontrol",
  Taslak: "taslak",
};
const BOYUTLAR = ["10", "25", "50"];

export function EnerjiKayitlariIcerik() {
  const { data: kayitlar, isLoading } = useEnerjiKayitlari();
  const [sekme, setSekme] = React.useState<"aylik" | "yillik">("aylik");
  const [seciliId, setSeciliId] = React.useState<string | null>(null);
  const [filtre, setFiltre] = React.useState<FiltreDegerleri>(VARSAYILAN_FILTRE);
  const [sayfa, setSayfa] = React.useState(1);
  const [boyut, setBoyut] = React.useState(10);

  const seciliKayit = kayitlar?.find((k) => k.id === seciliId) ?? null;

  const filtreli = React.useMemo(() => {
    return (kayitlar ?? []).filter((k) => {
      if (filtre.yil !== "Tümü" && String(k.yil) !== filtre.yil) return false;
      if (filtre.ay !== "Tümü" && k.ay !== AY_MAP[filtre.ay]) return false;
      if (filtre.durum !== "Tümü" && k.durum !== DURUM_MAP[filtre.durum]) return false;
      // Enerji Türü: tüm kayıtlar tüm türleri içerdiğinden satır sayısını azaltmaz.
      return true;
    });
  }, [kayitlar, filtre]);

  const toplamSayfa = Math.max(1, Math.ceil(filtreli.length / boyut));
  const geciliSayfa = Math.min(sayfa, toplamSayfa);
  const bas = (geciliSayfa - 1) * boyut;
  const sayfaKayitlari = filtreli.slice(bas, bas + boyut);

  const sayfaPenceresi = () => {
    const gorunur = Math.min(5, toplamSayfa);
    const baslangic = Math.max(1, Math.min(geciliSayfa - 2, toplamSayfa - gorunur + 1));
    return Array.from({ length: gorunur }, (_, i) => baslangic + i);
  };

  function filtreleUygula(f: FiltreDegerleri) {
    setFiltre(f);
    setSayfa(1);
    const sonuc = (kayitlar ?? []).filter((k) => {
      if (f.yil !== "Tümü" && String(k.yil) !== f.yil) return false;
      if (f.ay !== "Tümü" && k.ay !== AY_MAP[f.ay]) return false;
      if (f.durum !== "Tümü" && k.durum !== DURUM_MAP[f.durum]) return false;
      return true;
    }).length;
    toast.success(`${sonuc} kayıt bulundu`);
  }

  function disaAktar() {
    if (filtreli.length === 0) {
      toast.error("Dışa aktarılacak kayıt yok");
      return;
    }
    const basliklar = [
      "Dönem",
      "Elektrik (kWh)",
      "GES Üretimi (kWh)",
      "Doğalgaz (Sm³)",
      "Akaryakıt (Litre)",
      "Toplam TEP",
      "Durum",
      "Veri Kalitesi",
    ];
    const satirlar = filtreli.map((k) => [
      k.donem,
      sayi2(k.elektrik),
      sayi2(k.gesUretim),
      sayi2(k.dogalgaz),
      sayi(k.akaryakit),
      sayi2(k.toplamTep),
      DURUM_ETIKET[k.durum] ?? k.durum,
      KALITE_ETIKET[k.veriKalitesi] ?? k.veriKalitesi,
    ]);
    csvIndir("enerji-kayitlari", basliklar, satirlar);
    toast.success(`${filtreli.length} kayıt Excel'e aktarıldı`);
  }

  return (
    <div className="space-y-6">
      <KayitFiltreleri
        onFiltrele={filtreleUygula}
        onTemizle={() => {
          setFiltre(VARSAYILAN_FILTRE);
          setSayfa(1);
          toast("Filtreler temizlendi");
        }}
      />
      <KayitKpi />

      <Card>
        <CardContent className="space-y-4">
          {/* Sekmeler + tablo aksiyonları */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b">
            <div className="flex gap-6">
              {SEKMELER.map((s) => (
                <button
                  key={s.anahtar}
                  type="button"
                  onClick={() => setSekme(s.anahtar)}
                  className={cn(
                    "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors",
                    sekme === s.anahtar
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.etiket}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pb-2">
              <Button
                render={<Link href="/veri-girisi" />}
                nativeButton={false}
                size="sm"
                className="gap-1.5 bg-teal-600 text-white shadow-sm hover:bg-teal-700"
              >
                <Icon icon="solar:add-circle-bold-duotone" className="size-4" />
                Yeni Aylık Kayıt
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={disaAktar}
              >
                <Icon icon="vscode-icons:file-type-excel" className="size-4" />
                Excel&apos;e Aktar
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Kolon ayarları"
                onClick={() => toast("Kolon görünürlüğü yakında")}
              >
                <Icon icon="solar:tuning-2-bold-duotone" className="size-4.5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* İçerik */}
          {sekme === "aylik" ? (
            isLoading || !kayitlar ? (
              <div className="space-y-2 py-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-11 w-full" />
                ))}
              </div>
            ) : sayfaKayitlari.length === 0 ? (
              <BosDurum
                baslik="Kayıt bulunamadı"
                aciklama="Filtre kriterlerine uygun kayıt yok."
              />
            ) : (
              <KayitTablosu
                kayitlar={sayfaKayitlari}
                seciliId={seciliId}
                onSec={setSeciliId}
              />
            )
          ) : (
            <YillikOzetTablosu />
          )}

          {/* Pagination (yalnız aylık) */}
          {sekme === "aylik" && !isLoading && filtreli.length > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm">
              <span className="text-muted-foreground">
                <span className="tabular-nums">
                  {sayi(bas + 1)}–{sayi(Math.min(bas + boyut, filtreli.length))}
                </span>{" "}
                / {sayi(filtreli.length)} kayıt
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Önceki"
                  disabled={geciliSayfa <= 1}
                  onClick={() => setSayfa((s) => Math.max(1, s - 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {sayfaPenceresi().map((n) => (
                  <Button
                    key={n}
                    variant={n === geciliSayfa ? "default" : "ghost"}
                    size="icon-sm"
                    className="tabular-nums"
                    onClick={() => setSayfa(n)}
                  >
                    {n}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Sonraki"
                  disabled={geciliSayfa >= toplamSayfa}
                  onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Sayfa başına:</span>
                <Select
                  value={String(boyut)}
                  onValueChange={(v) => {
                    setBoyut(Number(v));
                    setSayfa(1);
                  }}
                >
                  <SelectTrigger size="sm" className="w-[72px] bg-card">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BOYUTLAR.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <KayitDetayPaneli kayit={seciliKayit} onKapat={() => setSeciliId(null)} />
    </div>
  );
}
