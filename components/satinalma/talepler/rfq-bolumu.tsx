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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDil } from "@/components/providers/dil-provider";
import { useTalepRfq, useTedarikciler } from "@/lib/queries/satinalma";
import { rfqOlustur, rfqGuncelle, rfqSil } from "@/lib/data/satinalma/rfq";
import { queryKeys } from "@/lib/queries/keys";
import { cn } from "@/lib/utils";
import { RFQ_DURUM_META } from "@/components/satinalma/stiller";
import type { Rfq, Talep, Tedarikci } from "@/lib/types/satinalma";

function varsayilanKonu(talep: Talep) {
  return `Teklif Talebi — ${talep.baslik}${talep.talepNo ? ` (${talep.talepNo})` : ""}`;
}
function varsayilanGovde(talep: Talep, tedarikciAd?: string) {
  const satir = (e: string, d: string | number | null | undefined) => (d ? `- ${e}: ${d}\n` : "");
  return (
    `Sayın ${tedarikciAd || "Yetkili"},\n\n` +
    `Aşağıdaki malzeme için fiyat teklifinizi rica ederiz:\n\n` +
    satir("Malzeme", talep.baslik) +
    satir("Marka/Model", [talep.marka, talep.model].filter(Boolean).join(" ")) +
    satir("Adet", talep.adet != null ? `${talep.adet} ${talep.birim ?? ""}`.trim() : null) +
    satir("Teknik açıklama", talep.teknikAciklama) +
    `\nLütfen birim fiyat, para birimi, KDV durumu, termin süresi, nakliye ve garanti bilgilerini belirtiniz.\n\n` +
    `Saygılarımızla,\nEgem Ambalaj — Satın Alma`
  );
}

export function RfqBolumu({ talep }: { talep: Talep }) {
  const { t } = useDil();
  const qc = useQueryClient();
  const { data: rfqlar, isLoading } = useTalepRfq(talep.id);
  const { data: tedarikciler } = useTedarikciler();
  const [sheetAcik, setSheetAcik] = React.useState(false);
  const [duzenlenen, setDuzenlenen] = React.useState<Rfq | null>(null);

  function tazele() {
    qc.invalidateQueries({ queryKey: queryKeys.satinalma.talepRfq(talep.id) });
  }

  function yeni() { setDuzenlenen(null); setSheetAcik(true); }
  function duzenle(r: Rfq) { setDuzenlenen(r); setSheetAcik(true); }

  async function durumToggle(r: Rfq) {
    const yeniDurum = r.durum === "taslak" ? "onay_bekliyor" : "taslak";
    try {
      await rfqGuncelle(r.id, { durum: yeniDurum });
      tazele();
    } catch (e) {
      toast.error(t("Güncellenemedi"), { description: e instanceof Error ? e.message : undefined });
    }
  }
  async function sil(id: string) {
    try { await rfqSil(id); toast.success(t("RFQ silindi")); tazele(); }
    catch (e) { toast.error(t("Silinemedi"), { description: e instanceof Error ? e.message : undefined }); }
  }

  const liste = rfqlar ?? [];
  const tedAd = (id: string | null) => tedarikciler?.find((x) => x.id === id)?.ad;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <div>
          <h3 className="font-heading text-base font-bold tracking-tight">{t("Teklif Talepleri (RFQ)")}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("Taslak hazırlayın ve onaya alın. E-posta gönderimi Gmail bağlantısıyla sonraki aşamada (Faz 6) yapılacak.")}</p>
        </div>
        <Button size="sm" className="shrink-0 gap-1.5 bg-orange-600 text-white hover:bg-orange-700" onClick={yeni}><Icon icon="solar:letter-opened-bold" className="size-4" />{t("RFQ Oluştur")}</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t("Yükleniyor…")}</p>
        ) : liste.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t("Henüz teklif talebi yok. Bir tedarikçi için taslak oluşturun.")}</p>
        ) : (
          <div className="space-y-2">
            {liste.map((r) => {
              const dm = RFQ_DURUM_META[r.durum];
              return (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border p-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Icon icon="solar:letter-bold-duotone" className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{r.konu || t("(konu yok)")}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{tedAd(r.tedarikciId) || t("Tedarikçi seçilmedi")}{r.aliciEposta ? ` · ${r.aliciEposta}` : ""}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium", dm.sinif)}>{t(dm.etiket)}</span>
                  {(r.durum === "taslak" || r.durum === "onay_bekliyor") ? (
                    <button type="button" onClick={() => durumToggle(r)} title={t(r.durum === "taslak" ? "Onaya Al" : "Taslağa Al")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Icon icon={r.durum === "taslak" ? "solar:check-circle-linear" : "solar:undo-left-linear"} className="size-4" />
                    </button>
                  ) : null}
                  <button type="button" onClick={() => duzenle(r)} aria-label={t("Düzenle")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Icon icon="solar:pen-linear" className="size-4" /></button>
                  <button type="button" onClick={() => sil(r.id)} aria-label={t("Sil")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"><Icon icon="solar:trash-bin-trash-linear" className="size-4" /></button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <RfqSheet acik={sheetAcik} setAcik={setSheetAcik} talep={talep} tedarikciler={tedarikciler ?? []} duzenlenen={duzenlenen} onKaydet={tazele} />
    </Card>
  );
}

function RfqSheet({ acik, setAcik, talep, tedarikciler, duzenlenen, onKaydet }: {
  acik: boolean; setAcik: (o: boolean) => void; talep: Talep; tedarikciler: Tedarikci[]; duzenlenen: Rfq | null; onKaydet: () => void;
}) {
  const { t } = useDil();
  const [tedId, setTedId] = React.useState("");
  const [konu, setKonu] = React.useState("");
  const [alici, setAlici] = React.useState("");
  const [govde, setGovde] = React.useState("");
  const [kaydediliyor, setKaydediliyor] = React.useState(false);

  // Sheet açıldığında alanları hazırla (yeni = şablon, düzenleme = mevcut).
  React.useEffect(() => {
    if (!acik) return;
    if (duzenlenen) {
      setTedId(duzenlenen.tedarikciId ?? "");
      setKonu(duzenlenen.konu ?? "");
      setAlici(duzenlenen.aliciEposta ?? "");
      setGovde(duzenlenen.govde ?? "");
    } else {
      setTedId("");
      setKonu(varsayilanKonu(talep));
      setAlici("");
      setGovde(varsayilanGovde(talep));
    }
  }, [acik, duzenlenen, talep]);

  function tedarikciSec(id: string) {
    setTedId(id);
    const ted = tedarikciler.find((x) => x.id === id);
    if (ted?.eposta) setAlici(ted.eposta);
    // Yeni taslaksa gövdedeki hitabı güncelle.
    if (!duzenlenen && ted) setGovde(varsayilanGovde(talep, ted.ad));
  }

  async function kaydet() {
    if (!konu.trim()) { toast.error(t("Konu gerekli.")); return; }
    if (kaydediliyor) return;
    setKaydediliyor(true);
    try {
      if (duzenlenen) {
        await rfqGuncelle(duzenlenen.id, { konu: konu.trim(), govde, aliciEposta: alici.trim() || null, tedarikciId: tedId || null });
        toast.success(t("RFQ güncellendi"));
      } else {
        await rfqOlustur({ talepId: talep.id, tedarikciId: tedId || null, konu: konu.trim(), govde, aliciEposta: alici.trim() || null });
        toast.success(t("RFQ taslağı oluşturuldu"));
      }
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
          <SheetDescription>{t("Teklif talebi e-postasının taslağı. Gönderim Faz 6'da (Gmail onayıyla) yapılacak.")}</SheetDescription>
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
