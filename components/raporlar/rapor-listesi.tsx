"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { MoreVertical, Search } from "lucide-react";
import { toast } from "sonner";

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
import { DURUM_META, FORMAT_STIL, KATEGORI_META } from "@/components/raporlar/stiller";
import { useRaporFiltre } from "@/components/raporlar/filtre-store";
import { useRaporAnaliz } from "@/lib/queries/raporlar";
import { useDil } from "@/components/providers/dil-provider";
import { csvIndir } from "@/lib/disa-aktar";
import { cn } from "@/lib/utils";

const KATEGORILER = ["Tümü", "Tüketim", "Performans", "Maliyet", "TEP", "Karşılaştırma", "Özel"];
const FORMATLAR = ["Tümü", "PDF", "Excel"];
const DURUMLAR = ["Tümü", "Aktif", "Taslak", "Arşivlendi", "Hata"];

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

function FormatRozet({ format }: { format: string }) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {format.split(", ").map((f) => (
        <span key={f} className={cn("rounded-md px-1.5 py-0.5 text-[11px] font-medium", FORMAT_STIL[f] ?? "bg-muted text-muted-foreground")}>{f}</span>
      ))}
    </span>
  );
}

const SAYFA_BOYUTU = 10;

export function RaporListesi() {
  const { data, isLoading } = useRaporAnaliz();
  const { t } = useDil();
  const { arama, kategori, format, durum, set, aktifMi, sifirla } = useRaporFiltre();
  const [sayfa, setSayfa] = React.useState(1);

  const tumu = data?.raporlar ?? [];
  const filtreli = tumu.filter((r) => {
    if (arama && !`${r.ad} ${r.aciklama}`.toLocaleLowerCase("tr").includes(arama.toLocaleLowerCase("tr"))) return false;
    if (kategori !== "Tümü" && KATEGORI_META[r.kategori].etiket !== kategori) return false;
    if (format !== "Tümü" && !r.format.split(", ").includes(format)) return false;
    if (durum !== "Tümü" && DURUM_META[r.durum].etiket !== durum) return false;
    return true;
  });

  // Filtre değişince ilk sayfaya dön.
  const filtreImza = `${arama}|${kategori}|${format}|${durum}`;
  React.useEffect(() => { setSayfa(1); }, [filtreImza]);

  const toplamSayfa = Math.max(1, Math.ceil(filtreli.length / SAYFA_BOYUTU));
  const gecerliSayfa = Math.min(sayfa, toplamSayfa);
  const basla = (gecerliSayfa - 1) * SAYFA_BOYUTU;
  const sayfaVerisi = filtreli.slice(basla, basla + SAYFA_BOYUTU);

  function disaAktar() {
    if (filtreli.length === 0) {
      toast.error(t("Dışa aktarılacak rapor yok"));
      return;
    }
    csvIndir(
      "raporlar",
      [t("Rapor Adı"), t("Kategori"), t("Açıklama"), t("Format"), t("Sıklık"), t("Son Oluşturulma"), t("Durum")],
      filtreli.map((r) => [
        t(r.ad),
        t(KATEGORI_META[r.kategori].etiket),
        t(r.aciklama),
        r.format,
        t(r.siklik),
        r.sonOlusturma,
        t(DURUM_META[r.durum].etiket),
      ]),
    );
    toast.success(`${filtreli.length} ${t("rapor Excel'e aktarıldı")}`);
  }

  return (
    <Card id="rapor-listesi" className="scroll-mt-6">
      <CardHeader className="flex-col gap-3 @2xl/card-header:flex-row @2xl/card-header:items-center @2xl/card-header:justify-between">
        <h3 className="font-heading text-base font-medium">{t("Rapor Listesi")}</h3>
        <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
          <div className="relative w-full md:w-auto">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={arama}
              onChange={(e) => set("arama", e.target.value)}
              placeholder={t("Rapor ara...")}
              className="h-9 w-full pl-8 md:w-[200px]"
            />
          </div>
          <FiltreSelect etiket={t("Kategori")} deger={kategori} secenekler={KATEGORILER} onChange={(v) => set("kategori", v)} genislik="w-[120px]" />
          <FiltreSelect etiket={t("Format")} deger={format} secenekler={FORMATLAR} onChange={(v) => set("format", v)} genislik="w-[92px]" />
          <FiltreSelect etiket={t("Durum")} deger={durum} secenekler={DURUMLAR} onChange={(v) => set("durum", v)} genislik="w-[112px]" />
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
                    <TableHead className="whitespace-nowrap">{t("Rapor Adı")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Kategori")}</TableHead>
                    <TableHead className="min-w-[240px]">{t("Açıklama")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Format")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Sıklık")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Son Oluşturulma")}</TableHead>
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
                          <span className="text-sm">{t("Seçili filtrelere uygun rapor bulunamadı.")}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {sayfaVerisi.map((r) => {
                    const m = KATEGORI_META[r.kategori];
                    const d = DURUM_META[r.durum];
                    return (
                      <TableRow key={r.id} className="odd:bg-muted/20 hover:bg-muted/50">
                        <TableCell className="font-medium whitespace-nowrap">{t(r.ad)}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full" style={{ background: m.nokta }} />
                            {t(m.etiket)}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{t(r.aciklama)}</TableCell>
                        <TableCell><FormatRozet format={r.format} /></TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{t(r.siklik)}</TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{r.sonOlusturma}</TableCell>
                        <TableCell>
                          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", d.sinif)}>{t(d.etiket)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-0.5">
                            <Button variant="ghost" size="icon-sm" aria-label={t("Görüntüle")} nativeButton={false} render={<Link href={`/raporlar/${r.id}`} />}>
                              <Icon icon="solar:eye-bold-duotone" className="size-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" aria-label={t("Düzenle")} onClick={() => toast(`${t(r.ad)} ${t("düzenleniyor")}`)}>
                              <Icon icon="solar:pen-2-bold-duotone" className="size-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="icon-sm" aria-label={t("İndir")} onClick={() => toast.success(`${t(r.ad)} ${t("indiriliyor")}`)}>
                              <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4 text-muted-foreground" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={t("Daha fazla")} />}>
                                <MoreVertical className="size-4 text-muted-foreground" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem render={<Link href={`/raporlar/${r.id}`} />}>
                                  <Icon icon="solar:eye-bold-duotone" className="size-4" />
                                  {t("Görüntüle")}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.success(`${t(r.ad)} ${t("çoğaltıldı")}`)}>
                                  <Icon icon="solar:copy-bold-duotone" className="size-4" />
                                  {t("Çoğalt")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toast(`${t(r.ad)} ${t("arşivlendi")}`)}>
                                  <Icon icon="solar:archive-bold-duotone" className="size-4" />
                                  {t("Arşivle")}
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
                    <Button
                      key={i}
                      size="icon-sm"
                      variant={i + 1 === gecerliSayfa ? "default" : "outline"}
                      className={i + 1 === gecerliSayfa ? "bg-teal-600 text-white hover:bg-teal-700" : undefined}
                      onClick={() => setSayfa(i + 1)}
                    >
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
