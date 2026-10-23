"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDil } from "@/components/providers/dil-provider";
import { talepFotoYukle, talepOlustur } from "@/lib/data/satinalma/talepler";
import { queryKeys } from "@/lib/queries/keys";
import { cn } from "@/lib/utils";

const BIRIMLER = ["adet", "takım", "metre", "kg", "litre", "paket", "rulo"];

export function TalepForm() {
  const { t } = useDil();
  const router = useRouter();
  const qc = useQueryClient();
  const girisRef = React.useRef<HTMLInputElement>(null);

  const [baslik, setBaslik] = React.useState("");
  const [marka, setMarka] = React.useState("");
  const [model, setModel] = React.useState("");
  const [adet, setAdet] = React.useState("");
  const [birim, setBirim] = React.useState("adet");
  const [aciklama, setAciklama] = React.useState("");
  const [fotolar, setFotolar] = React.useState<string[]>([]);
  const [yukleniyorFoto, setYukleniyorFoto] = React.useState(false);
  const [kaydediliyor, setKaydediliyor] = React.useState(false);

  async function fotoSec(e: React.ChangeEvent<HTMLInputElement>) {
    const secilen = Array.from(e.target.files ?? []);
    if (secilen.length === 0) return;
    setYukleniyorFoto(true);
    try {
      const urller = await Promise.all(secilen.map((f) => talepFotoYukle(f)));
      setFotolar((o) => [...o, ...urller]);
    } catch (err) {
      toast.error(t("Fotoğraf yüklenemedi"), { description: err instanceof Error ? err.message : undefined });
    } finally {
      setYukleniyorFoto(false);
      if (girisRef.current) girisRef.current.value = "";
    }
  }

  async function kaydet() {
    if (!baslik.trim()) { toast.error(t("Lütfen bir başlık girin.")); return; }
    if (kaydediliyor) return;
    setKaydediliyor(true);
    try {
      const id = await talepOlustur({
        baslik: baslik.trim(),
        marka: marka.trim() || null,
        model: model.trim() || null,
        adet: adet ? Number(adet) : null,
        birim,
        teknikAciklama: aciklama.trim() || null,
        fotoUrl: fotolar,
      });
      toast.success(t("Talep oluşturuldu"));
      qc.invalidateQueries({ queryKey: queryKeys.satinalma.talepler });
      router.push(`/satinalma/talepler/${id}`);
    } catch (err) {
      toast.error(t("Talep oluşturulamadı"), { description: err instanceof Error ? err.message : undefined });
      setKaydediliyor(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href="/satinalma/talepler" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <Icon icon="solar:alt-arrow-left-linear" className="size-4" />{t("Malzeme Talepleri")}
      </Link>

      {/* Fotoğraflar */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-base font-bold tracking-tight">{t("Fotoğraflar")}</h3>
          <p className="text-sm text-muted-foreground">{t("Malzemenin görselini ekleyin. (Yapay zekâ ile otomatik ürün önerisi sonraki aşamada eklenecek.)")}</p>
        </CardHeader>
        <CardContent>
          <input ref={girisRef} type="file" accept="image/*" multiple hidden onChange={fotoSec} />
          <div className="flex flex-wrap gap-3">
            {fotolar.map((url, i) => (
              <div key={url} className="group relative size-24 overflow-hidden rounded-xl ring-1 ring-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="size-full object-cover" />
                <button type="button" onClick={() => setFotolar((o) => o.filter((_, j) => j !== i))} aria-label={t("Kaldır")} className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"><Icon icon="solar:close-circle-bold" className="size-4" /></button>
              </div>
            ))}
            <button type="button" onClick={() => girisRef.current?.click()} disabled={yukleniyorFoto} className={cn("flex size-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-muted-foreground transition-colors hover:border-orange-400 hover:text-orange-500", yukleniyorFoto && "opacity-60")}>
              <Icon icon={yukleniyorFoto ? "svg-spinners:180-ring" : "solar:camera-add-bold-duotone"} className="size-6" />
              <span className="text-[11px]">{t(yukleniyorFoto ? "Yükleniyor…" : "Ekle")}</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Bilgiler */}
      <Card>
        <CardHeader><h3 className="font-heading text-base font-bold tracking-tight">{t("Malzeme Bilgileri")}</h3></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tf-baslik" className="text-xs text-muted-foreground">{t("Başlık")} *</Label>
            <Input id="tf-baslik" value={baslik} onChange={(e) => setBaslik(e.target.value)} placeholder={t("Örn. Pnömatik silindir")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="tf-marka" className="text-xs text-muted-foreground">{t("Marka")}</Label><Input id="tf-marka" value={marka} onChange={(e) => setMarka(e.target.value)} placeholder="Festo" /></div>
            <div className="space-y-1.5"><Label htmlFor="tf-model" className="text-xs text-muted-foreground">{t("Model")}</Label><Input id="tf-model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="DSBC-32-100" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="tf-adet" className="text-xs text-muted-foreground">{t("Adet")}</Label><Input id="tf-adet" type="number" min="0" value={adet} onChange={(e) => setAdet(e.target.value)} placeholder="1" /></div>
            <div className="space-y-1.5">
              <Label htmlFor="tf-birim" className="text-xs text-muted-foreground">{t("Birim")}</Label>
              <select id="tf-birim" value={birim} onChange={(e) => setBirim(e.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                {BIRIMLER.map((b) => <option key={b} value={b}>{t(b)}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tf-aciklama" className="text-xs text-muted-foreground">{t("Teknik Açıklama")}</Label>
            <Textarea id="tf-aciklama" value={aciklama} onChange={(e) => setAciklama(e.target.value)} rows={4} placeholder={t("Teknik özellikler, kullanım yeri, standart vb.")} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" nativeButton={false} render={<Link href="/satinalma/talepler" />}>{t("İptal")}</Button>
        <Button className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" disabled={kaydediliyor || yukleniyorFoto} onClick={kaydet}>
          <Icon icon={kaydediliyor ? "svg-spinners:180-ring" : "solar:diskette-bold-duotone"} className="size-4" />{t("Talebi Oluştur")}
        </Button>
      </div>
    </div>
  );
}
