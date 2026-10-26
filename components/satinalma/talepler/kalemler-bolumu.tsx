"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { useTalepKalemler } from "@/lib/queries/satinalma";
import { kalemEkle, kalemGuncelle, kalemSil } from "@/lib/data/satinalma/kalemler";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import type { Kapsam, Talep, TalepKalem, UrunDurumu } from "@/lib/types/satinalma";

const URUN_DURUMU: { v: UrunDurumu; e: string }[] = [
  { v: "yeni", e: "Yeni / Orijinal" }, { v: "ikinci_el_kabul", e: "İkinci el kabul" }, { v: "farketmez", e: "Farketmez" },
];
const KAPSAM: { v: Kapsam; e: string }[] = [
  { v: "parca", e: "Yalnızca parça" }, { v: "komple", e: "Komple montaj" }, { v: "farketmez", e: "Farketmez" },
];
const URUN_DURUMU_ET: Record<UrunDurumu, string> = { yeni: "Yeni / Orijinal", ikinci_el_kabul: "İkinci el kabul", farketmez: "Durum farketmez" };
const KAPSAM_ET: Record<Kapsam, string> = { parca: "Yalnızca parça", komple: "Komple montaj", farketmez: "Kapsam farketmez" };

export function KalemlerBolumu({ talep }: { talep: Talep }) {
  const { t } = useDil();
  const qc = useQueryClient();
  const { data: kalemler, isLoading } = useTalepKalemler(talep.id);
  const [sheetAcik, setSheetAcik] = React.useState(false);
  const [duzenlenen, setDuzenlenen] = React.useState<TalepKalem | null>(null);

  function tazele() {
    qc.invalidateQueries({ queryKey: queryKeys.satinalma.talepKalemler(talep.id) });
    qc.invalidateQueries({ queryKey: queryKeys.satinalma.talepler });
  }
  function yeni() { setDuzenlenen(null); setSheetAcik(true); }
  function duzenle(k: TalepKalem) { setDuzenlenen(k); setSheetAcik(true); }
  async function sil(id: string) {
    try { await kalemSil(id); toast.success(t("Kalem silindi")); tazele(); }
    catch (e) { toast.error(t("Silinemedi"), { description: e instanceof Error ? e.message : undefined }); }
  }

  const liste = kalemler ?? [];
  const legacyVar = liste.length === 0 && (talep.marka || talep.model || talep.teknikAciklama);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <h3 className="font-heading text-base font-bold tracking-tight">{t("Kalemler")}{liste.length > 0 ? ` (${liste.length})` : ""}</h3>
        <Button size="sm" className="shrink-0 gap-1.5 bg-orange-600 text-white hover:bg-orange-700" onClick={yeni}><Icon icon="solar:add-circle-bold" className="size-4" />{t("Kalem Ekle")}</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">{t("Yükleniyor…")}</p>
        ) : liste.length === 0 ? (
          legacyVar ? (
            <div className="rounded-xl border p-4">
              <p className="mb-2 text-xs text-amber-600 dark:text-amber-400">{t("Bu eski talep tek kalemli oluşturulmuş. Kalem olarak düzenlemek için “Kalem Ekle”yi kullanın.")}</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div><dt className="text-xs text-muted-foreground">{t("Marka")}</dt><dd className="font-medium">{talep.marka || "—"}</dd></div>
                <div><dt className="text-xs text-muted-foreground">{t("Model")}</dt><dd className="font-medium">{talep.model || "—"}</dd></div>
                {talep.adet != null ? <div><dt className="text-xs text-muted-foreground">{t("Adet")}</dt><dd className="font-medium">{talep.adet} {talep.birim ?? ""}</dd></div> : null}
              </dl>
              {talep.teknikAciklama ? <p className="mt-2 border-t pt-2 text-sm whitespace-pre-wrap">{talep.teknikAciklama}</p> : null}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">{t("Henüz kalem yok. “Kalem Ekle” ile ürün ekleyin.")}</p>
          )
        ) : (
          liste.map((k) => (
            <div key={k.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">{k.sira}. {k.ad}</p>
                  <p className="text-[11px] text-muted-foreground">{[k.marka, k.model, k.siparisKodu].filter(Boolean).join(" · ") || "—"}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Link href={`/satinalma/tedarikciler?q=${encodeURIComponent([k.marka, k.siparisKodu || k.model, k.ad, "tedarikçi"].filter(Boolean).join(" "))}`} title={t("Tedarikçi Ara")} className="flex size-7 items-center justify-center rounded-md text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-950"><Icon icon="solar:magnifer-linear" className="size-4" /></Link>
                  <button type="button" onClick={() => duzenle(k)} aria-label={t("Düzenle")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Icon icon="solar:pen-linear" className="size-4" /></button>
                  <button type="button" onClick={() => sil(k.id)} aria-label={t("Sil")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"><Icon icon="solar:trash-bin-trash-linear" className="size-4" /></button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                {k.adet != null ? <span className="rounded-md bg-muted px-2 py-0.5">{k.adet} {k.birim ?? ""}</span> : null}
                <span className="rounded-md bg-muted px-2 py-0.5">{t(URUN_DURUMU_ET[k.urunDurumu])}</span>
                <span className="rounded-md bg-muted px-2 py-0.5">{t(KAPSAM_ET[k.kapsam])}</span>
                {k.alternatifKabul ? <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{t("Alternatif kabul")}</span> : null}
              </div>
              {k.teknikAciklama ? <p className="mt-2 text-sm text-muted-foreground">{k.teknikAciklama}</p> : null}
            </div>
          ))
        )}
      </CardContent>

      <KalemSheet acik={sheetAcik} setAcik={setSheetAcik} talepId={talep.id} sira={liste.length + 1} duzenlenen={duzenlenen} onKaydet={tazele} />
    </Card>
  );
}

function KalemSheet({ acik, setAcik, talepId, sira, duzenlenen, onKaydet }: {
  acik: boolean; setAcik: (o: boolean) => void; talepId: string; sira: number; duzenlenen: TalepKalem | null; onKaydet: () => void;
}) {
  const { t } = useDil();
  const [ad, setAd] = React.useState("");
  const [marka, setMarka] = React.useState("");
  const [model, setModel] = React.useState("");
  const [kod, setKod] = React.useState("");
  const [adet, setAdet] = React.useState("");
  const [birim, setBirim] = React.useState("adet");
  const [urunDurumu, setUrunDurumu] = React.useState<UrunDurumu>("farketmez");
  const [kapsam, setKapsam] = React.useState<Kapsam>("farketmez");
  const [alternatif, setAlternatif] = React.useState(false);
  const [teknik, setTeknik] = React.useState("");
  const [kaydediliyor, setKaydediliyor] = React.useState(false);

  React.useEffect(() => {
    if (!acik) return;
    const k = duzenlenen;
    setAd(k?.ad ?? ""); setMarka(k?.marka ?? ""); setModel(k?.model ?? ""); setKod(k?.siparisKodu ?? "");
    setAdet(k?.adet != null ? String(k.adet) : ""); setBirim(k?.birim ?? "adet");
    setUrunDurumu(k?.urunDurumu ?? "farketmez"); setKapsam(k?.kapsam ?? "farketmez");
    setAlternatif(k?.alternatifKabul ?? false); setTeknik(k?.teknikAciklama ?? "");
  }, [acik, duzenlenen]);

  async function kaydet() {
    if (!ad.trim()) { toast.error(t("Ürün adı gerekli.")); return; }
    if (kaydediliyor) return;
    setKaydediliyor(true);
    const girdi = { ad: ad.trim(), marka: marka.trim() || null, model: model.trim() || null, siparisKodu: kod.trim() || null, adet: adet ? Number(adet) : null, birim, urunDurumu, kapsam, alternatifKabul: alternatif, teknikAciklama: teknik.trim() || null };
    try {
      if (duzenlenen) { await kalemGuncelle(duzenlenen.id, girdi); toast.success(t("Kalem güncellendi")); }
      else { await kalemEkle(talepId, girdi, sira); toast.success(t("Kalem eklendi")); }
      onKaydet();
      setAcik(false);
    } catch (e) {
      toast.error(t("Kaydedilemedi"), { description: e instanceof Error ? e.message : undefined });
    } finally {
      setKaydediliyor(false);
    }
  }

  return (
    <Sheet open={acik} onOpenChange={setAcik}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{duzenlenen ? t("Kalem Düzenle") : t("Yeni Kalem")}</SheetTitle>
          <SheetDescription>{t("Ürün kalemi bilgileri.")}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Ürün Adı")} *</Label><Input value={ad} onChange={(e) => setAd(e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Marka")}</Label><Input value={marka} onChange={(e) => setMarka(e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Model")}</Label><Input value={model} onChange={(e) => setModel(e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Sipariş Kodu")}</Label><Input value={kod} onChange={(e) => setKod(e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Adet")}</Label><Input type="number" min="0" value={adet} onChange={(e) => setAdet(e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Birim")}</Label><Input value={birim} onChange={(e) => setBirim(e.target.value)} /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("Ürün Durumu")}</Label>
              <select value={urunDurumu} onChange={(e) => setUrunDurumu(e.target.value as UrunDurumu)} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none">{URUN_DURUMU.map((u) => <option key={u.v} value={u.v}>{t(u.e)}</option>)}</select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("Kapsam")}</Label>
              <select value={kapsam} onChange={(e) => setKapsam(e.target.value as Kapsam)} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none">{KAPSAM.map((u) => <option key={u.v} value={u.v}>{t(u.e)}</option>)}</select>
            </div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Teknik Açıklama")}</Label><Textarea value={teknik} onChange={(e) => setTeknik(e.target.value)} rows={3} /></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={alternatif} onChange={(e) => setAlternatif(e.target.checked)} className="size-4 rounded border-input" />{t("Alternatif/muadil ürün kabul edilir")}</label>
        </div>
        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>{t("İptal")}</SheetClose>
          <Button className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" disabled={kaydediliyor} onClick={kaydet}><Icon icon={kaydediliyor ? "svg-spinners:180-ring" : "solar:diskette-bold-duotone"} className="size-4" />{t("Kaydet")}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
