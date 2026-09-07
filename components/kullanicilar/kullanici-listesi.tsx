"use client";

import * as React from "react";
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
import { DURUM_META, ROL_META } from "@/components/kullanicilar/stiller";
import { KullaniciFormDrawer } from "@/components/kullanicilar/kullanici-form-drawer";
import { useKullaniciFiltre } from "@/components/kullanicilar/filtre-store";
import { useKullaniciAnaliz } from "@/lib/queries/kullanicilar";
import { cn } from "@/lib/utils";

const ROLLER = ["Tümü", "Yönetici", "Editör", "Görüntüleyici"];
const DURUMLAR = ["Tümü", "Aktif", "Pasif", "Davet Bekliyor"];
const SAYFA_BOYUTU = 8;

function FiltreSelect({ etiket, deger, secenekler, onChange, genislik }: {
  etiket: string; deger: string; secenekler: string[]; onChange: (v: string) => void; genislik: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card pl-3 shadow-sm">
      <span className="text-xs font-medium text-muted-foreground">{etiket}</span>
      <Select value={deger} onValueChange={(v) => onChange(v as string)}>
        <SelectTrigger className={`h-9 border-0 bg-transparent shadow-none ${genislik}`}><SelectValue /></SelectTrigger>
        <SelectContent>{secenekler.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  );
}

export function KullaniciListesi() {
  const { data, isLoading } = useKullaniciAnaliz();
  const { arama, rol, durum, set, aktifMi, sifirla } = useKullaniciFiltre();
  const [sayfa, setSayfa] = React.useState(1);

  const tumu = data?.kullanicilar ?? [];
  const filtreli = tumu.filter((u) => {
    if (arama && !`${u.ad} ${u.email} ${u.departman}`.toLocaleLowerCase("tr").includes(arama.toLocaleLowerCase("tr"))) return false;
    if (rol !== "Tümü" && ROL_META[u.rol].etiket !== rol) return false;
    if (durum !== "Tümü" && DURUM_META[u.durum].etiket !== durum) return false;
    return true;
  });

  const filtreImza = `${arama}|${rol}|${durum}`;
  React.useEffect(() => { setSayfa(1); }, [filtreImza]);

  const toplamSayfa = Math.max(1, Math.ceil(filtreli.length / SAYFA_BOYUTU));
  const gecerliSayfa = Math.min(sayfa, toplamSayfa);
  const basla = (gecerliSayfa - 1) * SAYFA_BOYUTU;
  const sayfaVerisi = filtreli.slice(basla, basla + SAYFA_BOYUTU);

  return (
    <Card>
      <CardHeader className="flex-col gap-3 @2xl/card-header:flex-row @2xl/card-header:items-center @2xl/card-header:justify-between">
        <h3 className="font-heading text-base font-medium">Kullanıcı Listesi</h3>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={arama} onChange={(e) => set("arama", e.target.value)} placeholder="İsim, e-posta ara..." className="h-9 w-[210px] pl-8" />
          </div>
          <FiltreSelect etiket="Rol" deger={rol} secenekler={ROLLER} onChange={(v) => set("rol", v)} genislik="w-[130px]" />
          <FiltreSelect etiket="Durum" deger={durum} secenekler={DURUMLAR} onChange={(v) => set("durum", v)} genislik="w-[140px]" />
          {aktifMi ? (
            <Button variant="ghost" size="sm" className="h-9 gap-1 text-muted-foreground" onClick={sifirla}>
              <Icon icon="solar:restart-linear" className="size-4" />Sıfırla
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
                    <TableHead className="whitespace-nowrap">Kullanıcı</TableHead>
                    <TableHead className="whitespace-nowrap">Rol</TableHead>
                    <TableHead className="whitespace-nowrap">Departman</TableHead>
                    <TableHead className="whitespace-nowrap">Durum</TableHead>
                    <TableHead className="whitespace-nowrap">Son Giriş</TableHead>
                    <TableHead className="text-right whitespace-nowrap">İşlem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sayfaVerisi.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">Kullanıcı bulunamadı.</TableCell></TableRow>
                  ) : null}
                  {sayfaVerisi.map((u) => {
                    const rm = ROL_META[u.rol];
                    const dm = DURUM_META[u.durum];
                    return (
                      <TableRow key={u.id} className="odd:bg-muted/20 hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: u.renk }}>{u.bas}</span>
                            <div className="min-w-0">
                              <p className="font-medium">{u.ad}</p>
                              <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap", rm.sinif)}>{rm.etiket}</span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{u.departman}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                            <span className={cn("size-2 rounded-full", dm.nokta)} />
                            <span className="text-sm">{dm.etiket}</span>
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">{u.sonGiris}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-0.5">
                            <KullaniciFormDrawer
                              kullanici={u}
                              trigger={
                                <Button variant="ghost" size="icon-sm" aria-label="Düzenle">
                                  <Icon icon="solar:pen-2-bold-duotone" className="size-4 text-muted-foreground" />
                                </Button>
                              }
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Daha fazla" />}>
                                <MoreVertical className="size-4 text-muted-foreground" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem onClick={() => toast(`${u.ad} için şifre sıfırlama gönderildi`)}>
                                  <Icon icon="solar:key-bold-duotone" className="size-4" />
                                  Şifre Sıfırla
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast(`${u.ad} için izinler açıldı`)}>
                                  <Icon icon="solar:shield-user-bold-duotone" className="size-4" />
                                  İzinleri Yönet
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toast(`${u.ad} devre dışı bırakıldı`)}>
                                  <Icon icon="solar:user-block-bold-duotone" className="size-4" />
                                  Devre Dışı Bırak
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

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground tabular-nums">
                {filtreli.length === 0 ? "0 kayıt" : `${basla + 1} – ${Math.min(basla + SAYFA_BOYUTU, filtreli.length)} / ${filtreli.length} kullanıcı`}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon-sm" aria-label="Önceki" disabled={gecerliSayfa <= 1} onClick={() => setSayfa((s) => Math.max(1, s - 1))}>
                  <Icon icon="solar:alt-arrow-left-linear" className="size-4" />
                </Button>
                {Array.from({ length: toplamSayfa }).map((_, i) => (
                  <Button key={i} size="icon-sm" variant={i + 1 === gecerliSayfa ? "default" : "outline"} className={i + 1 === gecerliSayfa ? "bg-teal-600 text-white hover:bg-teal-700" : undefined} onClick={() => setSayfa(i + 1)}>
                    {i + 1}
                  </Button>
                ))}
                <Button variant="outline" size="icon-sm" aria-label="Sonraki" disabled={gecerliSayfa >= toplamSayfa} onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}>
                  <Icon icon="solar:alt-arrow-right-linear" className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
