"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSop, useMakineler } from "@/lib/queries/bakim";
import { useProfil } from "@/lib/hooks/use-profil";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";
import { MADDE_TURU_ETIKET } from "@/components/bakim/makineler/stiller";
import type { SopMadde } from "@/lib/types/bakim";

type UygDurum = "bekliyor" | "yapiliyor" | "yapildi" | "uygulanmadi" | "bulguVar";

type UygMadde = SopMadde & {
  durum: UygDurum;
  bakimci: string;
  altKontrol: { metin: string; tik: boolean }[];
  malzeme: string[];
  not: string;
  oncesiFoto: boolean;
  sonrasiFoto: boolean;
  ekFoto: number;
};

const UYG_META: Record<UygDurum, { liste: string; sinif: string; nokta: string; ikon: string }> = {
  bekliyor: { liste: "Bekliyor", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", nokta: "bg-amber-500", ikon: "solar:clock-circle-bold" },
  yapiliyor: { liste: "Devam Ediyor", sinif: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", nokta: "bg-blue-500", ikon: "solar:refresh-circle-bold" },
  yapildi: { liste: "Tamamlandı", sinif: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300", nokta: "bg-emerald-500", ikon: "solar:check-circle-bold" },
  uygulanmadi: { liste: "Uygulanmadı", sinif: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300", nokta: "bg-red-500", ikon: "solar:close-circle-bold" },
  bulguVar: { liste: "Bulgu Var", sinif: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", nokta: "bg-amber-500", ikon: "solar:danger-triangle-bold" },
};

const DURUM_BUTON: { d: UygDurum; etiket: string; aktif: string; ikon: string }[] = [
  { d: "yapildi", etiket: "Yapıldı", aktif: "border-emerald-500 bg-emerald-500 text-white", ikon: "solar:check-circle-bold" },
  { d: "yapiliyor", etiket: "Yapılıyor", aktif: "border-blue-500 bg-blue-600 text-white", ikon: "solar:clock-circle-bold" },
  { d: "uygulanmadi", etiket: "Uygulanmadı", aktif: "border-red-500 bg-red-500 text-white", ikon: "solar:close-circle-bold" },
  { d: "bulguVar", etiket: "Bulgu Var", aktif: "border-amber-500 bg-amber-500 text-white", ikon: "solar:danger-triangle-bold" },
];

const TEKNISYENLER = ["Mehmet Y.", "Ali K.", "Serkan K."];

type GozlemAnahtar = "mekanik" | "elektrik" | "sensor" | "emniyet" | "pnomatik";
const GOZLEM_ALANLAR: { a: GozlemAnahtar; etiket: string }[] = [
  { a: "mekanik", etiket: "Mekanik Durum" },
  { a: "elektrik", etiket: "Elektriksel Durum" },
  { a: "sensor", etiket: "Sensörler" },
  { a: "emniyet", etiket: "Emniyet" },
  { a: "pnomatik", etiket: "Pnömatik / Vakum" },
];
const GOZLEM_SECENEK: { v: string; etiket: string; renk: string }[] = [
  { v: "normal", etiket: "Normal", renk: "bg-emerald-500" },
  { v: "takip", etiket: "Takip", renk: "bg-amber-500" },
  { v: "ariza", etiket: "Arıza", renk: "bg-red-500" },
];

function basHarf(ad: string) {
  return ad.split(/\s+/).slice(0, 2).map((p) => p[0] ?? "").join("").toLocaleUpperCase("tr");
}

function altKontrolUret(m: SopMadde): { metin: string; tik: boolean }[] {
  const temel: Record<string, string[]> = {
    temizlik: ["Yüzey ve parçalar temizlendi", "Kalıntı/kir kontrolü yapıldı"],
    gorsel: ["Görsel inceleme yapıldı", "Anormallik/aşınma kontrol edildi"],
    ayar: ["Mevcut değer ölçüldü", "Ayar/kalibrasyon uygulandı"],
    seviye: ["Seviye/ölçüm okundu", "Referans değerle karşılaştırıldı"],
    islem: ["İşlem uygulandı", "Sonuç doğrulandı"],
  };
  return [...(temel[m.turu] ?? ["Kontrol yapıldı"]), "Kayıt altına alındı"].map((metin) => ({ metin, tik: false }));
}

export function SopDoldur() {
  const { t } = useDil();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data: sop, isLoading } = useSop(id ?? "");
  const { data: makineler } = useMakineler();
  const { profil } = useProfil();

  const aktif = sop?.versiyonlar.find((v) => v.id === sop.aktifVersiyonId) ?? sop?.versiyonlar[sop.versiyonlar.length - 1];

  const [maddeler, setMaddeler] = React.useState<UygMadde[]>([]);
  const [secili, setSecili] = React.useState(0);
  const [filtre, setFiltre] = React.useState<"tumu" | "yapildi" | "bekleyen" | "fotolu">("tumu");
  const [gozlem, setGozlem] = React.useState<Record<GozlemAnahtar, string>>({ mekanik: "normal", elektrik: "normal", sensor: "normal", emniyet: "normal", pnomatik: "normal" });
  const [gozlemNot, setGozlemNot] = React.useState("");

  React.useEffect(() => {
    if (aktif) {
      setMaddeler(aktif.maddeler.map((m, i) => ({
        ...m,
        durum: (i < 2 ? "yapildi" : i === 2 ? "yapiliyor" : "bekliyor") as UygDurum,
        bakimci: TEKNISYENLER[i % TEKNISYENLER.length],
        altKontrol: altKontrolUret(m).map((a, j) => ({ ...a, tik: i < 2 || (i === 2 && j < 2) })),
        malzeme: i === 2 ? ["Sabunlu Su Spreyi"] : [],
        not: i === 2 ? "Hatlarda küçük bir kaçak tespit edildi. İlgili bağlantı rekoru sıkıldı, test sonrası sistem normal çalışıyor." : "",
        oncesiFoto: i < 3,
        sonrasiFoto: i < 2,
        ekFoto: i === 2 ? 2 : 0,
      })));
      setSecili(2);
    }
  }, [aktif?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !sop || !aktif) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
        <div className="grid gap-5 xl:grid-cols-[280px_1fr_300px]"><Skeleton className="h-96 w-full" /><Skeleton className="h-96 w-full" /><Skeleton className="h-96 w-full" /></div>
      </div>
    );
  }

  const makineAd = sop.makineId ? makineler?.find((m) => m.id === sop.makineId)?.ad ?? sop.makineId : null;
  const toplam = maddeler.length;
  const tamamlanan = maddeler.filter((m) => m.durum === "yapildi").length;
  const bekleyen = maddeler.filter((m) => m.durum === "bekliyor").length;
  const fotoluSay = maddeler.filter((m) => m.fotoGereksinimi !== "yok").length;
  const fotoZorunlu = maddeler.filter((m) => m.fotoGereksinimi === "zorunlu").length;
  const atananBakimci = new Set(maddeler.map((m) => m.bakimci)).size;
  const yuzde = toplam ? Math.round((tamamlanan / toplam) * 100) : 0;

  const filtreli = maddeler
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => filtre === "tumu" || (filtre === "yapildi" && m.durum === "yapildi") || (filtre === "bekleyen" && m.durum === "bekliyor") || (filtre === "fotolu" && m.fotoGereksinimi !== "yok"));

  const secM = maddeler[secili];

  function guncelle(i: number, p: Partial<UygMadde>) {
    setMaddeler((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...p } : m)));
  }
  function altTik(i: number, j: number) {
    setMaddeler((prev) => prev.map((m, idx) => idx === i ? { ...m, altKontrol: m.altKontrol.map((a, k) => k === j ? { ...a, tik: !a.tik } : a) } : m));
  }
  function malzemeSil(i: number, mz: string) {
    guncelle(i, { malzeme: (maddeler[i]?.malzeme ?? []).filter((x) => x !== mz) });
  }
  function malzemeEkle(i: number) {
    const ad = `Malzeme ${(maddeler[i]?.malzeme.length ?? 0) + 1}`;
    guncelle(i, { malzeme: [...(maddeler[i]?.malzeme ?? []), ad] });
  }

  // Kapatma kontrolü
  const kZorunlu = maddeler.filter((m) => m.fotoGereksinimi === "zorunlu").every((m) => m.durum === "yapildi") && tamamlanan > 0;
  const kFoto = maddeler.filter((m) => m.fotoGereksinimi === "zorunlu").every((m) => m.oncesiFoto && m.sonrasiFoto);
  const kNot = maddeler.filter((m) => m.durum === "bulguVar").every((m) => m.not.trim() !== "");
  const kGozlem = gozlemNot.trim() !== "";

  const kapatma = [
    { e: "Zorunlu maddeler tamamlandı", ok: kZorunlu },
    { e: "Fotoğraflar yüklendi", ok: kFoto },
    { e: "Notlar girildi", ok: kNot },
    { e: "Gözlem hazır", ok: kGozlem },
  ];

  const kpi = [
    { ik: "solar:documents-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Toplam Madde", deger: String(toplam), alt: "SOP adımı" },
    { ik: "solar:check-circle-bold-duotone", renk: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", baslik: "Tamamlanan", deger: String(tamamlanan), alt: "madde tamamlandı" },
    { ik: "solar:users-group-rounded-bold-duotone", renk: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300", baslik: "Atanan Bakımcı", deger: String(atananBakimci), alt: "teknisyen" },
    { ik: "solar:camera-bold-duotone", renk: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300", baslik: "Fotoğraf Zorunlu", deger: String(fotoZorunlu), alt: "madde" },
    { ik: "solar:chart-2-bold-duotone", renk: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: "Tamamlanma Oranı", deger: `%${yuzde}`, alt: `${tamamlanan} / ${toplam} madde`, ilerleme: yuzde },
    { ik: "solar:play-circle-bold-duotone", renk: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300", baslik: "Durum", deger: yuzde === 100 ? "Tamamlandı" : "Devam Ediyor", alt: "Planlanan tarihte", rozet: true },
  ];

  const ozet: { e: string; d: string }[] = [
    { e: "Makine", d: makineAd ?? "—" },
    { e: "Bakım Tipi", d: sop.ad.includes("Yıllık") ? "Yıllık" : sop.ad.includes("6 Aylık") ? "6 Aylık" : sop.ad.includes("Kalibrasyon") ? "Kalibrasyon" : "Periyodik" },
    { e: "SOP Revizyon", d: `Rev ${aktif.rev}` },
    { e: "Planlanan Tarih", d: "05.10.2026" },
    { e: "Başlama Saati", d: "08:30" },
    { e: "Sorumlu Ekip", d: "Bakım Onarım" },
  ];

  const gecmis = maddeler.filter((m) => m.durum !== "bekliyor").slice(0, 6).map((m, i) => ({
    saat: `0${9 - i}:${(42 - i * 9 + 60) % 60}`.replace(/:(\d)$/, ":0$1"),
    madde: `${m.no} – ${t(m.baslik)}`,
    bakimci: m.bakimci,
    durum: m.durum,
    not: m.durum === "bulguVar" ? (m.not ? m.not.slice(0, 24) + "…" : "-") : m.durum === "yapildi" ? "Tamamlandı" : "-",
  }));

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/bakim/sop" className="hover:text-foreground">{t("SOP & Dokümanlar")}</Link>
            <Icon icon="solar:alt-arrow-right-linear" className="size-3" />
            <Link href="/bakim/sop" className="hover:text-foreground">{t("SOP Listesi")}</Link>
            <Icon icon="solar:alt-arrow-right-linear" className="size-3" />
            <span className="text-foreground">{t("Uygulama Formu")}</span>
          </p>
          <h1 className="font-heading text-2xl font-bold tracking-tight">{makineAd ? `${makineAd} – ` : ""}{t(sop.ad)}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{t("Bakım adımlarını sırasıyla uygulayın; her maddeyi tamamlayıp gerekli fotoğrafları yükleyin.")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 gap-1.5 bg-card" nativeButton={false} render={<Link href="/bakim/sop" />}>
            <Icon icon="solar:alt-arrow-left-linear" className="size-4" /> {t("SOP Listesine Dön")}
          </Button>
          <Button variant="outline" size="icon" className="bg-card" aria-label={t("Yazdır")} onClick={() => window.print()}>
            <Icon icon="solar:printer-bold-duotone" className="size-4" />
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpi.map((k) => (
          <Card key={k.baslik}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", k.renk)}><Icon icon={k.ik} className="size-5" /></span>
                <p className="text-xs leading-tight text-muted-foreground">{t(k.baslik)}</p>
              </div>
              {k.rozet ? (
                <span className={cn("mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-sm font-semibold", yuzde === 100 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300")}>{t(k.deger)}</span>
              ) : (
                <p className="mt-2 font-heading text-2xl font-bold tracking-tight tabular-nums">{t(k.deger)}</p>
              )}
              {typeof k.ilerleme === "number" ? (
                <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full bg-blue-500" style={{ width: `${k.ilerleme}%` }} /></span>
              ) : (
                <p className="mt-0.5 text-[11px] text-muted-foreground">{t(k.alt)}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3 panel */}
      <div className="grid gap-5 xl:grid-cols-[minmax(260px,300px)_minmax(0,1fr)_minmax(280px,320px)]">
        {/* SOL: SOP Adımları */}
        <Card className="xl:sticky xl:top-4 xl:max-h-[calc(100vh-6rem)] xl:self-start xl:overflow-hidden">
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <div className="flex items-center gap-2"><Icon icon="solar:checklist-minimalistic-bold-duotone" className="size-5 text-blue-500" /><h3 className="font-heading text-base font-medium">{t("SOP Adımları")}</h3></div>
            <span className="text-xs text-muted-foreground">{toplam} {t("madde")}</span>
          </CardHeader>
          <CardContent className="space-y-3 p-3">
            <div className="flex flex-wrap gap-1">
              {([["tumu", "Tümü", toplam], ["yapildi", "Tamamlanan", tamamlanan], ["bekleyen", "Bekleyen", bekleyen], ["fotolu", "Fotoğraflı", fotoluSay]] as const).map(([f, et, n]) => (
                <button key={f} type="button" onClick={() => setFiltre(f)} className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition-colors", filtre === f ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  {t(et)} <span className="tabular-nums opacity-80">{n}</span>
                </button>
              ))}
            </div>
            <div className="-mx-1 max-h-[60vh] space-y-0.5 overflow-y-auto px-1 xl:max-h-[calc(100vh-16rem)]">
              {filtreli.map(({ m, i }) => {
                const um = UYG_META[m.durum];
                return (
                  <button key={m.id} type="button" onClick={() => setSecili(i)} className={cn("flex w-full items-center gap-2 rounded-lg border p-2 text-left transition-colors", i === secili ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50" : "border-transparent hover:bg-muted")}>
                    <span className="w-5 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">{m.no}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{t(m.baslik)}</span>
                      <span className={cn("mt-0.5 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium", um.sinif)}><span className={cn("size-1.5 rounded-full", um.nokta)} />{t(um.liste)}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      {m.fotoGereksinimi !== "yok" ? <Icon icon="solar:camera-linear" className="size-3.5 text-muted-foreground" /> : null}
                      <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground">{basHarf(m.bakimci)}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ORTA: Seçili Madde */}
        {secM ? (
          <Card>
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">
              <div className="flex items-center gap-2"><Icon icon="solar:clipboard-text-bold-duotone" className="size-5 text-blue-500" /><h3 className="font-heading text-base font-medium">{t("Seçili SOP Maddesi")}</h3></div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" className="h-7 gap-1 bg-card text-xs" disabled={secili === 0} onClick={() => setSecili((s) => Math.max(0, s - 1))}><Icon icon="solar:alt-arrow-left-linear" className="size-3.5" />{t("Önceki")}</Button>
                <span className="text-xs tabular-nums text-muted-foreground">{secili + 1} / {toplam}</span>
                <Button variant="outline" size="sm" className="h-7 gap-1 bg-card text-xs" disabled={secili >= toplam - 1} onClick={() => setSecili((s) => Math.min(toplam - 1, s + 1))}>{t("Sonraki")}<Icon icon="solar:alt-arrow-right-linear" className="size-3.5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="font-heading text-lg font-semibold">{secM.no} – {t(secM.baslik)}</h2>
                {secM.fotoGereksinimi === "zorunlu" ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300"><Icon icon="solar:camera-bold" className="size-3" />{t("Fotoğraf Zorunlu")}</span> : null}
              </div>

              {/* Atanan bakımcı */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-xs text-muted-foreground">{t("Atanan Bakımcı")}:</span>
                <span className="inline-flex items-center gap-1.5"><span className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">{basHarf(secM.bakimci)}</span>{secM.bakimci}</span>
                <Button variant="outline" size="sm" className="h-6 gap-1 bg-card text-[11px]" onClick={() => toast(t("Bu özellik yakında eklenecek."))}><Icon icon="solar:add-circle-linear" className="size-3" />{t("Bakımcı Ekle")}</Button>
              </div>

              {/* Talimat */}
              {secM.aciklama ? (
                <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3 dark:border-blue-900 dark:bg-blue-950/40">
                  <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300"><Icon icon="solar:info-circle-bold" className="size-3.5" />{t("Uygulama Talimatı")}</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200">{t(secM.aciklama)}</p>
                </div>
              ) : null}

              {/* Uygulama Durumu */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">{t("Uygulama Durumu")}</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {DURUM_BUTON.map((b) => {
                    const sec = secM.durum === b.d;
                    return (
                      <button key={b.d} type="button" onClick={() => guncelle(secili, { durum: b.d })} className={cn("flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors", sec ? b.aktif : "border-border bg-card hover:bg-muted")}>
                        <Icon icon={b.ikon} className="size-4" />{t(b.etiket)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kontrol Listesi */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">{t("Kontrol Listesi")}</p>
                <div className="space-y-1.5">
                  {secM.altKontrol.map((a, j) => (
                    <label key={j} className="flex cursor-pointer items-start gap-2 text-sm">
                      <input type="checkbox" checked={a.tik} onChange={() => altTik(secili, j)} className="mt-0.5 size-4 shrink-0 rounded border-slate-300 accent-blue-600 dark:border-slate-600" />
                      <span className="tabular-nums text-muted-foreground">{secM.no}.{j + 1}</span>
                      <span className={cn(a.tik && "text-muted-foreground line-through")}>{t(a.metin)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Malzeme + Not */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">{t("Kullanılan Malzeme")}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {secM.malzeme.map((mz) => (
                      <span key={mz} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs">{t(mz)}<button type="button" onClick={() => malzemeSil(secili, mz)} aria-label={t("Kaldır")}><Icon icon="solar:close-circle-bold" className="size-3.5 text-muted-foreground hover:text-foreground" /></button></span>
                    ))}
                    <Button variant="outline" size="sm" className="h-6 gap-1 bg-card text-[11px]" onClick={() => malzemeEkle(secili)}><Icon icon="solar:add-circle-linear" className="size-3" />{t("Malzeme Ekle")}</Button>
                  </div>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between"><p className="text-xs font-medium text-muted-foreground">{t("Bakım Notu")}</p><span className="text-[10px] text-muted-foreground tabular-nums">{secM.not.length}/500</span></div>
                  <Textarea value={secM.not} maxLength={500} onChange={(e) => guncelle(secili, { not: e.target.value })} placeholder={t("Yapılan işlem / tespit edilen durum…")} className="min-h-16 bg-card text-sm" />
                </div>
              </div>

              {/* Alt butonlar */}
              <div className="flex flex-wrap items-center justify-end gap-2 border-t pt-4">
                <Button variant="outline" className="h-9 gap-1.5 bg-card" onClick={() => toast.success(t("Kaydedildi."))}><Icon icon="solar:diskette-bold-duotone" className="size-4" />{t("Kaydet")}</Button>
                <Button variant="outline" className="h-9 gap-1.5 bg-card" disabled={secili >= toplam - 1} onClick={() => setSecili((s) => Math.min(toplam - 1, s + 1))}>{t("Sonraki Madde")}<Icon icon="solar:alt-arrow-right-linear" className="size-4" /></Button>
                <Button className="h-9 gap-1.5 bg-blue-600 text-white shadow-sm hover:bg-blue-700" onClick={() => { guncelle(secili, { durum: "yapildi" }); toast.success(t("Madde tamamlandı.")); if (secili < toplam - 1) setSecili((s) => s + 1); }}><Icon icon="solar:check-circle-bold" className="size-4" />{t("Maddeyi Tamamla")}</Button>
              </div>
            </CardContent>
          </Card>
        ) : <div />}

        {/* SAĞ: Foto + Özet + Kapatma */}
        <div className="space-y-5">
          {/* Fotoğraf Kanıtları */}
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
              <div className="flex items-center gap-2"><Icon icon="solar:gallery-bold-duotone" className="size-5 text-blue-500" /><h3 className="font-heading text-sm font-medium">{t("Fotoğraf Kanıtları")}</h3></div>
              {secM?.fotoGereksinimi === "zorunlu" ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300"><Icon icon="solar:camera-bold" className="size-3" />{t("Fotoğraf Zorunlu")}</span> : null}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {([["oncesiFoto", "Öncesi Fotoğraf"], ["sonrasiFoto", "Sonrası Fotoğraf"]] as const).map(([k, et]) => {
                  const dolu = secM?.[k];
                  return (
                    <div key={k}>
                      <p className="mb-1 text-[11px] font-medium">{t(et)} <span className="text-red-500">*</span></p>
                      {dolu ? (
                        <div className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-gradient-to-br from-blue-100 to-slate-200 dark:from-blue-950 dark:to-slate-800">
                          <span className="flex size-full items-center justify-center text-blue-500/70"><Icon icon="solar:gallery-bold-duotone" className="size-8" /></span>
                          <button type="button" onClick={() => guncelle(secili, { [k]: false } as Partial<UygMadde>)} aria-label={t("Kaldır")} className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100"><Icon icon="solar:trash-bin-minimalistic-bold" className="size-3.5" /></button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => guncelle(secili, { [k]: true } as Partial<UygMadde>)} className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs text-muted-foreground hover:border-blue-400 hover:text-blue-500"><Icon icon="solar:camera-add-bold" className="size-6" />{t("Fotoğraf Ekle")}</button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div>
                <p className="mb-1 text-[11px] font-medium text-muted-foreground">{t("Ek Görseller")} ({t("Opsiyonel")})</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: secM?.ekFoto ?? 0 }).map((_, j) => (
                    <div key={j} className="group relative size-14 overflow-hidden rounded-lg border bg-gradient-to-br from-blue-100 to-slate-200 dark:from-blue-950 dark:to-slate-800"><span className="flex size-full items-center justify-center text-blue-500/70"><Icon icon="solar:gallery-bold-duotone" className="size-5" /></span><button type="button" onClick={() => guncelle(secili, { ekFoto: Math.max(0, (secM?.ekFoto ?? 1) - 1) })} aria-label={t("Kaldır")} className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-black/55 text-white opacity-0 group-hover:opacity-100"><Icon icon="solar:close-circle-bold" className="size-3.5" /></button></div>
                  ))}
                  <button type="button" onClick={() => guncelle(secili, { ekFoto: (secM?.ekFoto ?? 0) + 1 })} className="flex size-14 flex-col items-center justify-center rounded-lg border border-dashed text-[10px] text-muted-foreground hover:border-blue-400 hover:text-blue-500"><Icon icon="solar:add-circle-linear" className="size-4" /></button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bakım Özeti + Kapatma Kontrolü */}
          <Card>
            <CardHeader><h3 className="font-heading text-sm font-medium">{t("Bakım Özeti")}</h3></CardHeader>
            <CardContent className="space-y-3">
              <dl className="space-y-1.5 text-sm">
                {ozet.map((r) => (<div key={r.e} className="flex items-center justify-between gap-2"><dt className="text-muted-foreground">{t(r.e)}</dt><dd className="font-medium">{t(r.d)}</dd></div>))}
              </dl>
              <div className="border-t pt-3">
                <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold"><Icon icon="solar:lock-keyhole-minimalistic-bold-duotone" className="size-4 text-emerald-500" />{t("Kapatma Kontrolü")}</p>
                <div className="space-y-1.5">
                  {kapatma.map((k) => (
                    <div key={k.e} className="flex items-center gap-2 text-sm"><Icon icon={k.ok ? "solar:check-circle-bold" : "solar:close-circle-linear"} className={cn("size-4", k.ok ? "text-emerald-500" : "text-muted-foreground/50")} /><span className={cn(!k.ok && "text-muted-foreground")}>{t(k.e)}</span></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alt: Genel Gözlem + İşlem Geçmişi */}
      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-2 space-y-0"><Icon icon="solar:clipboard-heart-bold-duotone" className="size-5 text-violet-500" /><h3 className="font-heading text-base font-medium">{t("Bakım Sonrası Genel Gözlem")}</h3></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {GOZLEM_ALANLAR.map((g) => (
                <div key={g.a}>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">{t(g.etiket)}</p>
                  <Select value={gozlem[g.a]} onValueChange={(v) => setGozlem((p) => ({ ...p, [g.a]: v ?? "normal" }))}>
                    <SelectTrigger size="sm" className="w-full bg-card">
                      <span className="inline-flex items-center gap-2"><span className={cn("size-2 rounded-full", GOZLEM_SECENEK.find((s) => s.v === gozlem[g.a])?.renk)} /><SelectValue /></span>
                    </SelectTrigger>
                    <SelectContent>{GOZLEM_SECENEK.map((s) => <SelectItem key={s.v} value={s.v}>{t(s.etiket)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between"><p className="text-xs font-medium text-muted-foreground">{t("Genel Gözlem Notu")}</p><span className="text-[10px] text-muted-foreground tabular-nums">{gozlemNot.length}/500</span></div>
              <Textarea value={gozlemNot} maxLength={500} onChange={(e) => setGozlemNot(e.target.value)} placeholder={t("Bakım sonrası makinenin genel durumunu özetleyin…")} className="min-h-16 bg-card text-sm" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0"><div className="flex items-center gap-2"><Icon icon="solar:history-bold-duotone" className="size-5 text-blue-500" /><h3 className="font-heading text-base font-medium">{t("Son İşlem Geçmişi")}</h3></div></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead><tr className="border-b text-left text-xs text-muted-foreground"><th className="pr-2 pb-2 font-medium">{t("Saat")}</th><th className="pr-2 pb-2 font-medium">{t("Madde")}</th><th className="pr-2 pb-2 font-medium">{t("Bakımcı")}</th><th className="pb-2 font-medium">{t("Durum")}</th></tr></thead>
              <tbody>
                {gecmis.map((g, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-2 tabular-nums whitespace-nowrap text-muted-foreground">{g.saat}</td>
                    <td className="py-2 pr-2"><span className="line-clamp-1">{g.madde}</span></td>
                    <td className="py-2 pr-2 whitespace-nowrap">{g.bakimci}</td>
                    <td className="py-2"><span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", UYG_META[g.durum].sinif)}><span className={cn("size-1.5 rounded-full", UYG_META[g.durum].nokta)} />{t(UYG_META[g.durum].liste)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
