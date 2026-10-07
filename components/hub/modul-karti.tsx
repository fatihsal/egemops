"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { useDil } from "@/components/providers/dil-provider";
import type { ModulBilgi } from "@/lib/nav";

export function ModulKarti({ modul }: { modul: ModulBilgi }) {
  const { t } = useDil();
  const Ikon = modul.ikon;
  const gradyan = `linear-gradient(135deg, ${modul.renk}, ${modul.renk2})`;

  return (
    <Link
      href={modul.href}
      className="group relative flex flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
      style={{ ["--accent" as string]: modul.renk }}
    >
      {/* hover halo */}
      <span
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `0 0 0 1.5px ${modul.renk}55, 0 24px 60px -24px ${modul.renk}80` }}
      />

      {/* üst gradyan bant + ikon */}
      <div className="relative h-24 overflow-hidden" style={{ background: gradyan }}>
        <div className="pointer-events-none absolute -top-10 -right-6 size-32 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-4 size-28 rounded-full bg-black/10 blur-2xl" />
        <Ikon className="absolute right-5 top-1/2 size-16 -translate-y-1/2 text-white/15" />
        <span className="absolute bottom-0 left-6 flex size-14 translate-y-1/2 items-center justify-center rounded-2xl border-4 border-card bg-card shadow-sm">
          <span
            className="flex size-full items-center justify-center rounded-[11px] text-white"
            style={{ background: gradyan }}
          >
            <Ikon className="size-6" />
          </span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 pt-10 pb-6">
        <div className="space-y-1.5">
          <h3 className="font-heading text-xl font-bold tracking-tight">{t(modul.ad)}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{t(modul.aciklama)}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2">
          {modul.oneCikanlar.map((o) => (
            <span key={o} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="size-3.5 shrink-0" style={{ color: modul.renk }} />
              {t(o)}
            </span>
          ))}
        </div>

        <span
          className="mt-auto inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform group-hover:gap-3"
          style={{ background: gradyan }}
        >
          {t("Modüle Gir")}
          <ArrowRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}
