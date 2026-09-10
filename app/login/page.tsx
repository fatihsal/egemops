"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowRight,
  BarChart3,
  Eye,
  EyeOff,
  FileText,
  Flame,
  Fuel,
  Leaf,
  Lock,
  ShieldCheck,
  Sun,
  User,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DilSecici } from "@/components/layout/dil-secici";
import { useDil } from "@/components/providers/dil-provider";

const MODULLER: { ad: string; ikon: LucideIcon }[] = [
  { ad: "Enerji Analizi", ikon: Zap },
  { ad: "TEP Takibi", ikon: BarChart3 },
  { ad: "GES İzleme", ikon: Sun },
  { ad: "Doğalgaz Yönetimi", ikon: Flame },
  { ad: "Akaryakıt Takibi", ikon: Fuel },
  { ad: "Raporlama ve Analiz", ikon: FileText },
];

const KPILER: { ust: string; alt: string; ikon: LucideIcon }[] = [
  { ust: "Daha Az", alt: "Karbon Ayak İzi", ikon: Leaf },
  { ust: "Daha Yüksek", alt: "Verimlilik", ikon: BarChart3 },
  { ust: "Daha Güçlü", alt: "Gelecek", ikon: Users },
];

/** Yatay logo (globe görseli + EGEM AMBALAJ). */
function Marka({ boyut = "md" }: { boyut?: "md" | "sm" }) {
  const h = boyut === "sm" ? "h-9" : "h-12";
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Egem Ambalaj" className={`${h} w-auto object-contain`} />
      <div className="leading-none">
        <div className="font-heading text-xl font-extrabold tracking-tight text-slate-800">
          EGEM
        </div>
        <div className="mt-0.5 text-[11px] font-semibold tracking-[0.28em] text-slate-400">
          AMBALAJ
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { t } = useDil();
  const [sifreGoster, setSifreGoster] = React.useState(false);
  const [yukleniyor, setYukleniyor] = React.useState(false);

  function girisYap(e: React.FormEvent) {
    e.preventDefault();
    if (yukleniyor) return;
    setYukleniyor(true);
    // Mock giriş: kısa gecikme sonrası panele yönlendir (gerçek auth yok).
    toast.success(t("Giriş başarılı, yönlendiriliyorsunuz…"));
    setTimeout(() => router.push("/"), 900);
  }

  return (
    <div className="grid min-h-screen bg-white text-slate-900 lg:grid-cols-[1.15fr_0.85fr]">
      {/* ==================== SOL HERO ==================== */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-sky-50 via-white to-teal-50 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        {/* yumuşak dekor bloblar */}
        <div className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -left-24 size-72 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="pointer-events-none absolute right-10 bottom-10 size-64 rounded-full bg-cyan-100/40 blur-3xl" />

        {/* üst: logo + tagline */}
        <div className="relative z-10 flex items-start justify-between gap-6">
          <Marka />
          <p className="max-w-[9rem] text-right text-sm leading-snug font-medium text-slate-500 italic">
            {t("Daha verimli enerji, daha temiz yarın.")}
          </p>
        </div>

        {/* orta: başlık + açıklama + modüller */}
        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-[0.22em] text-teal-700 uppercase">
            {t("Enerji Yönetimi Platformu")}
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-[1.08] font-bold tracking-tight text-slate-900 xl:text-[3.25rem]">
            {t("Bugünün enerjisi,")}
            <br />
            <span className="text-teal-600">{t("yarının geleceği.")}</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600">
            {t(
              "Egem Ambalaj'da sürdürülebilir bir gelecek için enerjimizi birlikte yönetiyoruz.",
            )}
          </p>

          {/* enerji modülleri */}
          <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3 sm:grid-cols-6">
            {MODULLER.map((m) => (
              <div
                key={m.ad}
                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-2.5 py-4 text-center shadow-sm backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                  <m.ikon className="size-5" />
                </span>
                <span className="text-[11px] leading-tight font-medium text-slate-700">
                  {t(m.ad)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* alt: KPI mesajları */}
        <div className="relative z-10 flex flex-wrap gap-x-10 gap-y-4">
          {KPILER.map((k) => (
            <div key={k.alt} className="flex items-center gap-2.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
                <k.ikon className="size-5" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold text-slate-800">{t(k.ust)}</span>
                <span className="block font-medium text-slate-500">{t(k.alt)}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== SAĞ LOGIN ==================== */}
      <section className="relative flex flex-col items-center justify-center bg-slate-50 px-5 py-10 sm:px-8">
        {/* dil seçici */}
        <div className="absolute top-5 right-5">
          <DilSecici ton="acik" />
        </div>

        {/* mobil marka bandı */}
        <div className="mb-6 lg:hidden">
          <Marka boyut="sm" />
        </div>

        {/* login kartı */}
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_24px_70px_-24px_rgb(15_23_42/0.28)] sm:p-9">
          <div className="flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Egem Ambalaj" className="h-14 w-auto object-contain" />
            <div className="mt-2 font-heading text-lg font-extrabold tracking-tight text-slate-800">
              EGEM <span className="font-semibold tracking-[0.2em] text-slate-400">AMBALAJ</span>
            </div>
            <h1 className="mt-5 font-heading text-xl leading-snug font-bold text-slate-900">
              {t("Enerji Yönetimi Platformu'na Hoş Geldiniz")}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              {t("Lütfen hesap bilgilerinizle giriş yapın.")}
            </p>
          </div>

          <form onSubmit={girisYap} className="mt-7 space-y-4">
            {/* kullanıcı adı / e-posta */}
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                required
                autoComplete="username"
                placeholder={t("Kullanıcı adı veya e-posta")}
                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
            </div>

            {/* şifre */}
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400" />
              <Input
                type={sifreGoster ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder={t("Şifre")}
                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 px-11 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-teal-500 focus-visible:ring-teal-500/20"
              />
              <button
                type="button"
                onClick={() => setSifreGoster((v) => !v)}
                aria-label={sifreGoster ? t("Şifreyi gizle") : t("Şifreyi göster")}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
              >
                {sifreGoster ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>

            {/* beni hatırla + şifremi unuttum */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 select-none">
                <input
                  type="checkbox"
                  className="size-4 rounded border-slate-300 accent-teal-600"
                />
                {t("Beni hatırla")}
              </label>
              <button
                type="button"
                onClick={() => toast(t("Şifre sıfırlama bağlantısı e-postanıza gönderildi."))}
                className="text-sm font-medium text-teal-600 transition-colors hover:text-teal-700 hover:underline"
              >
                {t("Şifremi unuttum?")}
              </button>
            </div>

            {/* ana CTA */}
            <Button
              type="submit"
              disabled={yukleniyor}
              className="h-12 w-full justify-center gap-2 rounded-xl bg-teal-700 text-[15px] font-semibold text-white shadow-lg shadow-teal-700/25 transition-colors hover:bg-teal-800"
            >
              {yukleniyor ? (
                t("Giriş yapılıyor…")
              ) : (
                <>
                  {t("Giriş Yap")}
                  <ArrowRight className="size-5" />
                </>
              )}
            </Button>
          </form>

          {/* veya ayıracı */}
          <div className="my-6 flex items-center gap-3 text-xs font-medium text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            {t("veya")}
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {/* güvenlik bilgisi */}
          <div className="flex items-start gap-3 rounded-xl border border-teal-100 bg-teal-50/70 p-3.5">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-teal-600" />
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {t("Bu sistem Egem Ambalaj A.Ş. çalışanları içindir.")}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{t("Yetkisiz erişim yasaktır.")}</p>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="mt-8 flex w-full max-w-md flex-col items-center gap-1.5 text-center text-xs text-slate-400 sm:flex-row sm:justify-between sm:text-left">
          <span>{t("© 2026 Egem Ambalaj A.Ş. | Enerji Yönetimi Platformu")}</span>
          <span className="inline-flex items-center gap-1.5">
            <Leaf className="size-3.5 text-teal-500" />
            {t("Sürdürülebilir üretim, güçlü yarınlar.")}
          </span>
        </div>
      </section>
    </div>
  );
}
