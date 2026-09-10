
import { DonemBar } from "@/components/veri-girisi/donem-bar";
import { ElektrikGesKarti } from "@/components/veri-girisi/elektrik-ges-karti";
import { UretimKarti } from "@/components/veri-girisi/uretim-karti";
import { AciklamaNotlarKarti } from "@/components/veri-girisi/aciklama-notlar-karti";
import { DogalgazKarti } from "@/components/veri-girisi/dogalgaz-karti";
import { AkaryakitKarti } from "@/components/veri-girisi/akaryakit-karti";
import { OncekiAyKarti } from "@/components/veri-girisi/onceki-ay-karti";
import { EnerjiOzetiKarti } from "@/components/veri-girisi/enerji-ozeti-karti";
import { KaynakBelgelerKarti } from "@/components/veri-girisi/kaynak-belgeler-karti";
import { AksiyonAlani } from "@/components/veri-girisi/aksiyon-alani";
import { VeriGirisiProvider } from "@/components/veri-girisi/form-store";

export default function VeriGirisiPage() {
  return (
    <VeriGirisiProvider>
    <div className="space-y-6">
      {/* Dönem seçimi + durum çubuğu */}
      <DonemBar />

      {/* Ana düzen: geniş giriş formu (sol) + yapışkan özet/aksiyon rayı (sağ) */}
      <div className="grid gap-6 xl:grid-cols-3 [&>*]:min-w-0">
        {/* Giriş formu — genişlik isteyen kartlar tam, tek girdililer ikişerli */}
        <div className="space-y-6 xl:col-span-2">
          <ElektrikGesKarti />
          <div className="grid gap-6 md:grid-cols-2 [&>*]:min-w-0">
            <DogalgazKarti />
            <UretimKarti />
          </div>
          <AkaryakitKarti />
          <OncekiAyKarti />
          <AciklamaNotlarKarti />
        </div>

        {/* Özet + aksiyon + belgeler — yapışkan inceleme rayı */}
        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <EnerjiOzetiKarti />
          <AksiyonAlani />
          <KaynakBelgelerKarti />
        </div>
      </div>
    </div>
    </VeriGirisiProvider>
  );
}
