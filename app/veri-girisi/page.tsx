
import { YilAySecim } from "@/components/veri-girisi/yil-ay-secim";
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

export default function VeriGirisiPage() {
  return (
    <div className="space-y-6">
      {/* Yıl/ay seçimi */}
      <div className="flex flex-wrap items-center justify-end gap-4">
        <YilAySecim />
      </div>

      {/* Durum çubuğu */}
      <DonemBar />

      {/* Ana grid: sol (elektrik/üretim/not) · orta (doğalgaz/akaryakıt/karşılaştırma) · sağ (özet/belgeler/aksiyon) */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr_1fr] [&>*]:min-w-0">
        {/* Sol sütun */}
        <div className="space-y-6">
          <ElektrikGesKarti />
          <UretimKarti />
          <AciklamaNotlarKarti />
        </div>

        {/* Orta sütun */}
        <div className="space-y-6">
          <DogalgazKarti />
          <AkaryakitKarti />
          <OncekiAyKarti />
        </div>

        {/* Sağ sütun */}
        <div className="space-y-6">
          <EnerjiOzetiKarti />
          <KaynakBelgelerKarti />
          <AksiyonAlani />
        </div>
      </div>
    </div>
  );
}
