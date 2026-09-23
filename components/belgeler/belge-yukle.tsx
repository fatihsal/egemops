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
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDil } from "@/components/providers/dil-provider";
import { belgeYukleGenel } from "@/lib/data/belgeler";
import { queryKeys } from "@/lib/queries/keys";
import type { BelgeKategoriAnahtar } from "@/lib/types";

const KATEGORILER: { deger: BelgeKategoriAnahtar; etiket: string }[] = [
  { deger: "yasal", etiket: "Yasal & Mevzuat" },
  { deger: "sertifika", etiket: "Sertifikalar" },
  { deger: "sozlesme", etiket: "Sözleşmeler" },
  { deger: "rapor", etiket: "Etüt & Raporlar" },
  { deger: "teknik", etiket: "Teknik Dökümanlar" },
  { deger: "fatura", etiket: "Faturalar" },
];

export function BelgeYukleButonu() {
  const { t } = useDil();
  const qc = useQueryClient();
  const [acik, setAcik] = React.useState(false);
  const [kategori, setKategori] = React.useState<BelgeKategoriAnahtar>("sozlesme");
  const [gecerlilik, setGecerlilik] = React.useState("");
  const [aciklama, setAciklama] = React.useState("");
  const [dosya, setDosya] = React.useState<File | null>(null);
  const [yukleniyor, setYukleniyor] = React.useState(false);

  function sifirla() {
    setKategori("sozlesme");
    setGecerlilik("");
    setAciklama("");
    setDosya(null);
  }

  async function yukle() {
    if (!dosya) {
      toast.error(t("Lütfen bir dosya seçin"));
      return;
    }
    if (dosya.size > 20 * 1024 * 1024) {
      toast.error(t("Dosya en fazla 20 MB olabilir"));
      return;
    }
    setYukleniyor(true);
    try {
      await belgeYukleGenel({ dosya, kategori, gecerlilik: gecerlilik || null, aciklama });
      toast.success(t("Belge yüklendi"));
      qc.invalidateQueries({ queryKey: queryKeys.belgeler.analiz });
      sifirla();
      setAcik(false);
    } catch (e) {
      toast.error(t("Yükleme başarısız"), {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <Sheet open={acik} onOpenChange={setAcik}>
      <SheetTrigger
        render={
          <Button className="h-9 gap-1.5">
            <Icon icon="solar:cloud-upload-bold-duotone" className="size-4" />
            {t("Belge Yükle")}
          </Button>
        }
      />
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{t("Belge Yükle")}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 p-5">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("Kategori")}</Label>
            <Select value={kategori} onValueChange={(v) => setKategori(v as BelgeKategoriAnahtar)}>
              <SelectTrigger className="bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {KATEGORILER.map((k) => (
                  <SelectItem key={k.deger} value={k.deger}>{t(k.etiket)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              {t("Son Geçerlilik Tarihi")} <span className="text-muted-foreground/60">({t("opsiyonel")})</span>
            </Label>
            <Input type="date" value={gecerlilik} onChange={(e) => setGecerlilik(e.target.value)} className="bg-card" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              {t("Açıklama")} <span className="text-muted-foreground/60">({t("opsiyonel")})</span>
            </Label>
            <Input value={aciklama} onChange={(e) => setAciklama(e.target.value)} placeholder={t("Kısa açıklama")} className="bg-card" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">{t("Dosya")}</Label>
            <Input
              type="file"
              accept=".pdf,.xlsx,.xls,.csv,.doc,.docx,.jpg,.jpeg,.png,.webp"
              onChange={(e) => setDosya(e.target.files?.[0] ?? null)}
              className="bg-card"
            />
            <p className="text-xs text-muted-foreground">{t("PDF, XLSX, JPG · en fazla 20 MB")}</p>
          </div>

          <Button className="w-full gap-1.5" disabled={yukleniyor} onClick={yukle}>
            <Icon icon={yukleniyor ? "svg-spinners:180-ring" : "solar:upload-minimalistic-bold-duotone"} className="size-4" />
            {t("Yükle")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
