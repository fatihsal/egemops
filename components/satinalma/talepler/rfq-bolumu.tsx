"use client";

import * as React from "react";
import { createPortal } from "react-dom";
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
import { useDil } from "@/components/providers/dil-provider";
import { useTalepRfq, useTedarikciler, useFirmaProfili, useTalepKalemler } from "@/lib/queries/satinalma";
import { rfqOlustur, rfqGuncelle, rfqSil } from "@/lib/data/satinalma/rfq";
import { tedarikciOlustur } from "@/lib/data/satinalma/tedarikciler";
import { imzaUret } from "@/lib/data/satinalma/ayarlar";
import { rfqIcerikHash } from "@/lib/satinalma/rfq-hash";
import { varsayilanKonu, govdeUret, SABLONLAR, type SablonAnahtar } from "@/lib/satinalma/rfq-sablonlar";
import { alanAdiCikar, type AramaSonucu } from "@/lib/satinalma/arama/types";
import { kategoriTahmin } from "@/lib/satinalma/kategori";
import { KATEGORILER, KATEGORI_META } from "@/components/satinalma/stiller";
import { queryKeys } from "@/lib/queries/keys";
import { cn } from "@/lib/utils";
import { RFQ_DURUM_META } from "@/components/satinalma/stiller";
import type { Rfq, Talep, TalepKalem, Tedarikci } from "@/lib/types/satinalma";

export function RfqBolumu({ talep }: { talep: Talep }) {
  const { t } = useDil();
  const qc = useQueryClient();
  const { data: rfqlar, isLoading } = useTalepRfq(talep.id);
  const { data: tedarikciler } = useTedarikciler();
  const { data: kalemler } = useTalepKalemler(talep.id);
  const { data: profil } = useFirmaProfili();
  const imza = profil ? imzaUret(profil) : "Saygılarımızla,";

  const [sheetAcik, setSheetAcik] = React.useState(false);
  const [duzenlenen, setDuzenlenen] = React.useState<Rfq | null>(null);
  const [onaylanacak, setOnaylanacak] = React.useState<Rfq | null>(null);
  const [topluCreateAcik, setTopluCreateAcik] = React.useState(false);
  const [topluGonderAcik, setTopluGonderAcik] = React.useState(false);
  const [araRfqAcik, setAraRfqAcik] = React.useState(false);
  const [gonderiliyorTek, setGonderiliyorTek] = React.useState(false);

  function tazele() { qc.invalidateQueries({ queryKey: queryKeys.satinalma.talepRfq(talep.id) }); }
  function tazeleHepsi() { tazele(); qc.invalidateQueries({ queryKey: queryKeys.satinalma.tedarikciler }); }

  const ilkKalem = (kalemler ?? [])[0];
  const ilkSorgu = ilkKalem ? [ilkKalem.marka, ilkKalem.siparisKodu || ilkKalem.model, ilkKalem.ad, "tedarikçi"].filter(Boolean).join(" ") : [talep.baslik, "tedarikçi"].filter(Boolean).join(" ");
  function yeni() { setDuzenlenen(null); setSheetAcik(true); }
  function duzenle(r: Rfq) { setDuzenlenen(r); setSheetAcik(true); }

  async function durumToggle(r: Rfq) {
    try { await rfqGuncelle(r.id, { durum: r.durum === "taslak" ? "onay_bekliyor" : "taslak" }); tazele(); }
    catch (e) { toast.error(t("Güncellenemedi"), { description: e instanceof Error ? e.message : undefined }); }
  }
  async function sil(id: string) {
    try { await rfqSil(id); toast.success(t("Teklif talebi silindi")); tazele(); }
    catch (e) { toast.error(t("Silinemedi"), { description: e instanceof Error ? e.message : undefined }); }
  }

  // İçeriğe bağlı onaylı gönderim (tek).
  async function gonderTek(r: Rfq): Promise<{ ok: boolean; hata?: string }> {
    const hash = rfqIcerikHash(r.aliciEposta, r.konu, r.govde);
    try {
      const resp = await fetch("/api/satinalma/rfq-gonder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rfqId: r.id, onayHash: hash }) });
      const metin = await resp.text();
      const sonuc = metin ? JSON.parse(metin) : {};
      if (!resp.ok) return { ok: false, hata: sonuc?.hata ?? `HTTP ${resp.status}` };
      return { ok: true };
    } catch (e) {
      return { ok: false, hata: e instanceof Error ? e.message : "Ağ hatası" };
    }
  }

  async function onayliGonder() {
    if (!onaylanacak || gonderiliyorTek) return;
    setGonderiliyorTek(true);
    const r = await gonderTek(onaylanacak);
    setGonderiliyorTek(false);
    if (r.ok) { toast.success(t("Teklif e-postası gönderildi")); setOnaylanacak(null); tazele(); }
    else toast.error(t("Gönderilemedi"), { description: r.hata });
  }

  const liste = rfqlar ?? [];
  const tedAd = (id: string | null) => tedarikciler?.find((x) => x.id === id)?.ad;
  const gonderilebilir = liste.filter((r) => (r.durum === "taslak" || r.durum === "onay_bekliyor") && r.aliciEposta);

  return (
    <Card>
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">
        <div>
          <h3 className="font-heading text-base font-bold tracking-tight">{t("Teklif Talepleri")}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("Her tedarikçiye ayrı e-posta gider (birbirlerini görmezler). Gönderim öncesi içeriği önizleyip onaylarsınız.")}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button size="sm" className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" onClick={() => setAraRfqAcik(true)}><Icon icon="solar:magnifer-bold" className="size-4" />{t("Tedarikçi Ara & Teklif Talebi")}</Button>
          {(tedarikciler?.length ?? 0) > 0 ? (
            <Button size="sm" variant="outline" className="gap-1.5 bg-card" onClick={() => setTopluCreateAcik(true)}><Icon icon="solar:users-group-rounded-bold" className="size-4" />{t("Kayıtlılardan")}</Button>
          ) : null}
          <Button size="sm" variant="outline" className="gap-1.5 bg-card" onClick={yeni}><Icon icon="solar:letter-opened-bold" className="size-4" />{t("Tekil")}</Button>
        </div>
      </CardHeader>
      <CardContent>
        {gonderilebilir.length > 0 ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-200/70 bg-emerald-50/50 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <span className="text-sm">{gonderilebilir.length} {t("teklif talebi gönderilmeye hazır")}</span>
            <Button size="sm" className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setTopluGonderAcik(true)}><Icon icon="solar:plain-2-bold" className="size-4" />{t("Onayla ve Toplu Gönder")}</Button>
          </div>
        ) : null}

        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t("Yükleniyor…")}</p>
        ) : liste.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t("Henüz teklif talebi yok. Bir tedarikçi için taslak oluşturun.")}</p>
        ) : (
          <div className="space-y-2">
            {liste.map((r) => {
              const dm = RFQ_DURUM_META[r.durum];
              const gonderilebilirMi = (r.durum === "taslak" || r.durum === "onay_bekliyor") && !!r.aliciEposta;
              return (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Icon icon="solar:letter-bold-duotone" className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.konu || t("(konu yok)")}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{tedAd(r.tedarikciId) || t("Tedarikçi seçilmedi")}{r.aliciEposta ? ` · ${r.aliciEposta}` : ` · ${t("alıcı yok")}`}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium", dm.sinif)}>{t(dm.etiket)}</span>
                  {(r.durum === "taslak" || r.durum === "onay_bekliyor") ? (
                    <>
                      <button type="button" onClick={() => durumToggle(r)} title={t(r.durum === "taslak" ? "Onaya Al" : "Taslağa Al")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Icon icon={r.durum === "taslak" ? "solar:check-circle-linear" : "solar:undo-left-linear"} className="size-4" /></button>
                      <Button size="sm" className="h-7 gap-1 bg-emerald-600 px-2 text-xs text-white hover:bg-emerald-700 disabled:opacity-50" disabled={!gonderilebilirMi} onClick={() => setOnaylanacak(r)}><Icon icon="solar:plain-2-bold" className="size-3.5" />{t("Gönder")}</Button>
                    </>
                  ) : null}
                  <button type="button" onClick={() => duzenle(r)} aria-label={t("Düzenle")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Icon icon="solar:pen-linear" className="size-4" /></button>
                  <button type="button" onClick={() => sil(r.id)} aria-label={t("Sil")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"><Icon icon="solar:trash-bin-trash-linear" className="size-4" /></button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <RfqSheet acik={sheetAcik} setAcik={setSheetAcik} talep={talep} tedarikciler={tedarikciler ?? []} kalemler={kalemler ?? []} duzenlenen={duzenlenen} imza={imza} onKaydet={tazele} />
      <TopluRfqSheet acik={topluCreateAcik} setAcik={setTopluCreateAcik} talep={talep} tedarikciler={tedarikciler ?? []} kalemler={kalemler ?? []} mevcutRfq={liste} imza={imza} onKaydet={tazele} />
      <AraRfqSheet acik={araRfqAcik} setAcik={setAraRfqAcik} talep={talep} tedarikciler={tedarikciler ?? []} kalemler={kalemler ?? []} mevcutRfq={liste} imza={imza} ilkSorgu={ilkSorgu} onKaydet={tazeleHepsi} />
      {onaylanacak ? <GonderOnayModal rfq={onaylanacak} tedAd={tedAd(onaylanacak.tedarikciId)} gonderiliyor={gonderiliyorTek} onOnayla={onayliGonder} onKapat={() => setOnaylanacak(null)} /> : null}
      {topluGonderAcik ? <TopluGonderModal rfqlar={gonderilebilir} tedAd={tedAd} gonderTek={gonderTek} onBitti={tazele} onKapat={() => setTopluGonderAcik(false)} /> : null}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Tek RFQ önizleme + onay (içerik-hash onayla gönderime bağlanır)
// ---------------------------------------------------------------------------
function GonderOnayModal({ rfq, tedAd, gonderiliyor, onOnayla, onKapat }: { rfq: Rfq; tedAd?: string; gonderiliyor: boolean; onOnayla: () => void; onKapat: () => void }) {
  const { t } = useDil();
  if (typeof document === "undefined") return null;
  return createPortal(
    <div role="dialog" aria-modal className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onKapat}>
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-4"><h3 className="font-heading font-bold">{t("Gönderim Önizleme")}</h3><button type="button" onClick={onKapat} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"><Icon icon="solar:close-circle-linear" className="size-5" /></button></div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
          <div className="grid grid-cols-[80px_1fr] gap-y-1.5">
            <span className="text-muted-foreground">{t("Gönderen")}</span><span>{t("Bağlı Gmail hesabı")}</span>
            <span className="text-muted-foreground">{t("Alıcı")}</span><span className="font-medium break-all">{rfq.aliciEposta || "—"}{tedAd ? ` (${tedAd})` : ""}</span>
            <span className="text-muted-foreground">{t("Konu")}</span><span className="font-medium">{rfq.konu}</span>
          </div>
          <div className="rounded-lg border bg-muted/30 p-3 whitespace-pre-wrap">{rfq.govde}</div>
          <p className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400"><Icon icon="solar:shield-check-bold" className="mt-0.5 size-3.5 shrink-0" />{t("Onay bu içeriğe ve alıcıya bağlıdır. Sonradan değişirse yeniden onay gerekir.")}</p>
        </div>
        <div className="flex justify-end gap-2 border-t p-4">
          <Button variant="outline" onClick={onKapat}>{t("İptal")}</Button>
          <Button className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700" disabled={gonderiliyor || !rfq.aliciEposta} onClick={onOnayla}><Icon icon={gonderiliyor ? "svg-spinners:180-ring" : "solar:plain-2-bold"} className="size-4" />{t("Onayla ve Gönder")}</Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Toplu gönderim — tek onay, alıcı bazında sonuç (başarılı tekrar gönderilmez)
// ---------------------------------------------------------------------------
type GonderimSonuc = "bekliyor" | "gonderiliyor" | "ok" | "hata";
function TopluGonderModal({ rfqlar, tedAd, gonderTek, onBitti, onKapat }: { rfqlar: Rfq[]; tedAd: (id: string | null) => string | undefined; gonderTek: (r: Rfq) => Promise<{ ok: boolean; hata?: string }>; onBitti: () => void; onKapat: () => void }) {
  const { t } = useDil();
  const [onayli, setOnayli] = React.useState(false);
  const [calisiyor, setCalisiyor] = React.useState(false);
  const [bitti, setBitti] = React.useState(false);
  const [sonuc, setSonuc] = React.useState<Record<string, { durum: GonderimSonuc; hata?: string }>>({});

  async function basla() {
    if (!onayli || calisiyor) return;
    setCalisiyor(true);
    for (const r of rfqlar) {
      if (sonuc[r.id]?.durum === "ok") continue; // başarılıyı tekrar gönderme
      setSonuc((o) => ({ ...o, [r.id]: { durum: "gonderiliyor" } }));
      const res = await gonderTek(r);
      setSonuc((o) => ({ ...o, [r.id]: { durum: res.ok ? "ok" : "hata", hata: res.hata } }));
    }
    setCalisiyor(false);
    setBitti(true);
    onBitti();
  }

  const ikon: Record<GonderimSonuc, string> = { bekliyor: "solar:clock-circle-linear", gonderiliyor: "svg-spinners:180-ring", ok: "solar:check-circle-bold", hata: "solar:close-circle-bold" };
  const renk: Record<GonderimSonuc, string> = { bekliyor: "text-muted-foreground", gonderiliyor: "text-blue-500", ok: "text-emerald-500", hata: "text-red-500" };

  if (typeof document === "undefined") return null;
  return createPortal(
    <div role="dialog" aria-modal className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onKapat}>
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-4"><h3 className="font-heading font-bold">{t("Toplu Gönderim")} ({rfqlar.length})</h3><button type="button" onClick={onKapat} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"><Icon icon="solar:close-circle-linear" className="size-5" /></button></div>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          <p className="mb-1 text-sm text-muted-foreground">{t("Her tedarikçiye ayrı e-posta gönderilir. Aşağıdaki alıcıları ve içerikleri onaylıyorsunuz.")}</p>
          {rfqlar.map((r) => {
            const s = sonuc[r.id]?.durum ?? "bekliyor";
            return (
              <div key={r.id} className="flex items-center gap-2 rounded-lg border p-2.5 text-sm">
                <Icon icon={ikon[s]} className={cn("size-4 shrink-0", renk[s])} />
                <div className="min-w-0 flex-1"><p className="truncate font-medium">{tedAd(r.tedarikciId) || t("Tedarikçi")}</p><p className="truncate text-[11px] text-muted-foreground">{r.aliciEposta}{sonuc[r.id]?.hata ? ` · ${sonuc[r.id]?.hata}` : ""}</p></div>
              </div>
            );
          })}
        </div>
        <div className="space-y-2 border-t p-4">
          {!bitti ? (
            <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={onayli} onChange={(e) => setOnayli(e.target.checked)} disabled={calisiyor} className="mt-0.5 size-4 rounded border-input" />{t("Yukarıdaki alıcılara ve içeriklere gerçek e-posta gönderilmesini onaylıyorum.")}</label>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onKapat}>{t(bitti ? "Kapat" : "İptal")}</Button>
            {!bitti ? <Button className="gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700" disabled={!onayli || calisiyor} onClick={basla}><Icon icon={calisiyor ? "svg-spinners:180-ring" : "solar:plain-2-bold"} className="size-4" />{t("Gönder")}</Button> : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Toplu RFQ oluştur — firma seç/hariç (her biri ayrı taslak RFQ)
// ---------------------------------------------------------------------------
function TopluRfqSheet({ acik, setAcik, talep, tedarikciler, kalemler, mevcutRfq, imza, onKaydet }: {
  acik: boolean; setAcik: (o: boolean) => void; talep: Talep; tedarikciler: Tedarikci[]; kalemler: TalepKalem[]; mevcutRfq: Rfq[]; imza: string; onKaydet: () => void;
}) {
  const { t } = useDil();
  const zatenVar = new Set(mevcutRfq.map((r) => r.tedarikciId).filter(Boolean) as string[]);
  const [secili, setSecili] = React.useState<Set<string>>(new Set());
  const [sablon, setSablon] = React.useState<SablonAnahtar>("standart");
  const [katFiltre, setKatFiltre] = React.useState("hepsi");
  const [kaydediliyor, setKaydediliyor] = React.useState(false);
  const kullanilanKats = Array.from(new Set(tedarikciler.flatMap((x) => x.kategoriler)));
  const gosterilecek = katFiltre === "hepsi" ? tedarikciler : tedarikciler.filter((x) => x.kategoriler.includes(katFiltre));

  React.useEffect(() => {
    if (acik) setSecili(new Set(tedarikciler.filter((x) => !zatenVar.has(x.id)).map((x) => x.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acik]);

  function degistir(id: string) {
    setSecili((o) => { const n = new Set(o); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }

  async function olustur() {
    const hedef = tedarikciler.filter((x) => secili.has(x.id) && !zatenVar.has(x.id));
    if (hedef.length === 0) { toast.error(t("En az bir tedarikçi seçin.")); return; }
    if (kaydediliyor) return;
    setKaydediliyor(true);
    try {
      for (const ted of hedef) {
        await rfqOlustur({ talepId: talep.id, tedarikciId: ted.id, konu: varsayilanKonu(talep), govde: govdeUret(sablon, { talep, imza, kalemler, tedAd: ted.ad }), aliciEposta: ted.eposta ?? null });
      }
      toast.success(`${hedef.length} ${t("teklif talebi taslağı oluşturuldu")}`);
      onKaydet();
      setAcik(false);
    } catch (e) {
      toast.error(t("Oluşturulamadı"), { description: e instanceof Error ? e.message : undefined });
    } finally {
      setKaydediliyor(false);
    }
  }

  return (
    <Sheet open={acik} onOpenChange={setAcik}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{t("Toplu Teklif Talebi Oluştur")}</SheetTitle>
          <SheetDescription>{t("Göndermek istemediğin firmaların işaretini kaldır (yalnızca bu talep için hariç tutulur). Her firma için ayrı taslak oluşturulur.")}</SheetDescription>
        </SheetHeader>
        <div className="border-b p-4">
          <Label className="text-xs text-muted-foreground">{t("E-posta Şablonu")}</Label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {SABLONLAR.map((s) => (
              <button key={s.anahtar} type="button" onClick={() => setSablon(s.anahtar)} title={t(s.aciklama)} className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", sablon === s.anahtar ? "border-orange-500 bg-orange-500 text-white" : "bg-card hover:bg-muted")}>{t(s.ad)}</button>
            ))}
          </div>
        </div>
        {kullanilanKats.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5 border-b px-4 py-2.5">
            <span className="text-xs text-muted-foreground">{t("Kategori")}:</span>
            <button type="button" onClick={() => setKatFiltre("hepsi")} className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", katFiltre === "hepsi" ? "border-orange-500 bg-orange-500 text-white" : "bg-card hover:bg-muted")}>{t("Tümü")}</button>
            {KATEGORILER.filter((k) => kullanilanKats.includes(k.anahtar)).map((k) => (
              <button key={k.anahtar} type="button" onClick={() => setKatFiltre(k.anahtar)} className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", katFiltre === k.anahtar ? "border-orange-500 bg-orange-500 text-white" : "bg-card hover:bg-muted")}>{k.ad}</button>
            ))}
          </div>
        ) : null}
        <div className="flex-1 space-y-1 overflow-y-auto p-4">
          {tedarikciler.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("Önce tedarikçi ekleyin.")}</p>
          ) : gosterilecek.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("Bu kategoride tedarikçi yok.")}</p>
          ) : gosterilecek.map((x) => {
            const eklendi = zatenVar.has(x.id);
            return (
              <label key={x.id} className={cn("flex items-center gap-3 rounded-lg border p-2.5 text-sm", eklendi && "opacity-50")}>
                <input type="checkbox" checked={eklendi ? true : secili.has(x.id)} disabled={eklendi || !x.eposta} onChange={() => degistir(x.id)} className="size-4 rounded border-input" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{x.ad}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{x.eposta || t("e-posta yok — gönderilemez")}</p>
                  {x.kategoriler.length ? <div className="mt-1 flex flex-wrap gap-1">{x.kategoriler.map((k) => <span key={k} className={cn("rounded px-1.5 py-0.5 text-[9px] font-medium", KATEGORI_META[k]?.sinif ?? "bg-muted")}>{KATEGORI_META[k]?.ad ?? k}</span>)}</div> : null}
                </div>
                {eklendi ? <span className="shrink-0 text-[11px] text-muted-foreground">{t("zaten eklendi")}</span> : null}
              </label>
            );
          })}
        </div>
        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>{t("İptal")}</SheetClose>
          <Button className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" disabled={kaydediliyor} onClick={olustur}><Icon icon={kaydediliyor ? "svg-spinners:180-ring" : "solar:letter-opened-bold"} className="size-4" />{t("Taslakları Oluştur")}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Tedarikçi Ara & Teklif Talebi — tek akışta: ara → çoklu seç → e-posta bul + kaydet + RFQ
// ---------------------------------------------------------------------------
type AraDurum = "islen" | "ok" | "epostasiz" | "zaten" | "hata";
function AraRfqSheet({ acik, setAcik, talep, tedarikciler, kalemler, mevcutRfq, imza, ilkSorgu, onKaydet }: {
  acik: boolean; setAcik: (o: boolean) => void; talep: Talep; tedarikciler: Tedarikci[]; kalemler: TalepKalem[]; mevcutRfq: Rfq[]; imza: string; ilkSorgu: string; onKaydet: () => void;
}) {
  const { t } = useDil();
  const [sorgu, setSorgu] = React.useState(ilkSorgu);
  const [araniyor, setAraniyor] = React.useState(false);
  const [sonuclar, setSonuclar] = React.useState<AramaSonucu[] | null>(null);
  const [secili, setSecili] = React.useState<Set<string>>(new Set());
  const [sablon, setSablon] = React.useState<SablonAnahtar>("standart");
  const [olusturuluyor, setOlusturuluyor] = React.useState(false);
  const [dahaAraniyor, setDahaAraniyor] = React.useState(false);
  const [durumlar, setDurumlar] = React.useState<Record<string, { durum: AraDurum; not?: string }>>({});

  React.useEffect(() => { if (acik) { setSorgu(ilkSorgu); setSonuclar(null); setSecili(new Set()); setDurumlar({}); } }, [acik, ilkSorgu]);

  const dom = (u: string | null | undefined) => (u ? alanAdiCikar(u).replace(/^www\./, "").toLowerCase() : "");
  const rfqOlanIdler = new Set(mevcutRfq.map((r) => r.tedarikciId).filter(Boolean) as string[]);
  const rfqDomainleri = new Set(tedarikciler.filter((x) => rfqOlanIdler.has(x.id)).flatMap((x) => [dom(x.kaynakUrl), dom(x.webSitesi)]).filter(Boolean));

  async function ara() {
    if (!sorgu.trim() || araniyor) return;
    setAraniyor(true); setSonuclar(null); setDurumlar({});
    try {
      const r = await fetch("/api/satinalma/tedarikci-ara", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sorgu: sorgu.trim() }) });
      const metin = await r.text(); const sonuc = metin ? JSON.parse(metin) : {};
      if (!r.ok) { toast.error(t("Arama başarısız"), { description: sonuc?.hata ?? `HTTP ${r.status}` }); return; }
      const liste: AramaSonucu[] = sonuc.sonuclar ?? [];
      setSonuclar(liste);
      // Zaten RFQ'su olmayanları varsayılan seç.
      setSecili(new Set(liste.filter((x) => !rfqDomainleri.has(dom(x.url))).map((x) => x.url)));
    } catch (e) {
      toast.error(t("Arama başarısız"), { description: e instanceof Error ? e.message : undefined });
    } finally { setAraniyor(false); }
  }

  async function dahaFazla() {
    if (dahaAraniyor || !sonuclar) return;
    setDahaAraniyor(true);
    try {
      const haric = sonuclar.map((x) => x.alanAdi);
      const r = await fetch("/api/satinalma/tedarikci-ara", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sorgu: sorgu.trim(), haric }) });
      const metin = await r.text(); const sonuc = metin ? JSON.parse(metin) : {};
      if (!r.ok) { toast.error(t("Arama başarısız"), { description: sonuc?.hata ?? `HTTP ${r.status}` }); return; }
      const yeni: AramaSonucu[] = sonuc.sonuclar ?? [];
      if (yeni.length === 0) { toast(t("Daha fazla sonuç bulunamadı.")); return; }
      setSonuclar((o) => [...(o ?? []), ...yeni]);
      setSecili((o) => { const n = new Set(o); yeni.forEach((x) => { if (!rfqDomainleri.has(dom(x.url))) n.add(x.url); }); return n; });
    } catch (e) {
      toast.error(t("Arama başarısız"), { description: e instanceof Error ? e.message : undefined });
    } finally { setDahaAraniyor(false); }
  }

  function toggle(url: string) { setSecili((o) => { const n = new Set(o); if (n.has(url)) n.delete(url); else n.add(url); return n; }); }

  async function olustur() {
    const hedef = (sonuclar ?? []).filter((r) => secili.has(r.url));
    if (hedef.length === 0) { toast.error(t("En az bir firma seçin.")); return; }
    if (olusturuluyor) return;
    setOlusturuluyor(true);
    let basarili = 0;
    for (const r of hedef) {
      const d = dom(r.url);
      if (rfqDomainleri.has(d)) { setDurumlar((o) => ({ ...o, [r.url]: { durum: "zaten" } })); continue; }
      setDurumlar((o) => ({ ...o, [r.url]: { durum: "islen" } }));
      try {
        let tedId: string; let tedAd = r.baslik; let tedEposta: string | null = null;
        const mevcut = tedarikciler.find((x) => dom(x.kaynakUrl) === d || dom(x.webSitesi) === d);
        if (mevcut) { tedId = mevcut.id; tedAd = mevcut.ad; tedEposta = mevcut.eposta; }
        else {
          let eposta: string | null = null; let telefon: string | null = null;
          try {
            const il = await fetch("/api/satinalma/tedarikci-iletisim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: r.url }) });
            if (il.ok) { const dj = await il.json(); eposta = dj.epostalar?.[0]?.eposta ?? null; telefon = (dj.telefonlar ?? [])[0] ?? null; }
          } catch { /* iletişim bulunamazsa devam */ }
          tedId = await tedarikciOlustur({ ad: r.baslik.slice(0, 120), kaynakUrl: r.url, webSitesi: `https://${r.alanAdi}`, eposta, telefon, notlar: r.ozet?.slice(0, 400) || null, kategoriler: kategoriTahmin(`${r.baslik} ${r.ozet ?? ""}`) });
          tedEposta = eposta;
        }
        await rfqOlustur({ talepId: talep.id, tedarikciId: tedId, konu: varsayilanKonu(talep), govde: govdeUret(sablon, { talep, imza, kalemler, tedAd }), aliciEposta: tedEposta });
        setDurumlar((o) => ({ ...o, [r.url]: { durum: tedEposta ? "ok" : "epostasiz" } }));
        basarili++;
      } catch (e) {
        setDurumlar((o) => ({ ...o, [r.url]: { durum: "hata", not: e instanceof Error ? e.message : undefined } }));
      }
    }
    setOlusturuluyor(false);
    onKaydet();
    if (basarili > 0) toast.success(`${basarili} ${t("teklif talebi taslağı oluşturuldu")}`);
  }

  const dmeta: Record<AraDurum, { ik: string; renk: string; et: string }> = {
    islen: { ik: "svg-spinners:180-ring", renk: "text-blue-500", et: "" },
    ok: { ik: "solar:check-circle-bold", renk: "text-emerald-500", et: "Talep + e-posta" },
    epostasiz: { ik: "solar:letter-unread-linear", renk: "text-amber-500", et: "Talep (e-posta yok)" },
    zaten: { ik: "solar:info-circle-linear", renk: "text-muted-foreground", et: "zaten var" },
    hata: { ik: "solar:close-circle-bold", renk: "text-red-500", et: "hata" },
  };
  const bittiMi = Object.keys(durumlar).length > 0 && !olusturuluyor;

  return (
    <Sheet open={acik} onOpenChange={setAcik}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{t("Tedarikçi Ara & Teklif Talebi Oluştur")}</SheetTitle>
          <SheetDescription>{t("Ürün koduyla Türkiye öncelikli ara, firmaları seç; tek tıkla e-postalarını bulup bu talebe teklif talebi taslağı aç. İstemediğin firmanın işaretini kaldır.")}</SheetDescription>
        </SheetHeader>

        <div className="flex gap-2 border-b p-4">
          <Input value={sorgu} onChange={(e) => setSorgu(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ara(); }} placeholder={t("Örn. Festo DSBC-50 tedarikçi")} className="h-9" />
          <Button className="h-9 shrink-0 gap-1.5 bg-orange-600 text-white hover:bg-orange-700" disabled={araniyor} onClick={ara}><Icon icon={araniyor ? "svg-spinners:180-ring" : "solar:magnifer-bold"} className="size-4" />{t("Ara")}</Button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 border-b px-4 py-2.5">
          <span className="text-xs text-muted-foreground">{t("Şablon")}:</span>
          {SABLONLAR.map((s) => (
            <button key={s.anahtar} type="button" onClick={() => setSablon(s.anahtar)} title={t(s.aciklama)} className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors", sablon === s.anahtar ? "border-orange-500 bg-orange-500 text-white" : "bg-card hover:bg-muted")}>{t(s.ad)}</button>
          ))}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {sonuclar === null ? (
            <p className="px-2 py-10 text-center text-sm text-muted-foreground">{t("Sorguyu kontrol edip Ara'ya basın.")}</p>
          ) : sonuclar.length === 0 ? (
            <p className="px-2 py-10 text-center text-sm text-muted-foreground">{t("Sonuç bulunamadı.")}</p>
          ) : (
            <>
              <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
                <span>{secili.size}/{sonuclar.length} {t("seçili")}</span>
                <button type="button" className="hover:text-foreground" onClick={() => setSecili(secili.size === sonuclar.length ? new Set() : new Set(sonuclar.map((x) => x.url)))}>{secili.size === sonuclar.length ? t("Hiçbiri") : t("Tümü")}</button>
              </div>
              {sonuclar.map((r) => {
                const st = durumlar[r.url];
                const zaten = rfqDomainleri.has(dom(r.url));
                return (
                  <label key={r.url} className={cn("flex items-start gap-2.5 rounded-xl border p-3 text-sm", zaten && "opacity-60")}>
                    <input type="checkbox" checked={secili.has(r.url)} disabled={olusturuluyor || zaten} onChange={() => toggle(r.url)} className="mt-0.5 size-4 rounded border-input" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{r.baslik}</p>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"><Icon icon="solar:link-linear" className="size-3.5" />{r.alanAdi}</a>
                      {r.ozet ? <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.ozet}</p> : null}
                    </div>
                    {st ? <span className={cn("flex shrink-0 items-center gap-1 text-[11px]", dmeta[st.durum].renk)} title={st.not ?? ""}><Icon icon={dmeta[st.durum].ik} className="size-4" />{t(dmeta[st.durum].et)}</span>
                      : zaten ? <span className="shrink-0 text-[11px] text-muted-foreground">{t("zaten var")}</span> : null}
                  </label>
                );
              })}
              <Button variant="outline" className="w-full gap-1.5 bg-card" disabled={dahaAraniyor || olusturuluyor} onClick={dahaFazla}>
                <Icon icon={dahaAraniyor ? "svg-spinners:180-ring" : "solar:add-circle-linear"} className="size-4" />{t("8 Tane Daha Bul")}
              </Button>
            </>
          )}
        </div>

        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>{t(bittiMi ? "Kapat" : "İptal")}</SheetClose>
          {sonuclar && sonuclar.length > 0 ? (
            <Button className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" disabled={olusturuluyor || secili.size === 0} onClick={olustur}>
              <Icon icon={olusturuluyor ? "svg-spinners:180-ring" : "solar:letter-opened-bold"} className="size-4" />{t("Seçilenlere Teklif Talebi")} ({secili.size})
            </Button>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Tekil RFQ oluştur/düzenle
// ---------------------------------------------------------------------------
function RfqSheet({ acik, setAcik, talep, tedarikciler, kalemler, duzenlenen, imza, onKaydet }: {
  acik: boolean; setAcik: (o: boolean) => void; talep: Talep; tedarikciler: Tedarikci[]; kalemler: TalepKalem[]; duzenlenen: Rfq | null; imza: string; onKaydet: () => void;
}) {
  const { t } = useDil();
  const [tedId, setTedId] = React.useState("");
  const [konu, setKonu] = React.useState("");
  const [alici, setAlici] = React.useState("");
  const [govde, setGovde] = React.useState("");
  const [sablon, setSablon] = React.useState<SablonAnahtar>("standart");
  const [kaydediliyor, setKaydediliyor] = React.useState(false);

  React.useEffect(() => {
    if (!acik) return;
    if (duzenlenen) {
      setTedId(duzenlenen.tedarikciId ?? ""); setKonu(duzenlenen.konu ?? ""); setAlici(duzenlenen.aliciEposta ?? ""); setGovde(duzenlenen.govde ?? "");
    } else {
      setTedId(""); setKonu(varsayilanKonu(talep)); setAlici(""); setSablon("standart"); setGovde(govdeUret("standart", { talep, imza, kalemler }));
    }
  }, [acik, duzenlenen, talep, imza, kalemler]);

  function tedarikciSec(id: string) {
    setTedId(id);
    const ted = tedarikciler.find((x) => x.id === id);
    if (ted?.eposta) setAlici(ted.eposta);
    if (!duzenlenen && ted) setGovde(govdeUret(sablon, { talep, imza, kalemler, tedAd: ted.ad }));
  }
  function sablonDegistir(yeni: SablonAnahtar) {
    setSablon(yeni);
    const tedAd = tedarikciler.find((x) => x.id === tedId)?.ad;
    setGovde(govdeUret(yeni, { talep, imza, kalemler, tedAd }));
  }

  async function kaydet() {
    if (!konu.trim()) { toast.error(t("Konu gerekli.")); return; }
    if (kaydediliyor) return;
    setKaydediliyor(true);
    try {
      if (duzenlenen) { await rfqGuncelle(duzenlenen.id, { konu: konu.trim(), govde, aliciEposta: alici.trim() || null, tedarikciId: tedId || null }); toast.success(t("Teklif talebi güncellendi")); }
      else { await rfqOlustur({ talepId: talep.id, tedarikciId: tedId || null, konu: konu.trim(), govde, aliciEposta: alici.trim() || null }); toast.success(t("teklif talebi taslağı oluşturuldu")); }
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
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{duzenlenen ? t("Teklif Talebi Düzenle") : t("Yeni Teklif Talebi Taslağı")}</SheetTitle>
          <SheetDescription>{t("Teklif talebi e-postasının taslağı. Gönderim önizleme+onaydan sonra yapılır.")}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("Tedarikçi")}</Label>
            <select value={tedId} onChange={(e) => tedarikciSec(e.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
              <option value="">{t("Tedarikçi seçin…")}</option>
              {tedarikciler.map((x) => <option key={x.id} value={x.id}>{x.ad}{x.eposta ? ` — ${x.eposta}` : ""}</option>)}
            </select>
            {tedarikciler.length === 0 ? <p className="text-[11px] text-amber-600 dark:text-amber-400">{t("Önce Tedarikçiler sayfasından tedarikçi ekleyin.")}</p> : null}
          </div>
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Alıcı E-posta")}</Label><Input value={alici} onChange={(e) => setAlici(e.target.value)} placeholder="satis@tedarikci.com" /></div>
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Konu")} *</Label><Input value={konu} onChange={(e) => setKonu(e.target.value)} /></div>
          {!duzenlenen ? (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t("E-posta Şablonu")}</Label>
              <div className="flex flex-wrap gap-1.5">
                {SABLONLAR.map((s) => (
                  <button key={s.anahtar} type="button" onClick={() => sablonDegistir(s.anahtar)} title={t(s.aciklama)} className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", sablon === s.anahtar ? "border-orange-500 bg-orange-500 text-white" : "bg-card hover:bg-muted")}>{t(s.ad)}</button>
                ))}
              </div>
            </div>
          ) : null}
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("E-posta Metni")}</Label><Textarea value={govde} onChange={(e) => setGovde(e.target.value)} rows={12} className="font-mono text-xs" /></div>
        </div>
        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>{t("İptal")}</SheetClose>
          <Button className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" disabled={kaydediliyor} onClick={kaydet}><Icon icon={kaydediliyor ? "svg-spinners:180-ring" : "solar:diskette-bold-duotone"} className="size-4" />{t("Kaydet")}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
