"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

// Faz 0 — iskelet. Burada SAHTE veri/istatistik gösterilmez; modülün iş akışı
// ve gerçek kurulum durumu dürüstçe sunulur. Gerçek veriler sonraki fazlarda
// Supabase'den gelecek.

const ADIMLAR = [
  { ik: "solar:camera-bold-duotone", renk: "#f97316", baslik: "Talep & Fotoğraf", metin: "Marka, model, adet ve teknik açıklamayla malzeme talebi oluşturun." },
  { ik: "solar:magic-stick-3-bold-duotone", renk: "#8b5cf6", baslik: "AI Önerisi", metin: "Yapay zekâ görselden ürün bilgisini önerir; belirsiz alanları siz doğrularsınız." },
  { ik: "solar:shop-2-bold-duotone", renk: "#0ea5e9", baslik: "Tedarikçi Adayları", metin: "Yalnızca doğrulanabilir kaynaklı tedarikçiler listelenir — uydurma yok." },
  { ik: "solar:letter-bold-duotone", renk: "#14b8a6", baslik: "Teklif E-postası", metin: "RFQ taslağı hazırlanır; onayınız olmadan e-posta gönderilmez." },
  { ik: "solar:inbox-in-bold-duotone", renk: "#eab308", baslik: "Teklif Toplama", metin: "Gelen yanıtlar ve PDF teklifler talebe bağlanır (şimdilik manuel yükleme)." },
  { ik: "solar:chart-square-bold-duotone", renk: "#22c55e", baslik: "Karşılaştırma", metin: "Teknik uygunluk, fiyat, KDV, termin, nakliye ve garanti yan yana." },
];

const KURULUM = [
  { ik: "solar:gallery-bold", baslik: "Talep & dosya yükleme", durum: "hazir" as const, not: "Faz 2'de devreye girer" },
  { ik: "solar:cpu-bolt-bold", baslik: "AI görsel çıkarımı (OpenAI)", durum: "yapilandirilmamis" as const, not: "API anahtarı bekleniyor" },
  { ik: "solar:letter-bold", baslik: "Gmail bağlantısı (OAuth)", durum: "bagli_degil" as const, not: "Ayarlar'dan bağlanacak" },
];

const DURUM_STIL = {
  hazir: { etiket: "Planlandı", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", nokta: "bg-blue-500" },
  yapilandirilmamis: { etiket: "Yapılandırılmadı", sinif: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", nokta: "bg-slate-400" },
  bagli_degil: { etiket: "Bağlı değil", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", nokta: "bg-amber-500" },
};

export function SatinalmaDashboard() {
  const { t } = useDil();

  return (
    <div className="space-y-5">
      {/* Giriş / durum bandı */}
      <Card className="relative overflow-hidden border-orange-200/60 bg-gradient-to-br from-orange-50 to-amber-50/40 dark:border-orange-900/40 dark:from-orange-950/30 dark:to-amber-950/10">
        <div className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-orange-400/20 blur-3xl" />
        <CardContent className="relative flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-white shadow-md ring-1 ring-white/20">
              <Icon icon="solar:cart-large-2-bold-duotone" className="size-7" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-bold tracking-tight">{t("Akıllı Teknik Satın Alma")}</h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                {t("Fotoğraftan tedarikçi karşılaştırmasına kadar teknik satın alma sürecini tek yerde yönetin. Modül yeni kuruldu — ilk malzeme talebinizi oluşturarak başlayın.")}
              </p>
            </div>
          </div>
          <Button className="shrink-0 gap-1.5 bg-orange-600 text-white shadow-sm hover:bg-orange-700" nativeButton={false} render={<Link href="/satinalma/talepler" />}>
            <Icon icon="solar:add-circle-bold" className="size-4" />
            {t("Malzeme Talepleri")}
          </Button>
        </CardContent>
      </Card>

      {/* İş akışı yol haritası */}
      <Card>
        <CardHeader><h3 className="font-heading text-base font-bold tracking-tight">{t("Nasıl çalışır?")}</h3></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ADIMLAR.map((a, i) => (
              <div key={a.baslik} className="relative rounded-xl border bg-card p-4">
                <span className="absolute top-3 right-3 text-xs font-bold tabular-nums text-muted-foreground/40">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex size-10 items-center justify-center rounded-xl" style={{ background: `${a.renk}1a`, color: a.renk }}>
                  <Icon icon={a.ik} className="size-6" />
                </span>
                <p className="mt-3 font-medium">{t(a.baslik)}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t(a.metin)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kurulum durumu (dürüst) */}
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
          <h3 className="font-heading text-base font-bold tracking-tight">{t("Kurulum Durumu")}</h3>
          <Button variant="outline" size="sm" className="gap-1.5 bg-card" nativeButton={false} render={<Link href="/satinalma/ayarlar" />}>
            <Icon icon="solar:settings-linear" className="size-4" />{t("Ayarlar")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {KURULUM.map((k) => {
            const s = DURUM_STIL[k.durum];
            return (
              <div key={k.baslik} className="flex items-center gap-3 rounded-lg border p-3">
                <Icon icon={k.ik} className="size-5 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{t(k.baslik)}</p>
                  <p className="text-xs text-muted-foreground">{t(k.not)}</p>
                </div>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", s.sinif)}>
                  <span className={cn("size-1.5 rounded-full", s.nokta)} />{t(s.etiket)}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
