"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  ChevronLeft,
  ClipboardCheck,
  ClipboardList,
  Code2,
  Cpu,
  Eye,
  EyeOff,
  Gauge,
  LayoutGrid,
  Lock,
  Package,
  ShieldCheck,
  TrendingUp,
  User,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DilSecici } from "@/components/layout/dil-secici";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { useDil } from "@/components/providers/dil-provider";
import { supabaseTarayici } from "@/lib/supabase/client";

const MODULLER: { ad: string; ikon: LucideIcon }[] = [
  { ad: "Bakım Planı", ikon: ClipboardList },
  { ad: "İş Emri Yönetimi", ikon: ClipboardCheck },
  { ad: "Ekipman Takibi", ikon: Cpu },
  { ad: "Arıza Yönetimi", ikon: AlertTriangle },
  { ad: "Raporlama ve Analiz", ikon: BarChart3 },
  { ad: "Yedek Parça Yönetimi", ikon: Package },
];

const KPILER: { ust: string; alt: string; ikon: LucideIcon }[] = [
  { ust: "Daha Az Arıza", alt: "Kesintisiz Üretim", ikon: Gauge },
  { ust: "Daha Yüksek", alt: "Ekipman Verimliliği", ikon: TrendingUp },
  { ust: "Daha Uzun Ekipman Ömrü", alt: "Sürdürülebilir Gelecek", ikon: ShieldCheck },
];

function Marka({ boyut = "md" }: { boyut?: "md" | "sm" }) {
  const h = boyut === "sm" ? "h-9" : "h-12";
  return (
    <div className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Egem Ambalaj" className={`${h} w-auto object-contain`} />
      <div className="leading-none">
        <div className="font-heading text-xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">EGEM</div>
        <div className="mt-0.5 text-[11px] font-semibold tracking-[0.28em] text-slate-400 dark:text-slate-500">AMBALAJ</div>
      </div>
    </div>
  );
}

export default function BakimLoginPage() {
  const router = useRouter();
  const { t } = useDil();
  const [sifreGoster, setSifreGoster] = React.useState(false);
  const [yukleniyor, setYukleniyor] = React.useState(false);
  const [kullaniciAdi, setKullaniciAdi] = React.useState("");
  const [sifre, setSifre] = React.useState("");

  async function girisYap(e: React.FormEvent) {
    e.preventDefault();
    if (yukleniyor) return;
    setYukleniyor(true);

    const supabase = supabaseTarayici();
    const { data: eposta, error: bulHata } = await supabase.rpc("eposta_bul", {
      p_kullanici_adi: kullaniciAdi.trim(),
    });
    if (bulHata || !eposta) {
      setYukleniyor(false);
      toast.error(t("Giriş başarısız — kullanıcı adı veya şifre hatalı."));
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email: eposta as string, password: sifre });
    if (error) {
      setYukleniyor(false);
      toast.error(t("Giriş başarısız — kullanıcı adı veya şifre hatalı."));
      return;
    }
    toast.success(t("Giriş başarılı, yönlendiriliyorsunuz…"));
    router.replace("/bakim");
    router.refresh();
  }

  return (
    <div className="relative grid min-h-screen bg-white text-slate-900 lg:grid-cols-[1.15fr_0.85fr] dark:bg-slate-950 dark:text-slate-100">
      {/* tam sayfa blurlu arka plan fotoğrafı (public/login-bakim.png) */}
      <div
        className="pointer-events-none fixed inset-0 scale-[1.05] bg-cover bg-center blur-[3px]"
        style={{ backgroundImage: "url('/login-bakim.png')" }}
      />
      {/* okunabilirlik katmanı — kart ve metinler net kalsın */}
      <div className="pointer-events-none fixed inset-0 bg-white/60 dark:bg-slate-950/72" />

      {/* ==================== SOL HERO ==================== */}
      <section className="relative z-10 hidden overflow-hidden lg:flex lg:flex-col lg:justify-center lg:gap-10 lg:p-12 xl:p-16">
        <div className="pointer-events-none absolute -top-24 -right-16 size-80 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-500/10" />
        <div className="pointer-events-none absolute top-1/3 -left-24 size-72 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />

        <div className="relative z-10 flex items-start justify-between gap-6">
          <Marka />
        </div>

        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-[0.22em] text-blue-700 uppercase dark:text-blue-400">
            {t("Bakım Yönetimi Modülü")}
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-[1.08] font-bold tracking-tight text-slate-900 xl:text-[3.25rem] dark:text-slate-50">
            {t("Planlı bakım,")}
            <br />
            <span className="text-blue-600 dark:text-blue-400">{t("güçlü üretim.")}</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-300">
            {t("Makinelerin bakımını planlayın, SOP'larla uygulayın, kanıtlayın ve geçmişe kaydedin.")}
          </p>

          <div className="mt-9 grid max-w-2xl grid-cols-3 gap-3 sm:grid-cols-6">
            {MODULLER.map((m) => (
              <div
                key={m.ad}
                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/70 px-2.5 py-4 text-center shadow-sm backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/60"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                  <m.ikon className="size-5" />
                </span>
                <span className="text-[11px] leading-tight font-medium text-slate-700 dark:text-slate-200">{t(m.ad)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-x-10 gap-y-4">
          {KPILER.map((k) => (
            <div key={k.alt} className="flex items-center gap-2.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                <k.ikon className="size-5" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold text-slate-800 dark:text-slate-100">{t(k.ust)}</span>
                <span className="block font-medium text-slate-500 dark:text-slate-400">{t(k.alt)}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== SAĞ LOGIN ==================== */}
      <section className="relative z-10 flex min-h-screen flex-col px-5 pb-10 sm:px-8">
        {/* üst bar: modüller + dil seçici + tema (kartla çakışmaması için yer ayrılır) */}
        <div className="relative z-10 flex items-center justify-end gap-2 pt-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <LayoutGrid className="size-4" />
            {t("Modüller")}
          </Link>
          <DilSecici ton="acik" />
          <ThemeToggle />
        </div>

        {/* ortalanan içerik */}
        <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center py-8">
        <div className="mb-6 lg:hidden">
          <Marka boyut="sm" />
        </div>

        <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_24px_70px_-24px_rgb(15_23_42/0.28)] sm:p-9 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_24px_70px_-24px_rgb(0_0_0/0.6)]">
          <div className="flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Egem Ambalaj" className="h-14 w-auto object-contain" />
            <div className="mt-2 font-heading text-lg font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              EGEM <span className="font-semibold tracking-[0.2em] text-slate-400 dark:text-slate-500">AMBALAJ</span>
            </div>
            <h1 className="mt-5 font-heading text-xl leading-snug font-bold text-slate-900 dark:text-slate-50">
              {t("Bakım Yönetimi'ne Hoş Geldiniz")}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{t("Lütfen hesap bilgilerinizle giriş yapın.")}</p>
          </div>

          <form onSubmit={girisYap} className="mt-7 space-y-4">
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                required
                autoComplete="username"
                value={kullaniciAdi}
                onChange={(e) => setKullaniciAdi(e.target.value)}
                placeholder={t("Kullanıcı Adı")}
                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-slate-400" />
              <Input
                type={sifreGoster ? "text" : "password"}
                required
                autoComplete="current-password"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                placeholder={t("Şifre")}
                className="h-12 rounded-xl border-slate-200 bg-slate-50/70 px-11 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500"
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

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 select-none dark:text-slate-300">
                <input type="checkbox" className="size-4 rounded border-slate-300 accent-blue-600 dark:border-slate-600" />
                {t("Beni hatırla")}
              </label>
              <button
                type="button"
                onClick={() => toast(t("Şifre sıfırlama bağlantısı e-postanıza gönderildi."))}
                className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t("Şifremi unuttum?")}
              </button>
            </div>

            <Button
              type="submit"
              disabled={yukleniyor}
              className="h-12 w-full justify-center gap-2 rounded-xl bg-blue-700 text-[15px] font-semibold text-white shadow-lg shadow-blue-700/25 transition-colors hover:bg-blue-800"
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

          <div className="my-6 flex items-center gap-3 text-xs font-medium text-slate-400 dark:text-slate-500">
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            {t("veya")}
            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3.5 dark:border-blue-500/20 dark:bg-blue-500/10">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {t("Bu sistem Egem Ambalaj A.Ş. çalışanları içindir.")}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{t("Yetkisiz erişim yasaktır.")}</p>
            </div>
          </div>

          <Link
            href="/"
            className="mt-4 flex items-center justify-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800 lg:hidden dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ChevronLeft className="size-4" />
            {t("Modül Seçimine Dön")}
          </Link>
        </div>

        {/* geliştirici kredisi */}
        <div className="mt-8 flex w-full max-w-md items-center gap-3">
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/70 px-3.5 py-1.5 text-[13px] text-slate-500 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-slate-300">
            <Code2 className="size-4 text-blue-600 dark:text-blue-400" />
            Design &amp; Development by{" "}
            <span className="font-semibold text-blue-700 dark:text-blue-300">Fatih Sal</span>
          </span>
          <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>
        </div>
      </section>
    </div>
  );
}
