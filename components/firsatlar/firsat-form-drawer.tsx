"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import { firsatEkle, firsatGuncelle } from "@/lib/data/firsatlar";
import type { Firsat, FirsatDurum, FirsatKaynak, FirsatOncelik } from "@/lib/types";

const ONCELIKLER = [
  { deger: "yuksek", etiket: "Yüksek" },
  { deger: "orta", etiket: "Orta" },
  { deger: "dusuk", etiket: "Düşük" },
];
const KAYNAKLAR = [
  { deger: "elektrik", etiket: "Elektrik" },
  { deger: "dogalgaz", etiket: "Doğalgaz" },
  { deger: "akaryakit", etiket: "Akaryakıt" },
];
const DURUMLAR = [
  { deger: "fizibilite", etiket: "Fizibilite" },
  { deger: "teklif", etiket: "Teklif / Planlama" },
  { deger: "onaylandi", etiket: "Onaylandı" },
  { deger: "uygulama", etiket: "Uygulama" },
  { deger: "tamamlandi", etiket: "Tamamlandı" },
];

export function FirsatFormDrawer({ firsat, trigger }: { firsat?: Firsat; trigger: React.ReactElement }) {
  const { t } = useDil();
  const qc = useQueryClient();
  const duzenle = !!firsat;
  const [acik, setAcik] = React.useState(false);
  const [ad, setAd] = React.useState("");
  const [oncelik, setOncelik] = React.useState("orta");
  const [kaynak, setKaynak] = React.useState("elektrik");
  const [durum, setDurum] = React.useState("fizibilite");
  const [tasarruf, setTasarruf] = React.useState("");
  const [yatirim, setYatirim] = React.useState("");
  const [geriDonus, setGeriDonus] = React.useState("");
  const [ilerleme, setIlerleme] = React.useState("");
  const [yukleniyor, setYukleniyor] = React.useState(false);

  function sifirla() {
    setAd(firsat?.ad ?? "");
    setOncelik(firsat?.oncelik ?? "orta");
    setKaynak(firsat?.kaynak ?? "elektrik");
    setDurum(firsat?.durum ?? "fizibilite");
    setTasarruf(firsat ? String(firsat.tasarruf) : "");
    setYatirim(firsat ? String(firsat.yatirim) : "");
    setGeriDonus(firsat ? String(firsat.geriDonus) : "");
    setIlerleme(firsat ? String(firsat.ilerleme) : "0");
  }

  const sayi = (s: string) => {
    const n = Number(s.replace(",", "."));
    return Number.isNaN(n) ? 0 : n;
  };

  async function kaydet() {
    if (!ad.trim()) {
      toast.error(t("Fırsat adı zorunludur"));
      return;
    }
    setYukleniyor(true);
    const girdi = {
      oncelik: oncelik as FirsatOncelik,
      ad,
      kaynak: kaynak as FirsatKaynak,
      tasarruf: sayi(tasarruf),
      yatirim: sayi(yatirim),
      geriDonus: sayi(geriDonus),
      durum: durum as FirsatDurum,
      ilerleme: Math.max(0, Math.min(100, Math.round(sayi(ilerleme)))),
    };
    try {
      if (duzenle && firsat) await firsatGuncelle(firsat.id, girdi);
      else await firsatEkle(girdi);
      toast.success(duzenle ? `${ad} ${t("güncellendi")}` : `${ad} ${t("eklendi")}`);
      qc.invalidateQueries({ queryKey: queryKeys.firsatlar.analiz });
      setAcik(false);
    } catch (e) {
      toast.error(duzenle ? t("Güncelleme başarısız") : t("Ekleme başarısız"), {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <Sheet open={acik} onOpenChange={(o) => { if (o) sifirla(); setAcik(o); }}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{duzenle ? t("Fırsatı Düzenle") : t("Yeni Fırsat")}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("Fırsat Adı")}</Label>
            <Input value={ad} onChange={(e) => setAd(e.target.value)} placeholder={t("Örn. LED Aydınlatma Dönüşümü")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("Öncelik")}</Label>
              <Select value={oncelik} onValueChange={(v) => setOncelik(v as string)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{ONCELIKLER.map((o) => <SelectItem key={o.deger} value={o.deger}>{t(o.etiket)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("Enerji Kaynağı")}</Label>
              <Select value={kaynak} onValueChange={(v) => setKaynak(v as string)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>{KAYNAKLAR.map((k) => <SelectItem key={k.deger} value={k.deger}>{t(k.etiket)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("Potansiyel Tasarruf")} (TEP/yıl)</Label>
              <Input inputMode="decimal" value={tasarruf} onChange={(e) => setTasarruf(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("Yatırım")} (€)</Label>
              <Input inputMode="decimal" value={yatirim} onChange={(e) => setYatirim(e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("Geri Dönüş")} ({t("yıl")})</Label>
              <Input inputMode="decimal" value={geriDonus} onChange={(e) => setGeriDonus(e.target.value)} placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("İlerleme")} (%)</Label>
              <Input inputMode="numeric" value={ilerleme} onChange={(e) => setIlerleme(e.target.value)} placeholder="0" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("Durum")}</Label>
            <Select value={durum} onValueChange={(v) => setDurum(v as string)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{DURUMLAR.map((d) => <SelectItem key={d.deger} value={d.deger}>{t(d.etiket)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>{t("İptal")}</SheetClose>
          <Button className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700" disabled={yukleniyor} onClick={kaydet}>
            <Icon icon={yukleniyor ? "svg-spinners:180-ring" : "solar:diskette-bold-duotone"} className="size-4" />
            {duzenle ? t("Kaydet") : t("Ekle")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
