"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BosDurum } from "@/components/common/bos-durum";
import { useTedarikciler } from "@/lib/queries/satinalma";
import { tedarikciOlustur, tedarikciSil, tedarikciDogrulamaAyarla } from "@/lib/data/satinalma/tedarikciler";
import { useDil } from "@/components/providers/dil-provider";
import { queryKeys } from "@/lib/queries/keys";
import { cn } from "@/lib/utils";
import type { AramaSonucu } from "@/lib/satinalma/arama/types";

export function TedarikciListesi() {
  const sp = useSearchParams();
  const ilkSorgu = sp.get("q") ?? "";
  const { data, isLoading } = useTedarikciler();
  const { t } = useDil();
  const qc = useQueryClient();

  const [araAcik, setAraAcik] = React.useState(!!ilkSorgu);
  const [manuelAcik, setManuelAcik] = React.useState(false);

  function tazele() {
    qc.invalidateQueries({ queryKey: queryKeys.satinalma.tedarikciler });
  }

  async function dogrulamaToggle(id: string, mevcut: boolean) {
    try {
      await tedarikciDogrulamaAyarla(id, !mevcut);
      tazele();
    } catch (e) {
      toast.error(t("Güncellenemedi"), { description: e instanceof Error ? e.message : undefined });
    }
  }

  async function sil(id: string) {
    try {
      await tedarikciSil(id);
      toast.success(t("Tedarikçi silindi"));
      tazele();
    } catch (e) {
      toast.error(t("Silinemedi"), { description: e instanceof Error ? e.message : undefined });
    }
  }

  const tumu = data ?? [];

  return (
    <div className="space-y-5">
      {/* Araç çubuğu */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {t("Kayıtlı tedarikçi")}: <span className="font-semibold tabular-nums text-foreground">{tumu.length}</span>
          {" · "}
          {t("Doğrulanmış")}: <span className="font-semibold tabular-nums text-foreground">{tumu.filter((x) => x.dogrulanmis).length}</span>
        </p>
        <div className="flex gap-2">
          <Button className="h-9 gap-1.5 bg-orange-600 text-white shadow-sm hover:bg-orange-700" onClick={() => setAraAcik(true)}>
            <Icon icon="solar:magnifer-bold" className="size-4" />{t("Aday Ara")}
          </Button>
          <Button variant="outline" className="h-9 gap-1.5 bg-card" onClick={() => setManuelAcik(true)}>
            <Icon icon="solar:add-circle-linear" className="size-4" />{t("Manuel Ekle")}
          </Button>
        </div>
      </div>

      {/* Liste */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : tumu.length === 0 ? (
            <BosDurum
              ikon="solar:shop-2-bold-duotone"
              baslik={t("Henüz tedarikçi yok")}
              aciklama={t("“Aday Ara” ile doğrulanabilir kaynaklardan tedarikçi bulun veya manuel ekleyin.")}
              aksiyon={<Button className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" onClick={() => setAraAcik(true)}><Icon icon="solar:magnifer-bold" className="size-4" />{t("Aday Ara")}</Button>}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full caption-bottom text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("Tedarikçi")}</TableHead>
                    <TableHead>{t("Kaynak")}</TableHead>
                    <TableHead>{t("Ülke")}</TableHead>
                    <TableHead>{t("Durum")}</TableHead>
                    <TableHead className="text-right">{t("Aksiyon")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tumu.map((x) => (
                    <TableRow key={x.id}>
                      <TableCell>
                        <div className="min-w-0"><span className="block font-medium">{x.ad}</span>{x.eposta ? <span className="block truncate text-[11px] text-muted-foreground">{x.eposta}</span> : null}</div>
                      </TableCell>
                      <TableCell>
                        <a href={x.kaynakUrl} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-[220px] items-center gap-1 truncate text-xs text-blue-600 hover:underline dark:text-blue-400" onClick={(e) => e.stopPropagation()}>
                          <Icon icon="solar:link-linear" className="size-3.5 shrink-0" />
                          <span className="truncate">{x.webSitesi || x.kaynakUrl}</span>
                        </a>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{x.ulke || "—"}</TableCell>
                      <TableCell>
                        <button type="button" onClick={() => dogrulamaToggle(x.id, x.dogrulanmis)} className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors", x.dogrulanmis ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300")}>
                          <Icon icon={x.dogrulanmis ? "solar:verified-check-bold" : "solar:question-circle-linear"} className="size-3.5" />
                          {t(x.dogrulanmis ? "Doğrulanmış" : "Doğrulanmadı")}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <button type="button" onClick={() => sil(x.id)} aria-label={t("Sil")} className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"><Icon icon="solar:trash-bin-trash-linear" className="size-4" /></button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AdayAraSheet acik={araAcik} setAcik={setAraAcik} ilkSorgu={ilkSorgu} onKaydet={tazele} />
      <ManuelEkleSheet acik={manuelAcik} setAcik={setManuelAcik} onKaydet={tazele} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aday arama (gerçek web arama)
// ---------------------------------------------------------------------------
function AdayAraSheet({ acik, setAcik, ilkSorgu, onKaydet }: { acik: boolean; setAcik: (o: boolean) => void; ilkSorgu: string; onKaydet: () => void }) {
  const { t } = useDil();
  const [sorgu, setSorgu] = React.useState(ilkSorgu);
  const [araniyor, setAraniyor] = React.useState(false);
  const [sonuclar, setSonuclar] = React.useState<AramaSonucu[] | null>(null);
  const [kaydedilen, setKaydedilen] = React.useState<Set<string>>(new Set());
  const [ekleniyor, setEkleniyor] = React.useState<Set<string>>(new Set());

  React.useEffect(() => { if (acik) setSorgu(ilkSorgu); }, [acik, ilkSorgu]);

  async function ara() {
    if (!sorgu.trim() || araniyor) return;
    setAraniyor(true);
    setSonuclar(null);
    try {
      const yanit = await fetch("/api/satinalma/tedarikci-ara", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sorgu: sorgu.trim() }),
      });
      const metin = await yanit.text();
      const sonuc = metin ? JSON.parse(metin) : {};
      if (!yanit.ok) { toast.error(t("Arama başarısız"), { description: sonuc?.hata ?? `HTTP ${yanit.status}` }); return; }
      setSonuclar(sonuc.sonuclar ?? []);
    } catch (e) {
      toast.error(t("Arama başarısız"), { description: e instanceof Error ? e.message : undefined });
    } finally {
      setAraniyor(false);
    }
  }

  async function kaydet(r: AramaSonucu) {
    if (ekleniyor.has(r.url)) return;
    setEkleniyor((o) => new Set(o).add(r.url));
    try {
      // Gerçek siteden iletişim bilgisi bul (e-posta UYDURULMAZ; sayfadan kazınır).
      let eposta: string | null = null;
      let telefon: string | null = null;
      let digerEpostalar: string[] = [];
      try {
        const il = await fetch("/api/satinalma/tedarikci-iletisim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: r.url }),
        });
        if (il.ok) {
          const d = await il.json();
          const eps: { eposta: string }[] = d.epostalar ?? [];
          eposta = eps[0]?.eposta ?? null;
          digerEpostalar = eps.slice(1).map((x) => x.eposta);
          telefon = (d.telefonlar ?? [])[0] ?? null;
        }
      } catch { /* iletişim bulunamazsa yine de kaydet */ }

      const notlar = [r.ozet?.slice(0, 400) || "", digerEpostalar.length ? `Diğer e-postalar: ${digerEpostalar.join(", ")}` : ""].filter(Boolean).join("\n") || null;
      await tedarikciOlustur({ ad: r.baslik.slice(0, 120), kaynakUrl: r.url, webSitesi: `https://${r.alanAdi}`, eposta, telefon, notlar });
      setKaydedilen((o) => new Set(o).add(r.url));
      onKaydet();
      if (eposta) toast.success(`${t("Tedarikçi eklendi")} — ${eposta}`);
      else toast.warning(t("Tedarikçi eklendi, e-posta bulunamadı (Düzenle ile ekleyin)."));
    } catch (e) {
      toast.error(t("Eklenemedi"), { description: e instanceof Error ? e.message : undefined });
    } finally {
      setEkleniyor((o) => { const n = new Set(o); n.delete(r.url); return n; });
    }
  }

  return (
    <Sheet open={acik} onOpenChange={setAcik}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-lg">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{t("Tedarikçi Adayı Ara")}</SheetTitle>
          <SheetDescription>{t("Gerçek web araması; her aday doğrulanabilir bir kaynağa (URL) dayanır. Uydurma sonuç gösterilmez.")}</SheetDescription>
        </SheetHeader>

        <div className="flex gap-2 border-b p-4">
          <Input value={sorgu} onChange={(e) => setSorgu(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") ara(); }} placeholder={t("Örn. Festo pnömatik silindir tedarikçi")} className="h-9" />
          <Button className="h-9 shrink-0 gap-1.5 bg-orange-600 text-white hover:bg-orange-700" disabled={araniyor} onClick={ara}>
            <Icon icon={araniyor ? "svg-spinners:180-ring" : "solar:magnifer-bold"} className="size-4" />{t("Ara")}
          </Button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {sonuclar === null ? (
            <p className="px-2 py-10 text-center text-sm text-muted-foreground">{t("Arama yapmak için bir sorgu girin.")}</p>
          ) : sonuclar.length === 0 ? (
            <p className="px-2 py-10 text-center text-sm text-muted-foreground">{t("Sonuç bulunamadı.")}</p>
          ) : (
            sonuclar.map((r) => {
              const eklendi = kaydedilen.has(r.url);
              const ekleniyorMu = ekleniyor.has(r.url);
              return (
                <div key={r.url} className="rounded-xl border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{r.baslik}</p>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"><Icon icon="solar:link-linear" className="size-3.5" />{r.alanAdi}</a>
                    </div>
                    <Button size="sm" variant={eklendi ? "outline" : "default"} className={cn("shrink-0 gap-1", !eklendi && "bg-orange-600 text-white hover:bg-orange-700")} disabled={eklendi || ekleniyorMu} onClick={() => kaydet(r)}>
                      <Icon icon={ekleniyorMu ? "svg-spinners:180-ring" : eklendi ? "solar:check-circle-bold" : "solar:add-circle-linear"} className="size-4" />{t(ekleniyorMu ? "Bulunuyor…" : eklendi ? "Eklendi" : "Ekle")}
                    </Button>
                  </div>
                  {r.ozet ? <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{r.ozet}</p> : null}
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Manuel ekleme (kaynak URL zorunlu)
// ---------------------------------------------------------------------------
function ManuelEkleSheet({ acik, setAcik, onKaydet }: { acik: boolean; setAcik: (o: boolean) => void; onKaydet: () => void }) {
  const { t } = useDil();
  const [ad, setAd] = React.useState("");
  const [kaynakUrl, setKaynakUrl] = React.useState("");
  const [web, setWeb] = React.useState("");
  const [eposta, setEposta] = React.useState("");
  const [telefon, setTelefon] = React.useState("");
  const [ulke, setUlke] = React.useState("");
  const [notlar, setNotlar] = React.useState("");
  const [kaydediliyor, setKaydediliyor] = React.useState(false);

  function sifirla() { setAd(""); setKaynakUrl(""); setWeb(""); setEposta(""); setTelefon(""); setUlke(""); setNotlar(""); }

  async function kaydet() {
    if (!ad.trim()) { toast.error(t("Tedarikçi adı gerekli.")); return; }
    if (!kaynakUrl.trim()) { toast.error(t("Doğrulanabilir kaynak URL'i zorunludur.")); return; }
    if (kaydediliyor) return;
    setKaydediliyor(true);
    try {
      await tedarikciOlustur({ ad: ad.trim(), kaynakUrl: kaynakUrl.trim(), webSitesi: web.trim() || null, eposta: eposta.trim() || null, telefon: telefon.trim() || null, ulke: ulke.trim() || null, notlar: notlar.trim() || null });
      toast.success(t("Tedarikçi eklendi"));
      onKaydet();
      sifirla();
      setAcik(false);
    } catch (e) {
      toast.error(t("Eklenemedi"), { description: e instanceof Error ? e.message : undefined });
    } finally {
      setKaydediliyor(false);
    }
  }

  return (
    <Sheet open={acik} onOpenChange={(o) => { if (o) sifirla(); setAcik(o); }}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-5">
          <SheetTitle>{t("Manuel Tedarikçi Ekle")}</SheetTitle>
          <SheetDescription>{t("Kaynak URL'i zorunludur — tedarikçinin doğrulanabilir olması için.")}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Tedarikçi Adı")} *</Label><Input value={ad} onChange={(e) => setAd(e.target.value)} placeholder="Festo Türkiye" /></div>
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Kaynak URL")} *</Label><Input value={kaynakUrl} onChange={(e) => setKaynakUrl(e.target.value)} placeholder="https://..." /></div>
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Web Sitesi")}</Label><Input value={web} onChange={(e) => setWeb(e.target.value)} placeholder="https://festo.com.tr" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("E-posta")}</Label><Input value={eposta} onChange={(e) => setEposta(e.target.value)} placeholder="info@..." /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Telefon")}</Label><Input value={telefon} onChange={(e) => setTelefon(e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Ülke")}</Label><Input value={ulke} onChange={(e) => setUlke(e.target.value)} placeholder="Türkiye" /></div>
          <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">{t("Notlar")}</Label><Textarea value={notlar} onChange={(e) => setNotlar(e.target.value)} rows={3} /></div>
        </div>
        <SheetFooter className="flex-row justify-end gap-2 border-t">
          <SheetClose render={<Button variant="outline" />}>{t("İptal")}</SheetClose>
          <Button className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" disabled={kaydediliyor} onClick={kaydet}><Icon icon={kaydediliyor ? "svg-spinners:180-ring" : "solar:diskette-bold-duotone"} className="size-4" />{t("Ekle")}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
