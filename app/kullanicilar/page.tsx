
import { KullaniciFiltreler } from "@/components/kullanicilar/filtreler";
import { KullaniciKpiKartlari } from "@/components/kullanicilar/kpi";
import { KullaniciRoller } from "@/components/kullanicilar/roller";
import { KullaniciListesi } from "@/components/kullanicilar/kullanici-listesi";
import { KullaniciFiltreProvider } from "@/components/kullanicilar/filtre-store";

export default function KullanicilarPage() {
  return (
    <KullaniciFiltreProvider>
      <div className="space-y-6">
        {/* Filtreler */}
        <div className="flex flex-wrap items-center justify-end gap-3">
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
