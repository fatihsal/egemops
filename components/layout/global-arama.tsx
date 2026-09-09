"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AramaOgesi {
  baslik: string;
  href: string;
  ikon: string;
  grup: string;
  anahtarlar?: string;
}

const OGELER: AramaOgesi[] = [
  { baslik: "Dashboard", href: "/", ikon: "solar:widget-5-bold-duotone", grup: "Sayfalar", anahtarlar: "gösterge panosu ana sayfa özet" },
  { baslik: "Aylık Veri Girişi", href: "/veri-girisi", ikon: "solar:pen-new-square-bold-duotone", grup: "Sayfalar", anahtarlar: "fatura veri girişi" },
  { baslik: "Enerji Kayıtları", href: "/enerji-kayitlari", ikon: "solar:clipboard-list-bold-duotone", grup: "Sayfalar", anahtarlar: "kayıt aylık" },
  { baslik: "Elektrik & GES", href: "/elektrik-ges", ikon: "solar:bolt-bold-duotone", grup: "Sayfalar", anahtarlar: "elektrik güneş ges" },
  { baslik: "Doğalgaz", href: "/dogalgaz", ikon: "solar:fire-bold-duotone", grup: "Sayfalar", anahtarlar: "doğalgaz gaz" },
  { baslik: "Akaryakıt", href: "/akaryakit", ikon: "solar:gas-station-bold-duotone", grup: "Sayfalar", anahtarlar: "akaryakıt motorin benzin yakıt" },
  { baslik: "TEP Analizi", href: "/tep-analizi", ikon: "solar:chart-2-bold-duotone", grup: "Sayfalar", anahtarlar: "tep eşdeğer petrol" },
  { baslik: "Enerji Performansı", href: "/enerji-performansi", ikon: "solar:graph-up-bold-duotone", grup: "Sayfalar", anahtarlar: "enpi performans hedef" },
  { baslik: "Enerji Fırsatları", href: "/firsatlar", ikon: "solar:lightbulb-bolt-bold-duotone", grup: "Sayfalar", anahtarlar: "fırsat tasarruf verimlilik" },
  { baslik: "Enerji Projeleri", href: "/projeler", ikon: "solar:case-round-bold-duotone", grup: "Sayfalar", anahtarlar: "proje bütçe" },
  { baslik: "Raporlar", href: "/raporlar", ikon: "solar:document-text-bold-duotone", grup: "Sayfalar", anahtarlar: "rapor" },
  { baslik: "Yönetim Özeti", href: "/yonetim-ozeti", ikon: "solar:pie-chart-2-bold-duotone", grup: "Sayfalar", anahtarlar: "yönetim özeti dashboard" },
  { baslik: "Belgeler", href: "/belgeler", ikon: "solar:documents-bold-duotone", grup: "Sayfalar", anahtarlar: "belge sertifika sözleşme" },
  { baslik: "Katsayılar", href: "/katsayilar", ikon: "solar:calculator-bold-duotone", grup: "Sayfalar", anahtarlar: "katsayı dönüşüm emisyon fiyat" },
  { baslik: "Kullanıcılar", href: "/kullanicilar", ikon: "solar:users-group-rounded-bold-duotone", grup: "Sayfalar", anahtarlar: "kullanıcı rol ekip" },
  { baslik: "Ayarlar", href: "/ayarlar", ikon: "solar:settings-bold-duotone", grup: "Sayfalar", anahtarlar: "ayar profil kurum" },
  // Sık kayıtlar (örnek)
  { baslik: "Ağustos 2026 Enerji Kaydı", href: "/enerji-kayitlari/2026-08", ikon: "solar:calendar-bold-duotone", grup: "Kayıtlar" },
  { baslik: "Temmuz 2026 Enerji Kaydı", href: "/enerji-kayitlari/2026-07", ikon: "solar:calendar-bold-duotone", grup: "Kayıtlar" },
];

const kucult = (s: string) => s.toLocaleLowerCase("tr");

export function GlobalArama() {
  const router = useRouter();
  const [acik, setAcik] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [vurgu, setVurgu] = React.useState(0);

  const sonuclar = React.useMemo(() => {
    const t = kucult(q.trim());
    if (!t) return OGELER;
    return OGELER.filter(
      (o) =>
        kucult(o.baslik).includes(t) ||
        (o.anahtarlar ? kucult(o.anahtarlar).includes(t) : false),
    );
  }, [q]);

  React.useEffect(() => setVurgu(0), [q]);

  const git = (href: string) => {
    setAcik(false);
    setQ("");
    router.push(href);
  };

  const tusla = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setVurgu((v) => Math.min(v + 1, sonuclar.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setVurgu((v) => Math.max(v - 1, 0));
    } else if (e.key === "Enter" && sonuclar[vurgu]) {
      e.preventDefault();
      git(sonuclar[vurgu].href);
    }
  };

  // Sonuçları gruplara ayır
  const gruplar = sonuclar.reduce<Record<string, AramaOgesi[]>>((acc, o) => {
    (acc[o.grup] ??= []).push(o);
    return acc;
  }, {});
  let sira = -1;

  return (
    <Popover open={acik} onOpenChange={setAcik}>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Ara"
            className="inline-flex h-8 items-center gap-2 rounded-lg border bg-muted/40 px-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          />
        }
      >
        <Icon icon="solar:magnifer-linear" className="size-4" />
        <span className="hidden text-xs lg:inline">Ara…</span>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-80 gap-0 p-0">
        {/* Arama kutusu */}
        <div className="flex items-center gap-2 border-b px-3">
          <Icon icon="solar:magnifer-linear" className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={tusla}
            placeholder="Sayfa veya kayıt ara…"
            className="h-10 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ("")}
              aria-label="Temizle"
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <Icon icon="solar:close-circle-bold" className="size-4" />
            </button>
          ) : null}
        </div>

        {/* Sonuçlar */}
        <div className="max-h-80 overflow-y-auto p-1.5 [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar]:w-1.5">
          {sonuclar.length === 0 ? (
            <div className="flex flex-col items-center gap-1.5 py-8 text-center">
              <Icon icon="solar:magnifer-linear" className="size-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                “{q}” için sonuç bulunamadı
              </p>
            </div>
          ) : (
            Object.entries(gruplar).map(([grup, ogeler]) => (
              <div key={grup} className="mb-1 last:mb-0">
                <div className="px-2 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {grup}
                </div>
                {ogeler.map((o) => {
                  sira += 1;
                  const secili = sira === vurgu;
                  return (
                    <button
                      key={o.href}
                      type="button"
                      onClick={() => git(o.href)}
                      className={
                        "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors " +
                        (secili ? "bg-muted text-foreground" : "hover:bg-muted/60")
                      }
                    >
                      <Icon icon={o.ikon} className="size-4.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{o.baslik}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
