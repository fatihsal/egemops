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
import { kalemleriEkle, type KalemGirdi } from "@/lib/data/satinalma/kalemler";
import { queryKeys } from "@/lib/queries/keys";
import { cn } from "@/lib/utils";
import type { AiCikarim, Kapsam, UrunDurumu } from "@/lib/types/satinalma";

const BIRIMLER = ["adet", "takım", "metre", "kg", "litre", "paket", "rulo"];
const URUN_DURUMU: { v: UrunDurumu; e: string }[] = [
  { v: "yeni", e: "Yeni / Orijinal" },
  { v: "ikinci_el_kabul", e: "İkinci el kabul" },
  { v: "farketmez", e: "Farketmez" },
];
const KAPSAM: { v: Kapsam; e: string }[] = [
  { v: "parca", e: "Yalnızca parça" },
  { v: "komple", e: "Komple montaj" },
  { v: "farketmez", e: "Farketmez" },
];

interface KalemState {
  ad: string; marka: string; model: string; siparisKodu: string;
  adet: string; birim: string; urunDurumu: UrunDurumu; kapsam: Kapsam;
  teknikAciklama: string; alternatifKabul: boolean;
  aiCikarim: AiCikarim | null; aiYukleniyor: boolean;
}
function bosKalem(): KalemState {
  return { ad: "", marka: "", model: "", siparisKodu: "", adet: "", birim: "adet", urunDurumu: "farketmez", kapsam: "farketmez", teknikAciklama: "", alternatifKabul: false, aiCikarim: null, aiYukleniyor: false };
}

export function TalepForm() {
  const { t } = useDil();
  const router = useRouter();
  const qc = useQueryClient();
  const girisRef = React.useRef<HTMLInputElement>(null);

  const [baslik, setBaslik] = React.useState("");
  const [fotolar, setFotolar] = React.useState<string[]>([]);
  const [yukleniyorFoto, setYukleniyorFoto] = React.useState(false);
  const [kalemler, setKalemler] = React.useState<KalemState[]>([bosKalem()]);
  const [kaydediliyor, setKaydediliyor] = React.useState(false);

  function kalemGuncelle(i: number, yama: Partial<KalemState>) {
    setKalemler((o) => o.map((k, j) => (j === i ? { ...k, ...yama } : k)));
  }

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

  async function aiOner(i: number) {
    if (fotolar.length === 0) { toast.error(t("Önce fotoğraf ekleyin.")); return; }
    if (kalemler[i].aiYukleniyor) return;
    kalemGuncelle(i, { aiYukleniyor: true });
    try {
      const yanit = await fetch("/api/satinalma/ai-cikarim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gorselUrl: fotolar[0] }) });
      const metin = await yanit.text();
      const sonuc = metin ? JSON.parse(metin) : {};
      if (!yanit.ok) { toast.error(t("AI önerisi alınamadı"), { description: sonuc?.hata ?? `HTTP ${yanit.status}` }); return; }
      const c = sonuc.cikarim as AiCikarim;
      const k = kalemler[i];
      kalemGuncelle(i, {
        aiCikarim: c,
        ad: k.ad || [c.marka, c.kategori].filter(Boolean).join(" ") || c.kategori || "",
        marka: k.marka || c.marka || "",
        model: k.model || c.model || "",
        teknikAciklama: k.teknikAciklama || c.ozet || "",
      });
      toast.success(`${t("AI önerisi uygulandı")} (${t("kalem")} ${i + 1}) — ${t("lütfen kontrol edin")}`);
    } catch (err) {
      toast.error(t("AI önerisi alınamadı"), { description: err instanceof Error ? err.message : undefined });
    } finally {
      kalemGuncelle(i, { aiYukleniyor: false });
    }
  }

  async function kaydet() {
    if (!baslik.trim()) { toast.error(t("Lütfen bir talep başlığı girin.")); return; }
    const gecerli = kalemler.filter((k) => k.ad.trim());
    if (gecerli.length === 0) { toast.error(t("En az bir kalem ve adı gerekli.")); return; }
    if (kaydediliyor) return;
    setKaydediliyor(true);
    try {
      const id = await talepOlustur({ baslik: baslik.trim(), fotoUrl: fotolar });
      const girdiler: KalemGirdi[] = gecerli.map((k) => ({
        ad: k.ad.trim(), marka: k.marka.trim() || null, model: k.model.trim() || null, siparisKodu: k.siparisKodu.trim() || null,
        adet: k.adet ? Number(k.adet) : null, birim: k.birim, urunDurumu: k.urunDurumu, kapsam: k.kapsam,
        alternatifKabul: k.alternatifKabul, teknikAciklama: k.teknikAciklama.trim() || null,
        aiCikarim: k.aiCikarim, aiDurum: k.aiCikarim ? "dogrulandi" : "beklemede",
      }));
      await kalemleriEkle(id, girdiler);
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

      {/* Başlık + fotoğraflar */}
      <Card>
        <CardHeader>
          <h3 className="font-heading text-base font-bold tracking-tight">{t("Talep")}</h3>
          <p className="text-sm text-muted-foreground">{t("Talebe bir başlık verin ve ilgili fotoğrafları ekleyin. Bir talepte birden fazla kalem (ör. motor ve redüktör) olabilir.")}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="tf-baslik" className="text-xs text-muted-foreground">{t("Talep Başlığı")} *</Label>
            <Input id="tf-baslik" value={baslik} onChange={(e) => setBaslik(e.target.value)} placeholder={t("Örn. Dolum hattı yedek parçaları")} />
          </div>
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

      {/* Kalemler */}
      {kalemler.map((k, i) => (
        <Card key={i}>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <h3 className="font-heading text-sm font-bold tracking-tight">{t("Kalem")} {i + 1}</h3>
            <div className="flex items-center gap-2">
              {fotolar.length > 0 ? (
                <Button size="sm" variant="outline" className="h-8 gap-1.5 border-violet-300 bg-card text-violet-700 hover:bg-violet-100 dark:border-violet-800 dark:text-violet-300 dark:hover:bg-violet-950" disabled={k.aiYukleniyor} onClick={() => aiOner(i)}>
                  <Icon icon={k.aiYukleniyor ? "svg-spinners:180-ring" : "solar:magic-stick-3-bold"} className="size-4" />{t("AI Öner")}
                </Button>
              ) : null}
              {kalemler.length > 1 ? (
                <button type="button" onClick={() => setKalemler((o) => o.filter((_, j) => j !== i))} aria-label={t("Kalemi sil")} className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"><Icon icon="solar:trash-bin-trash-linear" className="size-4" /></button>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("Ürün Adı")} *</Label>
              <Input value={k.ad} onChange={(e) => kalemGuncelle(i, { ad: e.target.value })} placeholder={t("Örn. Redüktörlü motor")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Marka")}</Label><Input value={k.marka} onChange={(e) => kalemGuncelle(i, { marka: e.target.value })} placeholder="SEW" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Model")}</Label><Input value={k.model} onChange={(e) => kalemGuncelle(i, { model: e.target.value })} /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Sipariş Kodu")}</Label><Input value={k.siparisKodu} onChange={(e) => kalemGuncelle(i, { siparisKodu: e.target.value })} placeholder="S55180-A160" /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Adet")}</Label><Input type="number" min="0" value={k.adet} onChange={(e) => kalemGuncelle(i, { adet: e.target.value })} placeholder="1" /></div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("Birim")}</Label>
                <select value={k.birim} onChange={(e) => kalemGuncelle(i, { birim: e.target.value })} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50">{BIRIMLER.map((b) => <option key={b} value={b}>{t(b)}</option>)}</select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("Ürün Durumu")}</Label>
                <select value={k.urunDurumu} onChange={(e) => kalemGuncelle(i, { urunDurumu: e.target.value as UrunDurumu })} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50">{URUN_DURUMU.map((u) => <option key={u.v} value={u.v}>{t(u.e)}</option>)}</select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{t("Kapsam")}</Label>
                <select value={k.kapsam} onChange={(e) => kalemGuncelle(i, { kapsam: e.target.value as Kapsam })} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50">{KAPSAM.map((u) => <option key={u.v} value={u.v}>{t(u.e)}</option>)}</select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("Teknik Açıklama")}</Label>
              <Textarea value={k.teknikAciklama} onChange={(e) => kalemGuncelle(i, { teknikAciklama: e.target.value })} rows={2} placeholder={t("Voltaj, güç, bağlantı ölçüsü vb.")} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={k.alternatifKabul} onChange={(e) => kalemGuncelle(i, { alternatifKabul: e.target.checked })} className="size-4 rounded border-input" />
              {t("Alternatif/muadil ürün kabul edilir")}
            </label>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" className="w-full gap-1.5 border-dashed bg-card" onClick={() => setKalemler((o) => [...o, bosKalem()])}>
        <Icon icon="solar:add-circle-linear" className="size-4" />{t("Kalem Ekle")}
      </Button>

      <div className="flex justify-end gap-2">
        <Button variant="outline" nativeButton={false} render={<Link href="/satinalma/talepler" />}>{t("İptal")}</Button>
        <Button className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" disabled={kaydediliyor || yukleniyorFoto} onClick={kaydet}>
          <Icon icon={kaydediliyor ? "svg-spinners:180-ring" : "solar:diskette-bold-duotone"} className="size-4" />{t("Talebi Oluştur")}
        </Button>
      </div>
    </div>
  );
}
