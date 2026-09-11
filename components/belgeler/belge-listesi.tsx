"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import { MoreVertical, Search } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DURUM_META, FORMAT_STIL, KATEGORI_META } from "@/components/belgeler/stiller";
import { BelgeDetayDrawer } from "@/components/belgeler/belge-detay-drawer";
import { useBelgeFiltre } from "@/components/belgeler/filtre-store";
import { useBelgeAnaliz } from "@/lib/queries/belgeler";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import { csvIndir } from "@/lib/disa-aktar";
import { cn } from "@/lib/utils";
import type { BelgeAnaliz } from "@/lib/types";

const KATEGORILER = ["Tümü", "Yasal & Mevzuat", "Sertifikalar", "Sözleşmeler", "Etüt & Raporlar", "Teknik Dökümanlar", "Faturalar"];
const DURUMLAR = ["Tümü", "Geçerli", "Süresi Yaklaşıyor", "Süresi Doldu", "Taslak"];
const SAYFA_BOYUTU = 10;

function FiltreSelect({ etiket, deger, secenekler, onChange, genislik }: {
  etiket: string; deger: string; secenekler: string[]; onChange: (v: string) => void; genislik: string;
}) {
  const { t } = useDil();
  return (
    <div className="flex w-full items-center gap-2 rounded-lg border bg-card pl-3 shadow-sm md:w-auto">
      <span className="text-xs font-medium text-muted-foreground">{etiket}</span>
      <Select value={deger} onValueChange={(v) => onChange(v as string)}>
        <SelectTrigger className={`h-9 flex-1 border-0 bg-transparent shadow-none md:flex-none ${genislik}`}><SelectValue /></SelectTrigger>
        <SelectContent>{secenekler.map((s) => <SelectItem key={s} value={s}>{t(s)}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

export function BelgeListesi() {
  const { data, isLoading } = useBelgeAnaliz();
  const { t } = useDil();
  const { arama, kategori, durum, set, aktifMi, sifirla } = useBelgeFiltre();
  const qc = useQueryClient();
  const [sayfa, setSayfa] = React.useState(1);

  const sil = (id: string) => qc.setQueryData(queryKeys.belgeler.analiz, (old?: BelgeAnaliz) => old ? { ...old, belgeler: old.belgeler.filter((b) => b.id !== id) } : old);

  const tumu = data?.belgeler ?? [];
  const filtreli = tumu.filter((b) => {
    if (arama && !`${b.ad} ${b.aciklama}`.toLocaleLowerCase("tr").includes(arama.toLocaleLowerCase("tr"))) return false;
    if (kategori !== "Tümü" && KATEGORI_META[b.kategori].etiket !== kategori) return false;
    if (durum !== "Tümü" && DURUM_META[b.durum].etiket !== durum) return false;
    return true;
  });

  const filtreImza = `${arama}|${kategori}|${durum}`;
  React.useEffect(() => { setSayfa(1); }, [filtreImza]);

  const toplamSayfa = Math.max(1, Math.ceil(filtreli.length / SAYFA_BOYUTU));
  const gecerliSayfa = Math.min(sayfa, toplamSayfa);
  const basla = (gecerliSayfa - 1) * SAYFA_BOYUTU;
  const sayfaVerisi = filtreli.slice(basla, basla + SAYFA_BOYUTU);

  function disaAktar() {
    if (filtreli.length === 0) {
      toast.error(t("Dışa aktarılacak belge yok"));
      return;
    }
    csvIndir(
      "belgeler",
      [t("Belge Adı"), t("Kategori"), t("Boyut"), t("Yükleyen"), t("Yüklenme"), t("Geçerlilik"), t("Durum")],
      filtreli.map((b) => [
        t(b.ad),
        t(KATEGORI_META[b.kategori].etiket),
        b.boyut,
        t(b.yukleyen),
        b.tarih,
        b.gecerlilik ?? t("Süresiz"),
        t(DURUM_META[b.durum].etiket),
      ]),
    );
    toast.success(`${filtreli.length} ${t("belge Excel'e aktarıldı")}`);
  }

  return (
    <Card id="belge-listesi" className="scroll-mt-6">
      <CardHeader className="flex-col gap-3 @2xl/card-header:flex-row @2xl/card-header:items-center @2xl/card-header:justify-between">
        <h3 className="font-heading text-base font-medium">{t("Belge Listesi")}</h3>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
          <div className="relative w-full md:w-auto">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={arama} onChange={(e) => set("arama", e.target.value)} placeholder={t("Belge ara...")} className="h-9 w-full pl-8 md:w-[200px]" />
          </div>
          <FiltreSelect etiket={t("Kategori")} deger={kategori} secenekler={KATEGORILER} onChange={(v) => set("kategori", v)} genislik="w-[150px]" />
          <FiltreSelect etiket={t("Durum")} deger={durum} secenekler={DURUMLAR} onChange={(v) => set("durum", v)} genislik="w-[140px]" />
          <Button variant="outline" size="sm" className="h-9 w-full justify-center gap-1.5 bg-card md:w-auto" onClick={disaAktar}>
            <Icon icon="vscode-icons:file-type-excel" className="size-4" />
            {t("Dışa Aktar")}
          </Button>
          {aktifMi ? (
            <Button variant="ghost" size="sm" className="h-9 w-full justify-center gap-1 text-muted-foreground md:w-auto" onClick={sifirla}>
              <Icon icon="solar:restart-linear" className="size-4" />
              {t("Sıfırla")}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading || !data ? (
          <Skeleton className="h-[360px] w-full" />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="whitespace-nowrap">{t("Belge Adı")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Kategori")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Boyut")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Yükleyen")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Yüklenme")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Geçerlilik")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Durum")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("İşlem")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sayfaVerisi.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Icon icon="solar:folder-open-bold-duotone" className="size-9 opacity-60" />
                          <span className="text-sm">{t("Seçili filtrelere uygun belge bulunamadı.")}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {sayfaVerisi.map((b) => {
                    const kat = KATEGORI_META[b.kategori];
                    const durumMeta = DURUM_META[b.durum];
                    const fmt = FORMAT_STIL[b.format.split(", ")[0]] ?? FORMAT_STIL.PDF;
                    return (
                      <TableRow key={b.id} className="odd:bg-muted/20 hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", fmt.sinif)}>
                              <Icon icon={fmt.ikon} className="size-4.5" />
                            </span>
                            <span className="font-medium">{t(b.ad)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full" style={{ background: kat.nokta }} />
                            {t(kat.etiket)}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{b.boyut}</TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{t(b.yukleyen)}</TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{b.tarih}</TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums">
                          {b.gecerlilik ? (
                            <span className={cn(b.durum === "doldu" ? "text-red-500" : b.durum === "yaklasiyor" ? "text-amber-600" : "text-muted-foreground")}>{b.gecerlilik}</span>
                          ) : (
                            <span className="text-muted-foreground/50">{t("Süresiz")}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", durumMeta.sinif)}>{t(durumMeta.etiket)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-0.5">
                            <BelgeDetayDrawer
                              belge={b}
                              trigger={
                                <Button variant="ghost" size="icon-sm" aria-label={t("Görüntüle")}>
                                  <Icon icon="solar:eye-bold-duotone" className="size-4 text-muted-foreground" />
                                </Button>
                              }
                            />
                            <Button variant="ghost" size="icon-sm" aria-label={t("İndir")} onClick={() => toast.success(`${t(b.ad)} ${t("indiriliyor")}`)}>
                              <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4 text-muted-foreground" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={t("Daha fazla")} />}>
                                <MoreVertical className="size-4 text-muted-foreground" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={() => toast.success(`${t(b.ad)} ${t("paylaşıldı")}`)}>
                                  <Icon icon="solar:share-bold-duotone" className="size-4" />
                                  {t("Paylaş")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast(`${t(b.ad)} ${t("yeniden adlandırılıyor")}`)}>
                                  <Icon icon="solar:pen-2-bold-duotone" className="size-4" />
                                  {t("Yeniden Adlandır")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { sil(b.id); toast.success(`${t(b.ad)} ${t("silindi")}`); }}>
                                  <Icon icon="solar:trash-bin-trash-bold-duotone" className="size-4" />
                                  {t("Sil")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Sayfalama */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground tabular-nums">
                {filtreli.length === 0
                  ? `0 ${t("kayıt")}`
                  : `${basla + 1} – ${Math.min(basla + SAYFA_BOYUTU, filtreli.length)} / ${filtreli.length} ${t("kayıt")}`}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon-sm" aria-label={t("Önceki")} disabled={gecerliSayfa <= 1} onClick={() => setSayfa((s) => Math.max(1, s - 1))}>
                    <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
                  </Button>
                  {Array.from({ length: toplamSayfa }).map((_, i) => (
                    <Button key={i} size="icon-sm" variant={i + 1 === gecerliSayfa ? "default" : "outline"} className={i + 1 === gecerliSayfa ? "bg-teal-600 text-white hover:bg-teal-700" : undefined} onClick={() => setSayfa(i + 1)}>
                      {i + 1}
                    </Button>
                  ))}
                  <Button variant="outline" size="icon-sm" aria-label={t("Sonraki")} disabled={gecerliSayfa >= toplamSayfa} onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}>
                    <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{t("Sayfa başına")}:</span>
                  <Select value="10" onValueChange={() => toast(t("Sayfa boyutu güncellendi"))}>
                    <SelectTrigger className="h-8 w-[68px] bg-card"><SelectValue /></SelectTrigger>
                    <SelectContent>{["10", "25", "50"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
