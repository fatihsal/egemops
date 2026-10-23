"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTalepTeklifler, useTedarikciler } from "@/lib/queries/satinalma";
import { teklifSil } from "@/lib/data/satinalma/teklifler";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import { cn } from "@/lib/utils";
import type { Teklif } from "@/lib/types/satinalma";

// Karşılaştırılabilir toplam — DETERMINISTIK (LLM değil). Eksik KDV sıfır sayılmaz.
function karsilastirilabilirToplam(t: Teklif): number | null {
  if (t.fiyat == null) return null;
  if (t.kdvDahil === true) return t.fiyat;
  if (t.kdvDahil === false && t.kdvOran != null) return Math.round(t.fiyat * (1 + t.kdvOran / 100) * 100) / 100;
  return null; // KDV durumu belirsiz -> karşılaştırılabilir toplam üretme
}
function paraBicim(n: number | null, pb: string | null): string {
  if (n == null) return "—";
  try { return `${n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${pb ?? ""}`.trim(); }
  catch { return `${n} ${pb ?? ""}`.trim(); }
}

export function TeklifBolumu({ talepId }: { talepId: string }) {
  const { t } = useDil();
  const qc = useQueryClient();
  const { data: teklifler, isLoading } = useTalepTeklifler(talepId);
  const { data: tedarikciler } = useTedarikciler();
  const [senkron, setSenkron] = React.useState(false);
  const senkronYapildi = React.useRef(false);

  const tazele = React.useCallback(() => {
    qc.invalidateQueries({ queryKey: queryKeys.satinalma.talepTeklifler(talepId) });
    qc.invalidateQueries({ queryKey: queryKeys.satinalma.talepRfq(talepId) });
  }, [qc, talepId]);

  const senkronEt = React.useCallback(async (elle: boolean) => {
    if (senkron) return;
    setSenkron(true);
    try {
      const r = await fetch("/api/satinalma/teklif-topla", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ talepId }) });
      const metin = await r.text();
      const sonuc = metin ? JSON.parse(metin) : {};
      if (!r.ok) {
        if (sonuc?.yenidenBaglan) {
          if (elle) toast.error(t("Gmail okuma izni gerekli"), { description: t("Ayarlar'dan Gmail'i yeniden bağlayın (okuma izni için).") });
        } else if (elle) {
          toast.error(t("Toplama başarısız"), { description: sonuc?.hata ?? `HTTP ${r.status}` });
        }
        return;
      }
      if ((sonuc.yeni ?? 0) > 0) { toast.success(`${sonuc.yeni} ${t("yeni teklif toplandı")}`); tazele(); }
      else if (elle) toast(t("Yeni teklif yok."));
    } catch (e) {
      if (elle) toast.error(t("Toplama başarısız"), { description: e instanceof Error ? e.message : undefined });
    } finally {
      setSenkron(false);
    }
  }, [senkron, talepId, t, tazele]);

  // Açılışta otomatik senkronizasyon (bir kez, sessiz)
  React.useEffect(() => {
    if (senkronYapildi.current) return;
    senkronYapildi.current = true;
    senkronEt(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talepId]);

  const liste = teklifler ?? [];
  const tedAd = (id: string | null) => tedarikciler?.find((x) => x.id === id)?.ad ?? t("Bilinmeyen tedarikçi");

  // En düşük karşılaştırılabilir toplam (aynı para birimi + teknik uygun ≠ false)
  const uygunlar = liste.filter((x) => x.teknikUygun !== false && karsilastirilabilirToplam(x) != null);
  const paraBirimleri = new Set(uygunlar.map((x) => x.paraBirimi ?? "?"));
  let enUcuzId: string | null = null;
  if (uygunlar.length > 0 && paraBirimleri.size === 1) {
    enUcuzId = uygunlar.reduce((a, b) => (karsilastirilabilirToplam(a)! <= karsilastirilabilirToplam(b)! ? a : b)).id;
  }

  async function sil(id: string) {
    try { await teklifSil(id); toast.success(t("Teklif silindi")); tazele(); }
    catch (e) { toast.error(t("Silinemedi"), { description: e instanceof Error ? e.message : undefined }); }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <div>
          <h3 className="font-heading text-base font-bold tracking-tight">{t("Gelen Teklifler & Karşılaştırma")}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("Gmail'e gelen PDF/e-posta teklifleri otomatik toplanır ve ayrıştırılır. Değerler tedarikçinin yazdığından alınır; hesaplar sistemde yapılır.")}</p>
        </div>
        <Button size="sm" variant="outline" className="shrink-0 gap-1.5 bg-card" disabled={senkron} onClick={() => senkronEt(true)}>
          <Icon icon={senkron ? "svg-spinners:180-ring" : "solar:refresh-bold"} className="size-4" />{t(senkron ? "Toplanıyor…" : "Yanıtları Kontrol Et")}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{t("Yükleniyor…")}</p>
        ) : liste.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">{senkron ? t("Gelen kutusu taranıyor…") : t("Henüz teklif toplanmadı. Tedarikçiler RFQ'ya cevap verince burada otomatik görünür.")}</p>
        ) : (
          <>
            {paraBirimleri.size > 1 ? (
              <p className="mb-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400"><Icon icon="solar:danger-triangle-bold" className="size-3.5" />{t("Teklifler farklı para birimlerinde — doğrudan toplam kıyası yapılmadı.")}</p>
            ) : null}
            <div className="overflow-x-auto">
              <table className="w-full caption-bottom text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Tedarikçi")}</TableHead>
                    <TableHead className="text-right">{t("Fiyat")}</TableHead>
                    <TableHead className="text-center">{t("KDV")}</TableHead>
                    <TableHead className="text-right">{t("Kıyas Toplam")}</TableHead>
                    <TableHead className="text-center">{t("Termin")}</TableHead>
                    <TableHead className="text-center">{t("Garanti")}</TableHead>
                    <TableHead className="text-center">{t("Teknik")}</TableHead>
                    <TableHead className="text-right">{t("Aksiyon")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liste.map((x) => {
                    const kiyas = karsilastirilabilirToplam(x);
                    const enUcuz = x.id === enUcuzId;
                    return (
                      <TableRow key={x.id} className={cn(enUcuz && "bg-emerald-50/60 dark:bg-emerald-950/30")}>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {enUcuz ? <span title={t("En düşük doğrulanmış toplam")}><Icon icon="solar:cup-star-bold" className="size-4 text-emerald-600 dark:text-emerald-400" /></span> : null}
                            <div className="min-w-0"><span className="block truncate font-medium">{tedAd(x.tedarikciId)}</span>{x.okunamadi ? <span className="text-[11px] text-amber-600 dark:text-amber-400">{t("PDF okunamadı (taranmış olabilir)")}</span> : x.aiOzet ? <span className="block truncate text-[11px] text-muted-foreground">{x.aiOzet}</span> : null}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums whitespace-nowrap">{paraBicim(x.fiyat, x.paraBirimi)}</TableCell>
                        <TableCell className="text-center text-xs whitespace-nowrap">{x.kdvDahil == null ? <span className="text-amber-600 dark:text-amber-400">{t("belirsiz")}</span> : x.kdvDahil ? `${t("dahil")}${x.kdvOran != null ? ` %${x.kdvOran}` : ""}` : `${t("hariç")}${x.kdvOran != null ? ` %${x.kdvOran}` : ""}`}</TableCell>
                        <TableCell className={cn("text-right tabular-nums whitespace-nowrap", enUcuz && "font-semibold text-emerald-700 dark:text-emerald-300")}>{kiyas != null ? paraBicim(kiyas, x.paraBirimi) : <span className="text-muted-foreground">{t("belirsiz")}</span>}</TableCell>
                        <TableCell className="text-center tabular-nums whitespace-nowrap">{x.terminGun != null ? `${x.terminGun} ${t("gün")}` : "—"}</TableCell>
                        <TableCell className="text-center tabular-nums whitespace-nowrap">{x.garantiAy != null ? `${x.garantiAy} ${t("ay")}` : "—"}</TableCell>
                        <TableCell className="text-center">
                          {x.teknikUygun === true ? <Icon icon="solar:check-circle-bold" className="mx-auto size-4 text-emerald-500" />
                            : x.teknikUygun === false ? <Icon icon="solar:close-circle-bold" className="mx-auto size-4 text-red-500" />
                            : <span className="text-[11px] text-amber-600 dark:text-amber-400" title={x.teknikNot ?? ""}>{t("teyit")}</span>}
                        </TableCell>
                        <TableCell><div className="flex justify-end"><button type="button" onClick={() => sil(x.id)} aria-label={t("Sil")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"><Icon icon="solar:trash-bin-trash-linear" className="size-4" /></button></div></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">{t("“Teyit” = teknik uygunluk henüz doğrulanmadı; onaylanmış muadil gibi değerlendirilmez. “Kıyas Toplam” yalnızca KDV durumu belli olan tekliflerde hesaplanır.")}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
