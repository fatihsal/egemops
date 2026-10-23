"use client";

import * as React from "react";
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
import { imzaUret } from "@/lib/data/satinalma/ayarlar";
import { rfqIcerikHash } from "@/lib/satinalma/rfq-hash";
import { queryKeys } from "@/lib/queries/keys";
import { cn } from "@/lib/utils";
import { RFQ_DURUM_META } from "@/components/satinalma/stiller";
import type { Rfq, Talep, TalepKalem, Tedarikci } from "@/lib/types/satinalma";

/** Okunabilir talep referansı — Gmail thread kimliğinin yerine geçmez. */
function talepReferans(talep: Talep) {
  return `EGEM-RFQ-${talep.talepNo ?? talep.id.slice(0, 8)}`;
}
function varsayilanKonu(talep: Talep) {
  return `Teklif Talebi — ${talep.baslik} [${talepReferans(talep)}]`;
}
function kalemSatiri(k: TalepKalem): string {
  const kod = [k.marka, k.model, k.siparisKodu].filter(Boolean).join(" ");
  const parcalar = [
    `${k.sira}. ${k.ad}`,
    kod ? `(${kod})` : "",
    k.adet != null ? `${k.adet} ${k.birim ?? ""}`.trim() : "",
    k.urunDurumu === "yeni" ? "yeni/orijinal" : "",
    k.kapsam === "parca" ? "yalnızca parça" : k.kapsam === "komple" ? "komple montaj" : "",
  ].filter(Boolean);
  return `- ${parcalar.join(" · ")}`;
}
function varsayilanGovde(talep: Talep, imza: string, kalemler: TalepKalem[], tedarikciAd?: string) {
  const malzemeler = kalemler.length > 0
    ? kalemler.map(kalemSatiri).join("\n")
    : [`- ${talep.baslik}`, [talep.marka, talep.model].filter(Boolean).join(" "), talep.adet != null ? `${talep.adet} ${talep.birim ?? ""}`.trim() : ""].filter(Boolean).join(" · ");
  return (
    `Sayın ${tedarikciAd || "Yetkili"},\n\n` +
    `Aşağıdaki malzeme(ler) için fiyat teklifinizi rica ederiz (Ref: ${talepReferans(talep)}):\n\n` +
    `${malzemeler}\n\n` +
    `Lütfen her kalem için birim fiyat, para birimi, KDV durumu, termin süresi, nakliye ve garanti bilgilerini belirtiniz.\n\n` +
    imza
  );
}

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
  const [gonderiliyorTek, setGonderiliyorTek] = React.useState(false);

  function tazele() { qc.invalidateQueries({ queryKey: queryKeys.satinalma.talepRfq(talep.id) }); }
  function yeni() { setDuzenlenen(null); setSheetAcik(true); }
  function duzenle(r: Rfq) { setDuzenlenen(r); setSheetAcik(true); }

  async function durumToggle(r: Rfq) {
    try { await rfqGuncelle(r.id, { durum: r.durum === "taslak" ? "onay_bekliyor" : "taslak" }); tazele(); }
    catch (e) { toast.error(t("Güncellenemedi"), { description: e instanceof Error ? e.message : undefined }); }
  }
  async function sil(id: string) {
    try { await rfqSil(id); toast.success(t("RFQ silindi")); tazele(); }
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
          <h3 className="font-heading text-base font-bold tracking-tight">{t("Teklif Talepleri (RFQ)")}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("Her tedarikçiye ayrı e-posta gider (birbirlerini görmezler). Gönderim öncesi içeriği önizleyip onaylarsınız.")}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {(tedarikciler?.length ?? 0) > 0 ? (
            <Button size="sm" variant="outline" className="gap-1.5 bg-card" onClick={() => setTopluCreateAcik(true)}><Icon icon="solar:users-group-rounded-bold" className="size-4" />{t("Toplu RFQ")}</Button>
          ) : null}
          <Button size="sm" className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" onClick={yeni}><Icon icon="solar:letter-opened-bold" className="size-4" />{t("RFQ Oluştur")}</Button>
        </div>
      </CardHeader>
      <CardContent>
        {gonderilebilir.length > 0 ? (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-200/70 bg-emerald-50/50 p-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <span className="text-sm">{gonderilebilir.length} {t("RFQ gönderilmeye hazır")}</span>
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
  return (
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
    </div>
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

  return (
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
    </div>
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
  const [kaydediliyor, setKaydediliyor] = React.useState(false);

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
        await rfqOlustur({ talepId: talep.id, tedarikciId: ted.id, konu: varsayilanKonu(talep), govde: varsayilanGovde(talep, imza, kalemler, ted.ad), aliciEposta: ted.eposta ?? null });
      }
      toast.success(`${hedef.length} ${t("RFQ taslağı oluşturuldu")}`);
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
          <SheetTitle>{t("Toplu RFQ Oluştur")}</SheetTitle>
          <SheetDescription>{t("Göndermek istemediğin firmaların işaretini kaldır (yalnızca bu talep için hariç tutulur). Her firma için ayrı taslak oluşturulur.")}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-1 overflow-y-auto p-4">
          {tedarikciler.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("Önce tedarikçi ekleyin.")}</p>
          ) : tedarikciler.map((x) => {
            const eklendi = zatenVar.has(x.id);
            return (
              <label key={x.id} className={cn("flex items-center gap-3 rounded-lg border p-2.5 text-sm", eklendi && "opacity-50")}>
                <input type="checkbox" checked={eklendi ? true : secili.has(x.id)} disabled={eklendi || !x.eposta} onChange={() => degistir(x.id)} className="size-4 rounded border-input" />
                <div className="min-w-0 flex-1"><p className="truncate font-medium">{x.ad}</p><p className="truncate text-[11px] text-muted-foreground">{x.eposta || t("e-posta yok — gönderilemez")}</p></div>
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
  const [kaydediliyor, setKaydediliyor] = React.useState(false);

  React.useEffect(() => {
    if (!acik) return;
    if (duzenlenen) {
      setTedId(duzenlenen.tedarikciId ?? ""); setKonu(duzenlenen.konu ?? ""); setAlici(duzenlenen.aliciEposta ?? ""); setGovde(duzenlenen.govde ?? "");
    } else {
      setTedId(""); setKonu(varsayilanKonu(talep)); setAlici(""); setGovde(varsayilanGovde(talep, imza, kalemler));
    }
  }, [acik, duzenlenen, talep, imza, kalemler]);

  function tedarikciSec(id: string) {
    setTedId(id);
    const ted = tedarikciler.find((x) => x.id === id);
    if (ted?.eposta) setAlici(ted.eposta);
    if (!duzenlenen && ted) setGovde(varsayilanGovde(talep, imza, kalemler, ted.ad));
  }

  async function kaydet() {
    if (!konu.trim()) { toast.error(t("Konu gerekli.")); return; }
    if (kaydediliyor) return;
    setKaydediliyor(true);
    try {
      if (duzenlenen) { await rfqGuncelle(duzenlenen.id, { konu: konu.trim(), govde, aliciEposta: alici.trim() || null, tedarikciId: tedId || null }); toast.success(t("RFQ güncellendi")); }
      else { await rfqOlustur({ talepId: talep.id, tedarikciId: tedId || null, konu: konu.trim(), govde, aliciEposta: alici.trim() || null }); toast.success(t("RFQ taslağı oluşturuldu")); }
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
          <SheetTitle>{duzenlenen ? t("RFQ Düzenle") : t("Yeni RFQ Taslağı")}</SheetTitle>
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
