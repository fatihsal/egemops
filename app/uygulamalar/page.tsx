"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DilSecici } from "@/components/layout/dil-secici";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MarkaLogo } from "@/components/layout/marka-logo";
import { ModulKarti } from "@/components/hub/modul-karti";
import { useDil } from "@/components/providers/dil-provider";
import { useProfil } from "@/lib/hooks/use-profil";
import { supabaseTarayici } from "@/lib/supabase/client";
import { moduller } from "@/lib/nav";

export default function UygulamalarPage() {
  const { t } = useDil();
  const router = useRouter();
  const { profil } = useProfil();

  async function cikisYap() {
    await supabaseTarayici().auth.signOut();
    toast.success(t("Çıkış yapıldı"));
    router.replace("/login");
    router.refresh();
  }

  const ad = profil?.ad_soyad ?? profil?.eposta ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-sky-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* üst bar */}
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <MarkaLogo />
        <div className="flex items-center gap-2">
          <DilSecici ton="acik" />
          <ThemeToggle />
          <Button variant="outline" size="sm" className="gap-1.5 bg-card" onClick={cikisYap}>
            <LogOut className="size-4" />
            {t("Çıkış")}
          </Button>
        </div>
      </header>

      {/* içerik */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-4xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-teal-700 uppercase dark:text-teal-400">
              EgemOps
            </p>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              {ad ? `${t("Hoş geldiniz")}, ${ad}` : t("Hoş geldiniz")}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {t("Çalışmak istediğiniz modülü seçin.")}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {moduller.map((m) => (
              <ModulKarti key={m.anahtar} modul={m} />
            ))}
          </div>
        </div>
      </main>

      <footer className="pb-6 text-center text-[11px] text-muted-foreground">
        Design &amp; Development by <span className="font-semibold text-teal-700 dark:text-teal-400">Fatih Sal</span>
      </footer>
    </div>
  );
}
