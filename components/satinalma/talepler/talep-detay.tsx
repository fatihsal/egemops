"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BosDurum } from "@/components/common/bos-durum";
import { useTalep } from "@/lib/queries/satinalma";
import { talepGuncelle, talepSil } from "@/lib/data/satinalma/talepler";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import { cn } from "@/lib/utils";
import { TALEP_DURUM_META, tarihKisa } from "@/components/satinalma/stiller";
import { KalemlerBolumu } from "@/components/satinalma/talepler/kalemler-bolumu";
import { RfqBolumu } from "@/components/satinalma/talepler/rfq-bolumu";
import { TeklifBolumu } from "@/components/satinalma/talepler/teklif-bolumu";
import type { TalepDurum } from "@/lib/types/satinalma";

export function TalepDetay({ id }: { id: string }) {
  const { data: talep, isLoading, isError } = useTalep(id);
  const { t } = useDil();
  const router = useRouter();
  const qc = useQueryClient();
  const [buyukFoto, setBuyukFoto] = React.useState<string | null>(null);
  const [siliniyor, setSiliniyor] = React.useState(false);

  function tazele() {
    qc.invalidateQueries({ queryKey: queryKeys.satinalma.talep(id) });
    qc.invalidateQueries({ queryKey: queryKeys.satinalma.talepler });
  }

  async function durumDegistir(yeni: TalepDurum) {
    try {
      await talepGuncelle(id, { durum: yeni });
      toast.success(t("Durum güncellendi"));
      tazele();
    } catch (err) {
      toast.error(t("Durum güncellenemedi"), { description: err instanceof Error ? err.message : undefined });
    }
  }

  async function sil() {
    if (siliniyor) return;
    setSiliniyor(true);
    try {
      await talepSil(id);
      toast.success(t("Talep silindi"));
      qc.invalidateQueries({ queryKey: queryKeys.satinalma.talepler });
      router.push("/satinalma/talepler");
    } catch (err) {
      toast.error(t("Talep silinemedi"), { description: err instanceof Error ? err.message : undefined });
      setSiliniyor(false);
    }
  }

  if (isLoading) {
    return <div className="space-y-5"><Skeleton className="h-8 w-48" /><div className="grid gap-5 lg:grid-cols-[1fr_320px]"><Skeleton className="h-96 w-full" /><Skeleton className="h-96 w-full" /></div></div>;
  }
  if (isError || !talep) {
    return <Card><CardContent className="p-0"><BosDurum ikon="solar:file-corrupted-bold-duotone" baslik={t("Talep bulunamadı")} aciklama={t("Kayıt silinmiş veya migration uygulanmamış olabilir.")} aksiyon={<Button variant="outline" nativeButton={false} render={<Link href="/satinalma/talepler" />}>{t("Listeye Dön")}</Button>} /></CardContent></Card>;
  }

  const dm = TALEP_DURUM_META[talep.durum];

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/satinalma/talepler" className="flex size-8 items-center justify-center rounded-lg border bg-card text-muted-foreground hover:bg-muted"><Icon icon="solar:alt-arrow-left-linear" className="size-4" /></Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold tracking-tight">{talep.baslik}</h2>
              <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium", dm.sinif)}><span className={cn("size-1.5 rounded-full", dm.nokta)} />{t(dm.etiket)}</span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground tabular-nums">{talep.talepNo ?? "—"} · {tarihKisa(talep.createdAt)}{talep.olusturanAd ? ` · ${talep.olusturanAd}` : ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={talep.durum} onValueChange={(v) => v && durumDegistir(v as TalepDurum)}>
            <SelectTrigger size="sm" className="w-[170px] bg-card"><SelectValue /></SelectTrigger>
            <SelectContent>{(Object.keys(TALEP_DURUM_META) as TalepDurum[]).map((d) => <SelectItem key={d} value={d}>{t(TALEP_DURUM_META[d].etiket)}</SelectItem>)}</SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5 bg-card text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950" disabled={siliniyor} onClick={sil}><Icon icon="solar:trash-bin-trash-linear" className="size-4" />{t("Sil")}</Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Sol: bilgiler + AI + sonraki fazlar */}
        <div className="space-y-5">
          {/* Kalemler (çok kalemli talep) */}
          <KalemlerBolumu talep={talep} />

          {/* Tedarikçi adayları — aktif (Faz 4) */}
          <Link
            href={`/satinalma/tedarikciler?q=${encodeURIComponent([talep.marka, talep.model, talep.aiCikarim?.kategori ?? talep.baslik, "tedarikçi"].filter(Boolean).join(" "))}`}
            className="flex items-center gap-3 rounded-xl border border-orange-200/70 bg-orange-50/50 p-4 text-sm transition-colors hover:bg-orange-100/60 dark:border-orange-900/40 dark:bg-orange-950/20 dark:hover:bg-orange-950/40"
          >
            <Icon icon="solar:shop-2-bold-duotone" className="size-7 text-orange-600 dark:text-orange-400" />
            <div className="min-w-0 flex-1"><p className="font-medium">{t("Tedarikçi Adayı Ara")}</p><p className="text-xs text-muted-foreground">{t("Bu malzeme için doğrulanabilir kaynaklı tedarikçiler bul")}</p></div>
            <Icon icon="solar:alt-arrow-right-linear" className="size-4 text-muted-foreground" />
          </Link>

          {/* Teklif talepleri (RFQ) — aktif (Faz 5) */}
          <RfqBolumu talep={talep} />

          {/* Gelen teklifler + karşılaştırma — otomatik (Faz 7-8) */}
          <TeklifBolumu talepId={talep.id} />
        </div>

        {/* Sağ: fotoğraflar */}
        <Card className="lg:sticky lg:top-4 lg:self-start">
          <CardHeader><h3 className="font-heading text-base font-bold tracking-tight">{t("Fotoğraflar")}</h3></CardHeader>
          <CardContent>
            {talep.fotoUrl.length === 0 ? (
              <BosDurum ikon="solar:gallery-bold-duotone" baslik={t("Fotoğraf yok")} />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {talep.fotoUrl.map((url) => (
                  <button key={url} type="button" onClick={() => setBuyukFoto(url)} className="aspect-square overflow-hidden rounded-lg ring-1 ring-border transition-opacity hover:opacity-90">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Foto büyük önizleme */}
      {buyukFoto ? (
        <div role="dialog" aria-modal className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6" onClick={() => setBuyukFoto(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={buyukFoto} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
          <button type="button" aria-label={t("Kapat")} className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"><Icon icon="solar:close-circle-bold" className="size-6" /></button>
        </div>
      ) : null}
    </div>
  );
}
