"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useDil } from "@/components/providers/dil-provider";
import type { ModulBilgi } from "@/lib/nav";

export function ModulKarti({ modul }: { modul: ModulBilgi }) {
  const { t } = useDil();
  const Ikon = modul.ikon;
  return (
    <Link
      href={modul.href}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {/* üst vurgu şeridi */}
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: modul.renk }}
      />
      <span
        className="flex size-14 items-center justify-center rounded-2xl text-white shadow-sm"
        style={{ background: `linear-gradient(135deg, ${modul.renk}, ${modul.renk}cc)` }}
      >
        <Ikon className="size-7" />
      </span>
      <div className="space-y-1">
        <h3 className="font-heading text-lg font-bold tracking-tight">{t(modul.ad)}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{t(modul.aciklama)}</p>
      </div>
      <span
        className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: modul.renk }}
      >
        {t("Modüle Gir")}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
