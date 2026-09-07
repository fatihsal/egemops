import Link from "next/link";
import { Icon } from "@iconify/react";

import { KullaniciFiltreler } from "@/components/kullanicilar/filtreler";
import { KullaniciKpiKartlari } from "@/components/kullanicilar/kpi";
import { KullaniciRoller } from "@/components/kullanicilar/roller";
import { KullaniciListesi } from "@/components/kullanicilar/kullanici-listesi";
import { KullaniciFiltreProvider } from "@/components/kullanicilar/filtre-store";

export default function KullanicilarPage() {
  return (
    <KullaniciFiltreProvider>
      <div className="space-y-6">
        {/* Başlık + aksiyon */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-foreground">Enerji Yönetimi</Link>
              <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
              <span className="text-foreground">Kullanıcılar</span>
            </nav>
            <h1 className="text-2xl font-semibold tracking-tight">Kullanıcılar</h1>
            <p className="text-sm text-muted-foreground">
              Ekip üyelerini, rollerini ve erişim izinlerini yönetin.
            </p>
          </div>

          <KullaniciFiltreler />
        </div>

        <KullaniciKpiKartlari />

        {/* Roller + kullanıcı listesi */}
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          <div className="xl:col-span-4"><KullaniciRoller /></div>
          <div className="xl:col-span-8"><KullaniciListesi /></div>
        </div>
      </div>
    </KullaniciFiltreProvider>
  );
}
