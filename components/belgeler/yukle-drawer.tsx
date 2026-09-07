"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

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
import { KATEGORI_META } from "@/components/belgeler/stiller";
import type { BelgeKategoriAnahtar } from "@/lib/types";

const KATEGORILER = Object.entries(KATEGORI_META) as [BelgeKategoriAnahtar, { etiket: string }][];

export function BelgeYukleDrawer({ trigger, varsayilanKategori }: { trigger: React.ReactElement; varsayilanKategori?: string }) {
  const [acik, setAcik] = React.useState(false);
  const [ad, setAd] = React.useState("");
  const [kategori, setKategori] = React.useState(varsayilanKategori ?? "Yasal & Mevzuat");
  const [aciklama, setAciklama] = React.useState("");
  const [gecerlilik, setGecerlilik] = React.useState("");
  const [dosya, setDosya] = React.useState("");

  const sifirla = () => {
    setAd(""); setKategori(varsayilanKategori ?? "Yasal & Mevzuat"); setAciklama(""); setGecerlilik(""); setDosya("");
  };

  const yukle = () => {
    if (!dosya) { toast.error("Lütfen bir dosya seçin"); return; }
    if (!ad.trim()) { toast.error("Belge adı zorunludur"); return; }
    toast.success(`${ad} yüklendi`);
    setAcik(false);
  };

  return (
    <Sheet open={acik} onOpenChange={(o) => { if (o) sifirla(); setAcik(o); }}>
      <SheetTrigger render={trigger} />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>Belge Yükle</SheetTitle>
          <SheetDescription>Belgeyi kategori ve geçerlilik bilgisiyle arşive ekleyin.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Sürükle-bırak alanı (görsel) */}
          <button
            type="button"
            onClick={() => setDosya(dosya ? "" : "enerji-belgesi.pdf")}
            className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-8 text-center transition-colors hover:border-primary/40 hover:bg-muted/50"
          >
            <Icon icon={dosya ? "solar:file-check-bold-duotone" : "solar:cloud-upload-bold-duotone"} className={dosya ? "size-9 text-emerald-500" : "size-9 text-muted-foreground"} />
            {dosya ? (
              <span className="text-sm font-medium">{dosya}</span>
            ) : (
              <>
                <span className="text-sm font-medium">Dosyayı buraya sürükleyin</span>
                <span className="text-xs text-muted-foreground">veya seçmek için tıklayın · PDF, Word, Excel, Görsel</span>
              </>
            )}
          </button>

          <div className="space-y-1.5">
            <Label htmlFor="belge-adi" className="text-xs text-muted-foreground">Belge Adı</Label>
            <Input id="belge-adi" value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Örn. ISO 50001 Sertifikası" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Kategori</Label>
            <Select value={kategori} onValueChange={(v) => setKategori(v as string)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>{KATEGORILER.map(([k, m]) => <SelectItem key={k} value={m.etiket}>{m.etiket}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="belge-gecerlilik" className="text-xs text-muted-foreground">Geçerlilik Tarihi <span className="text-muted-foreground/70">(opsiyonel)</span></Label>
            <Input id="belge-gecerlilik" value={gecerlilik} onChange={(e) => setGecerlilik(e.target.value)} placeholder="gg.aa.yyyy" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="belge-aciklama" className="text-xs text-muted-foreground">Açıklama</Label>
            <Textarea id="belge-aciklama" value={aciklama} onChange={(e) => setAciklama(e.target.value)} placeholder="Kısa açıklama" rows={2} />
          </div>
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>İptal</SheetClose>
          <Button className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700" onClick={yukle}>
            <Icon icon="solar:upload-minimalistic-bold-duotone" className="size-4" />
            Yükle
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
