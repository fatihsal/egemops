"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DilSecici } from "@/components/layout/dil-secici";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ModulKarti } from "@/components/hub/modul-karti";
import { useDil } from "@/components/providers/dil-provider";
import { useProfil } from "@/lib/hooks/use-profil";
import { supabaseTarayici } from "@/lib/supabase/client";
import { moduller } from "@/lib/nav";

const ROL_ETIKET: Record<string, string> = {
  admin: "Yönetici",
  enerji_yoneticisi: "Enerji Yöneticisi",
  izleyici: "İzleyici",
};

function basHarfler(ad: string | null, eposta: string | null) {
  const k = (ad ?? "").trim();
  if (k) return k.split(/\s+/).slice(0, 2).map((p) => p[0]?.toLocaleUpperCase("tr") ?? "").join("");
  return (eposta?.[0] ?? "?").toLocaleUpperCase("tr");
}

export default function LandingPage() {
  const { t } = useDil();
  const router = useRouter();
  const { profil } = useProfil();

  async function cikisYap() {
    await supabaseTarayici().auth.signOut();
    toast.success(t("Çıkış yapıldı"));
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* Fabrika arka planı (public/fabrika.jpg; yoksa gradyan görünür) */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-55 dark:opacity-25"
        style={{ backgroundImage: "url('/fabrika.jpg')" }}
      />
      {/* yumuşatma katmanı */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/55 to-white/80 dark:from-slate-950/80 dark:via-slate-950/70 dark:to-slate-950/90" />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* üst bar */}
        <header className="flex items-center justify-between px-5 py-5 sm:px-10">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Egem Ambalaj" className="h-11 w-auto object-contain" />
            <div className="leading-none">
              <div className="font-heading text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">EGEM</div>
              <div className="mt-0.5 text-[11px] font-semibold tracking-[0.28em] text-slate-400">AMBALAJ</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DilSecici ton="acik" />
            <ThemeToggle />
            {profil ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button type="button" className="flex items-center gap-2.5 rounded-xl border border-white/60 bg-white/70 px-2.5 py-1.5 shadow-sm backdrop-blur transition-colors hover:bg-white dark:border-white/10 dark:bg-slate-900/60" />
                  }
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-[11px] font-bold text-white">
                    {basHarfler(profil.ad_soyad, profil.eposta)}
                  </span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100">{profil.ad_soyad ?? profil.eposta}</span>
                    <span className="block text-[11px] text-slate-500">{t(ROL_ETIKET[profil.rol] ?? profil.rol)}</span>
                  </span>
                  <ChevronDown className="size-4 text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">{profil.eposta}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={cikisYap} className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400">
                    <LogOut className="size-4" />
                    {t("Çıkış Yap")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </header>

        {/* içerik */}
        <main className="flex flex-1 flex-col items-center justify-center px-5 py-10">
          <div className="w-full max-w-4xl">
            <div className="mb-10 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-slate-300 dark:bg-slate-700" />
                <span className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase dark:text-slate-400">
                  {t("Dijital Operasyon Platformu")}
                </span>
                <span className="h-px w-10 bg-slate-300 dark:bg-slate-700" />
              </div>
              <h1 className="mt-4 font-heading text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
                {t("EgemOps'a Hoş Geldiniz")}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {t("Fabrika operasyonlarınızı daha verimli, sürdürülebilir ve kontrollü yönetmek için kullanmak istediğiniz modülü seçin.")}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {moduller.map((m) => (
                <ModulKarti key={m.anahtar} modul={m} />
              ))}
            </div>
          </div>
        </main>

        <footer className="px-5 pb-6 text-center text-[11px] text-slate-400 sm:px-10">
          © 2026 Egem Ambalaj A.Ş. · Design &amp; Development by{" "}
          <span className="font-semibold text-slate-500">Fatih Sal</span>
        </footer>
      </div>
    </div>
  );
}
