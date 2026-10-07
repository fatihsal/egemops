"use client";

import { Leaf } from "lucide-react";

import { DilSecici } from "@/components/layout/dil-secici";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ModulKarti } from "@/components/hub/modul-karti";
import { useDil } from "@/components/providers/dil-provider";
import { moduller } from "@/lib/nav";

/** Genel giriş / landing — modül seçimi (herkese açık). */
export default function LandingPage() {
  const { t } = useDil();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* yumuşak dekor bloblar */}
      <div className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-teal-200/30 blur-3xl dark:bg-teal-900/20" />
      <div className="pointer-events-none absolute top-1/3 -left-24 size-72 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-900/20" />
      <div className="pointer-events-none absolute right-10 bottom-10 size-64 rounded-full bg-blue-100/40 blur-3xl dark:bg-blue-900/20" />

      {/* üst bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Egem Ambalaj" className="h-11 w-auto object-contain" />
          <div className="leading-none">
            <div className="font-heading text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              EGEM
            </div>
            <div className="mt-0.5 text-[11px] font-semibold tracking-[0.28em] text-slate-400">
              AMBALAJ
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DilSecici ton="acik" />
          <ThemeToggle />
        </div>
      </header>

      {/* içerik */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-10">
        <div className="w-full max-w-4xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold tracking-[0.24em] text-teal-700 uppercase dark:text-teal-400">
              EgemOps · {t("Dijital Operasyon Platformu")}
            </p>
            <h1 className="mt-4 font-heading text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
              {t("Hangi modüle girmek istersiniz?")}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {t("Egem Ambalaj operasyonlarını tek platformda yönetin. Devam etmek için bir modül seçin.")}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {moduller.map((m) => (
              <ModulKarti key={m.anahtar} modul={m} />
            ))}
          </div>
        </div>
      </main>

      {/* footer */}
      <footer className="relative z-10 flex flex-col items-center gap-1.5 px-5 pb-6 text-center text-xs text-slate-400 sm:flex-row sm:justify-between sm:px-10">
        <span>{t("© 2026 Egem Ambalaj A.Ş.")}</span>
        <span className="inline-flex items-center gap-1.5">
          <Leaf className="size-3.5 text-teal-500" />
          Design &amp; Development by{" "}
          <span className="font-semibold text-teal-700 dark:text-teal-400">Fatih Sal</span>
        </span>
      </footer>
    </div>
  );
}
