"use client";

import * as React from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ArrowRight, Check } from "lucide-react";

import { useDil } from "@/components/providers/dil-provider";
import type { ModulBilgi } from "@/lib/nav";

const ROZET_IKON: Record<string, string> = {
  enerji: "solar:bolt-bold",
  bakim: "solar:magic-stick-3-bold",
};
const FILIGRAN: Record<string, string> = {
  enerji: "solar:chart-2-bold-duotone",
  bakim: "solar:settings-bold-duotone",
};

export function ModulKarti({ modul }: { modul: ModulBilgi }) {
  const { t } = useDil();
  const Ikon = modul.ikon;
  const gradyan = `linear-gradient(135deg, ${modul.renk}, ${modul.renk2})`;
  const [gorselHata, setGorselHata] = React.useState(false);

  return (
    <Link
      href={modul.href}
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/75 p-7 shadow-[0_20px_60px_-20px_rgb(15_23_42/0.25)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/85 hover:shadow-[0_32px_80px_-24px_rgb(15_23_42/0.35)] dark:border-white/10 dark:bg-slate-900/60 dark:hover:bg-slate-900/75"
    >
      {/* kart görseli (yoksa filigran ikon) */}
      {!gorselHata ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={modul.gorsel}
          alt=""
          aria-hidden
          onError={() => setGorselHata(true)}
          className="pointer-events-none absolute right-0 bottom-0 h-40 w-1/2 object-contain object-right-bottom opacity-90 transition-transform duration-300 group-hover:scale-105 [mask-image:linear-gradient(to_left,black_55%,transparent)]"
        />
      ) : (
        <Icon
          icon={FILIGRAN[modul.anahtar]}
          className="pointer-events-none absolute -right-6 bottom-2 size-44 opacity-[0.07]"
          style={{ color: modul.renk }}
        />
      )}

      {/* üst: ikon + rozet */}
      <div className="relative flex items-start justify-between">
        <span
          className="flex size-16 items-center justify-center rounded-2xl shadow-sm"
          style={{ background: `${modul.renk}1a`, color: modul.renk }}
        >
          <Ikon className="size-8" />
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `${modul.renk}1a`, color: modul.renk }}
        >
          <Icon icon={ROZET_IKON[modul.anahtar]} className="size-3.5" />
          {t(modul.rozet)}
        </span>
      </div>

      <h3 className="relative mt-5 font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        {t(modul.ad)}
      </h3>
      <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {t(modul.aciklama)}
      </p>

      <ul className="relative mt-5 space-y-2.5">
        {modul.oneCikanlar.map((o) => (
          <li key={o} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200">
            <span
              className="flex size-5 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: modul.renk }}
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
            {t(o)}
          </li>
        ))}
      </ul>

      <span
        className="relative mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-semibold text-white shadow-lg transition-all group-hover:gap-3"
        style={{ background: gradyan, boxShadow: `0 14px 30px -12px ${modul.renk}` }}
      >
        {t(modul.ctaMetin)}
        <ArrowRight className="size-5" />
      </span>
    </Link>
  );
}
