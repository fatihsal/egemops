"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DURUM_META, KAYNAK_ETIKET } from "@/components/projeler/stiller";
import { queryKeys } from "@/lib/queries/keys";
import { sayi } from "@/lib/format";
import type { Proje, ProjeAnaliz, ProjeDurum, ProjeKaynak } from "@/lib/types";

const TURLER = ["Elektrik", "Doğalgaz", "Akaryakıt"];
const DURUMLAR = Object.values(DURUM_META).map((d) => d.etiket);
const SORUMLULAR = ["Bakım Onarım", "Enerji Ekibi", "Üretim", "Proje Ofisi"];

function kaynakAnahtar(etiket: string): ProjeKaynak {
  return ((Object.keys(KAYNAK_ETIKET) as ProjeKaynak[]).find((k) => KAYNAK_ETIKET[k] === etiket)) ?? "elektrik";
}
function durumAnahtar(etiket: string): ProjeDurum {
  return ((Object.keys(DURUM_META) as ProjeDurum[]).find((k) => DURUM_META[k].etiket === etiket)) ?? "planlama";
}
const sayiCoz = (s: string) => Number(s.replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "")) || 0;

function Alan({ etiket, htmlFor, children, tam }: { etiket: string; htmlFor?: string; children: React.ReactNode; tam?: boolean }) {
  return (
    <div className={tam ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
      <Label htmlFor={htmlFor} className="text-xs text-muted-foreground">{etiket}</Label>
      {children}
    </div>
  );
}

export function ProjeFormDrawer({ proje, trigger }: { proje?: Proje; trigger: React.ReactElement }) {
  const duzenle = !!proje;
  const qc = useQueryClient();

  const [acik, setAcik] = React.useState(false);
  const [ad, setAd] = React.useState(proje?.ad ?? "");
  const [aciklama, setAciklama] = React.useState(proje?.aciklama ?? "");
  const [tur, setTur] = React.useState(proje ? KAYNAK_ETIKET[proje.kaynak] : "Elektrik");
  const [durum, setDurum] = React.useState(proje ? DURUM_META[proje.durum].etiket : "Planlama");
  const [sorumlu, setSorumlu] = React.useState(proje?.sorumlu ?? "Bakım Onarım");
  const [baslangic, setBaslangic] = React.useState(proje?.baslangic ?? "");
  const [hedefBitis, setHedefBitis] = React.useState(proje?.hedefBitis ?? "");
  const [butce, setButce] = React.useState(proje ? sayi(proje.butce) : "");
  const [tasarruf, setTasarruf] = React.useState(proje ? String(proje.beklenenTasarruf) : "");

  // Her açılışta alanları başlangıç değerlerine döndür (yeni proje = boş,
  // düzenleme = mevcut proje bilgileri).
  const sifirla = () => {
    setAd(proje?.ad ?? "");
    setAciklama(proje?.aciklama ?? "");
    setTur(proje ? KAYNAK_ETIKET[proje.kaynak] : "Elektrik");
    setDurum(proje ? DURUM_META[proje.durum].etiket : "Planlama");
    setSorumlu(proje?.sorumlu ?? "Bakım Onarım");
    setBaslangic(proje?.baslangic ?? "");
    setHedefBitis(proje?.hedefBitis ?? "");
    setButce(proje ? sayi(proje.butce) : "");
    setTasarruf(proje ? String(proje.beklenenTasarruf) : "");
  };

  const acKapat = (o: boolean) => {
    if (o) sifirla();
    setAcik(o);
  };

  const kaydet = () => {
    if (!ad.trim()) {
      toast.error("Proje adı zorunludur");
      return;
    }
    const kaynak = kaynakAnahtar(tur);
    const durumK = durumAnahtar(durum);
    const butceN = sayiCoz(butce);
    const tasarrufN = sayiCoz(tasarruf);
    qc.setQueryData(queryKeys.projeler.analiz, (old?: ProjeAnaliz) => {
      if (!old) return old;
      if (duzenle && proje) {
        return { ...old, projeler: old.projeler.map((p) => p.id === proje.id ? { ...p, ad, aciklama, kaynak, durum: durumK, sorumlu, baslangic, hedefBitis, butce: butceN, beklenenTasarruf: tasarrufN } : p) };
      }
      const yeni: Proje = {
        id: `p-${Date.now()}`, ad, aciklama, kaynak, durum: durumK, ilerleme: 0,
        baslangic, hedefBitis, sorumlu, butce: butceN, harcanan: 0,
        beklenenTasarruf: tasarrufN, dogrulananTasarruf: null, geriDonus: 0,
        saglik: { zaman: "yok", butce: "yok", tasarruf: "yok" },
      };
      return { ...old, projeler: [yeni, ...old.projeler] };
    });
    toast.success(duzenle ? `${ad} güncellendi` : `${ad} oluşturuldu`);
    setAcik(false);
  };

  return (
    <Sheet open={acik} onOpenChange={acKapat}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{duzenle ? "Projeyi Düzenle" : "Yeni Proje"}</SheetTitle>
          <SheetDescription>
            {duzenle ? "Proje bilgilerini güncelleyin." : "Onaylanan bir enerji verimliliği projesini kaydedin."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Alan etiket="Proje Adı" htmlFor="ad" tam>
              <Input id="ad" value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Örn. Kompresör Odası Optimizer" />
            </Alan>
            <Alan etiket="Açıklama" htmlFor="aciklama" tam>
              <Textarea id="aciklama" value={aciklama} onChange={(e) => setAciklama(e.target.value)} placeholder="Kısa açıklama" rows={2} />
            </Alan>

            <Alan etiket="Enerji Türü">
              <Select value={tur} onValueChange={(v) => setTur(v as string)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TURLER.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </Alan>
            <Alan etiket="Durum">
              <Select value={durum} onValueChange={(v) => setDurum(v as string)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DURUMLAR.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </Alan>

            <Alan etiket="Sorumlu" tam>
              <Select value={sorumlu} onValueChange={(v) => setSorumlu(v as string)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SORUMLULAR.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Alan>

            <Alan etiket="Başlangıç" htmlFor="baslangic">
              <Input id="baslangic" value={baslangic} onChange={(e) => setBaslangic(e.target.value)} placeholder="gg.aa.yyyy" />
            </Alan>
            <Alan etiket="Hedef Bitiş" htmlFor="hedefBitis">
              <Input id="hedefBitis" value={hedefBitis} onChange={(e) => setHedefBitis(e.target.value)} placeholder="gg.aa.yyyy" />
            </Alan>

            <Alan etiket="Bütçe (TL)" htmlFor="butce">
              <Input id="butce" value={butce} onChange={(e) => setButce(e.target.value)} placeholder="1.200.000" inputMode="numeric" />
            </Alan>
            <Alan etiket="Beklenen Tasarruf (TEP/yıl)" htmlFor="tasarruf">
              <Input id="tasarruf" value={tasarruf} onChange={(e) => setTasarruf(e.target.value)} placeholder="24,5" inputMode="decimal" />
            </Alan>
          </div>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>İptal</SheetClose>
          <Button className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700" onClick={kaydet}>
            <Icon icon="solar:diskette-bold-duotone" className="size-4" />
            {duzenle ? "Değişiklikleri Kaydet" : "Projeyi Oluştur"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
