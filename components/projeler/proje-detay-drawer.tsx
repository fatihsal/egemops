"use client";

import * as React from "react";
import { Icon } from "@iconify/react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DURUM_META, KAYNAK_ETIKET, KAYNAK_STIL, RAG_META } from "@/components/projeler/stiller";
import { sayi, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Proje, ProjeRag } from "@/lib/types";

// İleride proje detay sayfasında yer alacak sekmeler (şimdilik bilgilendirme amaçlı).
const GELECEK_SEKMELER = [
  "Proje Planı", "Görevler", "Ölçüm & Doğrulama", "Teklifler", "Dokümanlar", "Fotoğraflar", "Riskler", "Notlar", "Aktivite Geçmişi",
];

function Satir({ etiket, deger, vurgu }: { etiket: string; deger: string; vurgu?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b py-2 last:border-b-0">
      <dt className="text-xs text-muted-foreground">{etiket}</dt>
      <dd className={cn("text-sm font-medium tabular-nums", vurgu)}>{deger}</dd>
    </div>
  );
}

function Bolum({ baslik, children }: { baslik: string; children: React.ReactNode }) {
  return (
    <section className="space-y-1">
      <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{baslik}</h4>
      <dl>{children}</dl>
    </section>
  );
}

function RagRozet({ etiket, durum }: { etiket: string; durum: ProjeRag }) {
  const r = RAG_META[durum];
  return (
    <div className="flex items-center gap-2 rounded-lg border p-2.5">
      <span className={cn("size-2.5 rounded-full", r.nokta)} />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{etiket}</p>
        <p className={cn("text-xs font-medium", r.metin)}>{r.etiket}</p>
      </div>
    </div>
  );
}

export function ProjeDetayDrawer({ proje, trigger }: { proje: Proje; trigger: React.ReactElement }) {
  const stil = KAYNAK_STIL[proje.kaynak];
  const durum = DURUM_META[proje.durum];
  const kalan = proje.butce - proje.harcanan;
  const kullanim = Math.round((proje.harcanan / proje.butce) * 100);

  return (
    <Sheet>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b p-5">
          <div className="flex items-start gap-3">
            <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", stil.sinif)}>
              <Icon icon={stil.ikon} className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <SheetTitle>{proje.ad}</SheetTitle>
              <SheetDescription>{proje.aciklama}</SheetDescription>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">{KAYNAK_ETIKET[proje.kaynak]}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", durum.sinif)}>{durum.etiket}</span>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {/* İlerleme */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">İlerleme</span>
              <span className="font-semibold tabular-nums">%{proje.ilerleme}</span>
            </div>
            <span className="block h-2 w-full overflow-hidden rounded-full bg-muted">
              <span className="block h-full rounded-full bg-teal-500" style={{ width: `${proje.ilerleme}%` }} />
            </span>
          </div>

          <Bolum baslik="Genel Bilgiler">
            <Satir etiket="Sorumlu" deger={proje.sorumlu} />
            <Satir etiket="Enerji Türü" deger={KAYNAK_ETIKET[proje.kaynak]} />
            <Satir etiket="Durum" deger={durum.etiket} />
          </Bolum>

          <Bolum baslik="Termin">
            <Satir etiket="Başlangıç" deger={proje.baslangic} />
            <Satir etiket="Hedef Bitiş" deger={proje.hedefBitis} />
            <Satir etiket="Geri Dönüş Süresi" deger={`${sayiOndalik(proje.geriDonus)} yıl`} />
          </Bolum>

          <Bolum baslik="Bütçe">
            <Satir etiket="Onaylı Bütçe" deger={`${sayi(proje.butce)} TL`} />
            <Satir etiket="Gerçekleşen Harcama" deger={`${sayi(proje.harcanan)} TL`} />
            <Satir etiket="Kalan Bütçe" deger={`${sayi(kalan)} TL`} />
            <Satir etiket="Bütçe Kullanımı" deger={`%${kullanim}`} vurgu={kullanim > 90 ? "text-amber-600" : undefined} />
          </Bolum>

          <Bolum baslik="Tasarruf">
            <Satir etiket="Beklenen Tasarruf" deger={`${sayiOndalik(proje.beklenenTasarruf)} TEP / yıl`} vurgu="text-emerald-600" />
            <Satir etiket="Doğrulanan Tasarruf" deger={proje.dogrulananTasarruf != null ? `${sayiOndalik(proje.dogrulananTasarruf)} TEP / yıl` : "Henüz yok"} vurgu={proje.dogrulananTasarruf != null ? "text-emerald-600" : "text-muted-foreground"} />
          </Bolum>

          <Bolum baslik="Proje Sağlığı">
            <div className="grid grid-cols-3 gap-2 pt-1">
              <RagRozet etiket="Zaman" durum={proje.saglik.zaman} />
              <RagRozet etiket="Bütçe" durum={proje.saglik.butce} />
              <RagRozet etiket="Tasarruf" durum={proje.saglik.tasarruf} />
            </div>
          </Bolum>

          <div className="rounded-lg border border-dashed p-3">
            <p className="text-xs font-medium">Detay sekmeleri hazırlanıyor</p>
            <p className="mt-1 flex flex-wrap gap-1.5">
              {GELECEK_SEKMELER.map((s) => (
                <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{s}</span>
              ))}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
