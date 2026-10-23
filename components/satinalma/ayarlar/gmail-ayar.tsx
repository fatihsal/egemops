"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDil } from "@/components/providers/dil-provider";
import { cn } from "@/lib/utils";

interface Durum {
  bagli: boolean;
  eposta: string | null;
  ayarVar: boolean;
  izinliAlicilar: string[];
}

export function GmailAyar() {
  const { t } = useDil();
  const sp = useSearchParams();
  const router = useRouter();
  const [durum, setDurum] = React.useState<Durum | null>(null);
  const [yukleniyor, setYukleniyor] = React.useState(true);
  const [kesiliyor, setKesiliyor] = React.useState(false);

  const durumGetir = React.useCallback(async () => {
    setYukleniyor(true);
    try {
      const r = await fetch("/api/satinalma/gmail/durum");
      setDurum(await r.json());
    } catch {
      setDurum({ bagli: false, eposta: null, ayarVar: false, izinliAlicilar: [] });
    } finally {
      setYukleniyor(false);
    }
  }, []);

  React.useEffect(() => { durumGetir(); }, [durumGetir]);

  // OAuth dönüşü bildirimleri
  React.useEffect(() => {
    const g = sp.get("gmail");
    if (!g) return;
    if (g === "baglandi") toast.success(t("Gmail bağlandı"));
    else if (g === "iptal") toast(t("Gmail bağlantısı iptal edildi"));
    else if (g === "yapilandirilmamis") toast.error(t("Gmail yapılandırılmamış (.env.local eksik)"));
    else if (g === "hata") toast.error(t("Gmail bağlantısı başarısız"));
    router.replace("/satinalma/ayarlar");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  async function baglantiKes() {
    if (kesiliyor) return;
    setKesiliyor(true);
    try {
      const r = await fetch("/api/satinalma/gmail/baglanti-kes", { method: "POST" });
      if (!r.ok) throw new Error();
      toast.success(t("Bağlantı kesildi"));
      durumGetir();
    } catch {
      toast.error(t("İşlem başarısız"));
    } finally {
      setKesiliyor(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Card>
        <CardHeader><h3 className="font-heading text-base font-bold tracking-tight">{t("E-posta Bağlantısı (Gmail)")}</h3></CardHeader>
        <CardContent className="space-y-4">
          {yukleniyor || !durum ? (
            <Skeleton className="h-16 w-full" />
          ) : !durum.ayarVar ? (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900/50 dark:bg-amber-950/30">
              <Icon icon="solar:danger-triangle-bold" className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-medium">{t("Gmail yapılandırılmamış")}</p>
                <p className="mt-0.5 text-muted-foreground">{t(".env.local dosyasına GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET ve GMAIL_REDIRECT_URI ekleyip sunucuyu yeniden başlatın.")}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <span className={cn("flex size-10 items-center justify-center rounded-xl", durum.bagli ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" : "bg-muted text-muted-foreground")}>
                  <Icon icon="logos:google-gmail" className="size-5" />
                </span>
                <div>
                  <p className="font-medium">{durum.bagli ? t("Bağlı") : t("Bağlı değil")}</p>
                  <p className="text-sm text-muted-foreground">{durum.bagli && durum.eposta ? durum.eposta : t("Teklif e-postaları göndermek için Gmail hesabınızı bağlayın.")}</p>
                </div>
              </div>
              {durum.bagli ? (
                <Button variant="outline" size="sm" className="gap-1.5 bg-card text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950" disabled={kesiliyor} onClick={baglantiKes}>
                  <Icon icon="solar:link-broken-linear" className="size-4" />{t("Bağlantıyı Kes")}
                </Button>
              ) : (
                <Button size="sm" className="gap-1.5 bg-orange-600 text-white hover:bg-orange-700" onClick={() => { window.location.href = "/api/satinalma/gmail/baglan"; }}>
                  <Icon icon="solar:link-circle-bold" className="size-4" />{t("Gmail Bağla")}
                </Button>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">{t("Bağlantı OAuth 2.0 ile yapılır; şifreniz istenmez. Token'lar şifreli olarak yalnızca sunucuda saklanır. Kapsam: yalnızca e-posta gönderme (gmail.send).")}</p>
        </CardContent>
      </Card>

      {/* İzinli test alıcıları */}
      <Card>
        <CardHeader><h3 className="font-heading text-base font-bold tracking-tight">{t("İzinli Test Alıcıları")}</h3></CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">{t("Teklif e-postaları YALNIZCA bu adreslere gönderilebilir. Değiştirmek için .env.local içindeki SATINALMA_IZINLI_ALICILAR değerini güncelleyin.")}</p>
          {!durum || durum.izinliAlicilar.length === 0 ? (
            <p className="rounded-lg border border-dashed p-3 text-sm text-amber-600 dark:text-amber-400">{t("Henüz izinli alıcı tanımlı değil — gönderim engellenir.")}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {durum.izinliAlicilar.map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm"><Icon icon="solar:check-circle-bold" className="size-4 text-emerald-500" />{a}</span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
