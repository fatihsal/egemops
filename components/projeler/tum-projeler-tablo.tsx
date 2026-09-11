"use client";

import { Icon } from "@iconify/react";
import { MoreVertical } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { DURUM_META, KAYNAK_ETIKET, KAYNAK_RENK, RAG_META } from "@/components/projeler/stiller";
import { ProjeDetayDrawer } from "@/components/projeler/proje-detay-drawer";
import { ProjeFormDrawer } from "@/components/projeler/proje-form-drawer";
import { useProjeFiltre } from "@/components/projeler/filtre-store";
import { useProjeAnaliz } from "@/lib/queries/projeler";
import { useDil } from "@/components/providers/dil-provider";
import { sayi, sayiOndalik } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Proje, ProjeRag } from "@/lib/types";

function genelSaglik(s: Proje["saglik"]): ProjeRag {
  const d = [s.zaman, s.butce, s.tasarruf];
  if (d.includes("kirmizi")) return "kirmizi";
  if (d.includes("amber")) return "amber";
  if (d.every((x) => x === "yesil")) return "yesil";
  return "yok";
}

export function TumProjelerTablo() {
  const { data, isLoading } = useProjeAnaliz();
  const { t } = useDil();
  const { yil, durum, tur, sorumlu } = useProjeFiltre();

  const tumu = data?.projeler ?? [];
  const filtreli = tumu.filter((p) => {
    if (durum !== "Tümü" && DURUM_META[p.durum].etiket !== durum) return false;
    if (tur !== "Tümü" && KAYNAK_ETIKET[p.kaynak] !== tur) return false;
    if (sorumlu !== "Tümü" && p.sorumlu !== sorumlu) return false;
    if (!p.baslangic.endsWith(yil) && !p.hedefBitis.endsWith(yil)) return false;
    return true;
  });

  return (
    <Card id="tum-projeler" className="scroll-mt-6">
      <CardHeader>
        <h3 className="font-heading text-base font-medium">{t("Tüm Projeler")}</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading || !data ? (
          <Skeleton className="h-[320px] w-full" />
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="whitespace-nowrap">{t("Proje Adı")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Enerji Türü")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Durum")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("İlerleme")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Başlangıç")}</TableHead>
                    <TableHead className="whitespace-nowrap">{t("Hedef Bitiş")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Bütçe")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Harcanan")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Beklenen")} <span className="font-normal text-muted-foreground">(TEP/yıl)</span></TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("Doğrulanan")} <span className="font-normal text-muted-foreground">(TEP/yıl)</span></TableHead>
                    <TableHead className="whitespace-nowrap">{t("Sorumlu")}</TableHead>
                    <TableHead className="text-center whitespace-nowrap">{t("Sağlık")}</TableHead>
                    <TableHead className="text-right whitespace-nowrap">{t("İşlem")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtreli.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={13} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Icon icon="solar:folder-open-bold-duotone" className="size-9 opacity-60" />
                          <span className="text-sm">{t("Seçili filtrelere uygun proje bulunamadı.")}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                  {filtreli.map((p) => {
                    const durum = DURUM_META[p.durum];
                    const saglik = genelSaglik(p.saglik);
                    return (
                      <TableRow key={p.id} className="odd:bg-muted/20 hover:bg-muted/50">
                        <TableCell className="font-medium whitespace-nowrap">{t(p.ad)}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="size-2.5 rounded-full" style={{ background: KAYNAK_RENK[p.kaynak] }} />
                            {t(KAYNAK_ETIKET[p.kaynak])}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", durum.sinif)}>{t(durum.etiket)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <span className="block h-full rounded-full bg-teal-500" style={{ width: `${p.ilerleme}%` }} />
                            </span>
                            <span className="w-8 text-right text-xs font-medium tabular-nums text-muted-foreground">%{p.ilerleme}</span>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{p.baslangic}</TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{p.hedefBitis}</TableCell>
                        <TableCell className="text-right tabular-nums whitespace-nowrap">{sayi(p.butce)} TL</TableCell>
                        <TableCell className="text-right tabular-nums whitespace-nowrap text-muted-foreground">{sayi(p.harcanan)} TL</TableCell>
                        <TableCell className="text-right tabular-nums">{sayiOndalik(p.beklenenTasarruf)}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {p.dogrulananTasarruf != null ? <span className="font-medium text-emerald-600">{sayiOndalik(p.dogrulananTasarruf)}</span> : <span className="text-muted-foreground/50">—</span>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{t(p.sorumlu)}</TableCell>
                        <TableCell className="text-center">
                          <span className={cn("inline-block size-2.5 rounded-full", RAG_META[saglik].nokta)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-0.5">
                            <ProjeDetayDrawer
                              proje={p}
                              trigger={
                                <Button variant="ghost" size="icon-sm" aria-label={t("Görüntüle")}>
                                  <Icon icon="solar:eye-bold-duotone" className="size-4 text-muted-foreground" />
                                </Button>
                              }
                            />
                            <ProjeFormDrawer
                              proje={p}
                              trigger={
                                <Button variant="ghost" size="icon-sm" aria-label={t("Düzenle")}>
                                  <Icon icon="solar:pen-2-bold-duotone" className="size-4 text-muted-foreground" />
                                </Button>
                              }
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={t("Daha fazla")} />}>
                                <MoreVertical className="size-4 text-muted-foreground" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem onClick={() => toast(`${t(p.ad)} ${t("dışa aktarıldı")}`)}>
                                  <Icon icon="solar:download-minimalistic-bold-duotone" className="size-4" />
                                  {t("Dışa aktar")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toast(`${t(p.ad)} ${t("arşivlendi")}`)}>
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
                {filtreli.length === tumu.length
                  ? `1 – ${tumu.length} / ${tumu.length} ${t("kayıt")}`
                  : `${filtreli.length} / ${tumu.length} ${t("kayıt (filtrelenmiş)")}`}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon-sm" aria-label={t("Önceki")} disabled>
                    <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
                  </Button>
                  <Button size="icon-sm" className="bg-teal-600 text-white hover:bg-teal-700">1</Button>
                  <Button variant="outline" size="icon-sm" aria-label={t("Sonraki")} onClick={() => toast(t("Sonraki sayfa"))}>
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
