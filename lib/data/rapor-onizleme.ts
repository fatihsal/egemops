// -----------------------------------------------------------------------------
// VERİ KATMANI — Rapor Önizleme (mock)
// -----------------------------------------------------------------------------
// Kategoriye göre önizleme içeriği üretir. Backend bağlandığında bu fonksiyonun
// içi gerçek rapor motoruyla değişir; imza sabit kalır.

import type { RaporKategoriAnahtar, RaporOnizleme } from "@/lib/types";

const AYLAR = ["Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos"];
const AY_KISA = ["Mar", "Nis", "May", "Haz", "Tem", "Ağu"];

function seriYap(bu: number[], onceki: number[]) {
  return AY_KISA.map((etiket, i) => ({ etiket, buDonem: bu[i], oncekiDonem: onceki[i] }));
}

function tabloYap(bu: number[], onceki: number[], birimBicim: (n: number) => string) {
  return AYLAR.map((ay, i) => {
    const d = onceki[i] ? ((bu[i] - onceki[i]) / onceki[i]) * 100 : 0;
    const isaret = d > 0 ? "+" : "";
    return [ay, birimBicim(bu[i]), birimBicim(onceki[i]), `${isaret}${d.toFixed(1).replace(".", ",")}%`];
  });
}

const sayi = (n: number) => n.toLocaleString("tr-TR", { maximumFractionDigits: 0 });
const sayi1 = (n: number) => n.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const ICERIK: Record<RaporKategoriAnahtar, RaporOnizleme> = {
  tuketim: {
    metrikAd: "Toplam Tüketim",
    birim: "MWh eşd.",
    ozet: "Dönem boyunca toplam enerji tüketimi 2.420 MWh eşdeğeri olarak gerçekleşti; bir önceki yılın aynı dönemine göre %3,4 artış görüldü. Artışın büyük bölümü yaz aylarındaki soğutma yükünden kaynaklandı. Elektrik, toplam tüketimin yarısından fazlasını oluşturmaya devam ediyor.",
    kpiler: [
      { baslik: "Toplam Tüketim", deger: "2.420", birim: "MWh", degisim: 3.4, iyiYon: "azalis" },
      { baslik: "Elektrik Payı", deger: "%51", degisim: 1.2, iyiYon: "azalis" },
      { baslik: "En Yüksek Ay", deger: "Ağustos", degisim: 0, iyiYon: "azalis" },
      { baslik: "Ort. Günlük", deger: "8,1", birim: "MWh", degisim: 2.1, iyiYon: "azalis" },
    ],
    seri: seriYap([360, 372, 395, 430, 448, 415], [352, 360, 384, 410, 430, 402]),
    dagilimBaslik: "Kaynak Bazlı Dağılım",
    dagilim: [
      { etiket: "Elektrik", deger: 1240, renk: "#2563eb" },
      { etiket: "Doğalgaz", deger: 860, renk: "#8b5cf6" },
      { etiket: "Akaryakıt", deger: 320, renk: "#f59e0b" },
    ],
    tabloBaslik: "Aylık Tüketim Detayı",
    tabloKolonlar: ["Ay", "Tüketim (MWh)", "Önceki Yıl", "Değişim"],
    tabloSatirlar: tabloYap([360, 372, 395, 430, 448, 415], [352, 360, 384, 410, 430, 402], sayi),
    degerlendirme: [
      "Yaz aylarında (Haz–Ağu) tüketim, kışa göre belirgin şekilde yükseldi; soğutma sistemleri ana etken.",
      "Elektrik payındaki artış, GES üretimindeki mevsimsel düşüşle kısmen dengelendi.",
      "Doğalgaz tüketimi hedef bandında; kazan verimi iyileştirmesi sonrası ısıl kayıplar azaldı.",
    ],
  },
  performans: {
    metrikAd: "EnPI (Enerji Performans Göstergesi)",
    birim: "kWh/ton",
    ozet: "Dönem sonunda ağırlıklı EnPI 42,8 kWh/ton olarak ölçüldü; önceki döneme göre %2,1 iyileşme (düşüş) sağlandı. Üretim hattı bazında en büyük iyileşme, VFD montajı tamamlanan yardımcı tesislerde gözlendi. Hedefe göre sapma kabul bandı içinde.",
    kpiler: [
      { baslik: "Ağırlıklı EnPI", deger: "42,8", birim: "kWh/ton", degisim: -2.1, iyiYon: "azalis" },
      { baslik: "Hedef Sapması", deger: "%-4,0", degisim: -1.5, iyiYon: "azalis" },
      { baslik: "İyileşen Hat", deger: "3 / 4", degisim: 0, iyiYon: "artis" },
      { baslik: "Baz Yıla Göre", deger: "%-9,6", degisim: -3.2, iyiYon: "azalis" },
    ],
    seri: seriYap([45.9, 45.2, 44.6, 43.9, 43.2, 42.8], [46.8, 46.5, 46.1, 45.7, 45.3, 45.0]),
    dagilimBaslik: "Süreç Bazlı EnPI Payı",
    dagilim: [
      { etiket: "Üretim Hatları", deger: 58, renk: "#10b981" },
      { etiket: "Yardımcı Tesisler", deger: 27, renk: "#14b8a6" },
      { etiket: "Bina & Aydınlatma", deger: 15, renk: "#0ea5e9" },
    ],
    tabloBaslik: "Aylık EnPI Gelişimi",
    tabloKolonlar: ["Ay", "EnPI (kWh/ton)", "Önceki Dönem", "Değişim"],
    tabloSatirlar: tabloYap([45.9, 45.2, 44.6, 43.9, 43.2, 42.8], [46.8, 46.5, 46.1, 45.7, 45.3, 45.0], sayi1),
    degerlendirme: [
      "VFD (değişken hız sürücü) montajı sonrası yardımcı tesis EnPI'si %6,8 iyileşti.",
      "Üretim hatlarında EnPI düşüşü istikrarlı; kompresör optimizasyonu katkı sağlıyor.",
      "Bina & aydınlatma segmenti hedefin hafif üzerinde; LED dönüşümü tamamlandığında toparlanması bekleniyor.",
    ],
  },
  maliyet: {
    metrikAd: "Toplam Enerji Maliyeti",
    birim: "TL",
    ozet: "Dönem toplam enerji maliyeti 4,86 M TL olarak gerçekleşti; birim fiyat artışları nedeniyle önceki yıla göre %5,2 yükseldi. Tüketim artışı sınırlı kalsa da elektrik birim fiyatındaki artış maliyeti yukarı çekti. Bütçeye göre sapma %+1,8 ile kabul sınırında.",
    kpiler: [
      { baslik: "Toplam Maliyet", deger: "4,86", birim: "M TL", degisim: 5.2, iyiYon: "azalis" },
      { baslik: "Birim Maliyet", deger: "2,01", birim: "TL/kWh", degisim: 3.1, iyiYon: "azalis" },
      { baslik: "Bütçe Sapması", deger: "%+1,8", degisim: 0.6, iyiYon: "azalis" },
      { baslik: "Elektrik Payı", deger: "%58", degisim: 2.0, iyiYon: "azalis" },
    ],
    seri: seriYap([720, 745, 780, 830, 880, 905], [690, 705, 735, 780, 815, 840]),
    dagilimBaslik: "Kaynak Bazlı Maliyet Dağılımı",
    dagilim: [
      { etiket: "Elektrik", deger: 2820, renk: "#2563eb" },
      { etiket: "Doğalgaz", deger: 1440, renk: "#8b5cf6" },
      { etiket: "Akaryakıt", deger: 600, renk: "#f59e0b" },
    ],
    tabloBaslik: "Aylık Maliyet Detayı",
    tabloKolonlar: ["Ay", "Maliyet (B TL)", "Önceki Yıl", "Değişim"],
    tabloSatirlar: tabloYap([720, 745, 780, 830, 880, 905], [690, 705, 735, 780, 815, 840], sayi),
    degerlendirme: [
      "Maliyet artışının ana kalemi elektrik birim fiyatı; tüketim etkisi ikincil kaldı.",
      "Doğalgaz maliyeti sabit fiyat anlaşması sayesinde öngörülebilir seyretti.",
      "Enerji verimliliği projeleri devreye alındıkça birim maliyette düşüş bekleniyor.",
    ],
  },
  tep: {
    metrikAd: "Toplam TEP",
    birim: "TEP",
    ozet: "Dönem toplam eşdeğer petrol tüketimi (TEP) 264,7 olarak hesaplandı; önceki döneme göre %1,8 artış görüldü. Elektrik kaynaklı TEP payı %50 seviyesini korurken, doğalgaz kaynaklı TEP mevsimsel olarak azaldı. Yasal bildirim eşiği açısından kapsam tamdır.",
    kpiler: [
      { baslik: "Toplam TEP", deger: "264,7", birim: "TEP", degisim: 1.8, iyiYon: "azalis" },
      { baslik: "Elektrik TEP Payı", deger: "%50", degisim: 0.8, iyiYon: "azalis" },
      { baslik: "Özgül TEP", deger: "0,088", birim: "TEP/ton", degisim: -1.2, iyiYon: "azalis" },
      { baslik: "Veri Kapsamı", deger: "%100", degisim: 0, iyiYon: "artis" },
    ],
    seri: seriYap([41.2, 42.0, 43.4, 45.1, 46.8, 46.2], [40.5, 41.2, 42.6, 44.3, 45.9, 45.4]),
    dagilimBaslik: "Kaynak Bazlı TEP Dağılımı",
    dagilim: [
      { etiket: "Elektrik", deger: 132.6, renk: "#2563eb" },
      { etiket: "Doğalgaz", deger: 85.4, renk: "#8b5cf6" },
      { etiket: "Akaryakıt", deger: 46.7, renk: "#f59e0b" },
    ],
    tabloBaslik: "Aylık TEP Detayı",
    tabloKolonlar: ["Ay", "TEP", "Önceki Dönem", "Değişim"],
    tabloSatirlar: tabloYap([41.2, 42.0, 43.4, 45.1, 46.8, 46.2], [40.5, 41.2, 42.6, 44.3, 45.9, 45.4], sayi1),
    degerlendirme: [
      "TEP dönüşümleri güncel katsayılarla hesaplandı; kaynak bazlı ayrıştırma tamamlandı.",
      "Özgül TEP (üretim başına) düşüşte; verimlilik çalışmalarının etkisi görülüyor.",
      "Yasal bildirim için tüm kaynaklarda veri kapsamı %100 sağlandı.",
    ],
  },
  karsilastirma: {
    metrikAd: "Dönemsel Karşılaştırma",
    birim: "MWh eşd.",
    ozet: "Bu rapor, seçili dönemi bir önceki yılın aynı dönemiyle karşılaştırır. Toplam tüketimde %3,4 artış, toplam maliyette %5,2 artış gözlendi; buna karşın özgül tüketim (üretim başına) %1,9 iyileşti. Verimlilik kazanımları, hacim artışının etkisini kısmen dengeledi.",
    kpiler: [
      { baslik: "Tüketim Değişimi", deger: "%+3,4", degisim: 3.4, iyiYon: "azalis" },
      { baslik: "Maliyet Değişimi", deger: "%+5,2", degisim: 5.2, iyiYon: "azalis" },
      { baslik: "Özgül Tüketim", deger: "%-1,9", degisim: -1.9, iyiYon: "azalis" },
      { baslik: "Karbon Değişimi", deger: "%+2,1", degisim: 2.1, iyiYon: "azalis" },
    ],
    seri: seriYap([360, 372, 395, 430, 448, 415], [352, 360, 384, 410, 430, 402]),
    dagilimBaslik: "Kaynak Bazlı Karşılaştırma",
    dagilim: [
      { etiket: "Elektrik", deger: 1240, renk: "#2563eb" },
      { etiket: "Doğalgaz", deger: 860, renk: "#8b5cf6" },
      { etiket: "Akaryakıt", deger: 320, renk: "#f59e0b" },
    ],
    tabloBaslik: "Dönemsel Karşılaştırma Detayı",
    tabloKolonlar: ["Ay", "Bu Dönem (MWh)", "Önceki Dönem", "Değişim"],
    tabloSatirlar: tabloYap([360, 372, 395, 430, 448, 415], [352, 360, 384, 410, 430, 402], sayi),
    degerlendirme: [
      "Hacim artışına rağmen özgül tüketim iyileşti; verimlilik çalışmaları etkili.",
      "Maliyet artışı tüketim artışının üzerinde; birim fiyat etkisi baskın.",
      "Karbon yoğunluğu, elektrik payındaki artış nedeniyle hafif yükseldi.",
    ],
  },
  ozel: {
    metrikAd: "Özet Gösterge",
    birim: "MWh eşd.",
    ozet: "Bu özel rapor, yönetim sunumu için seçili göstergeleri bir araya getirir. Dönem genelinde enerji tüketimi kontrol altında seyretti, verimlilik projeleri planlanan tasarrufun %39'unu gerçekleştirdi ve karbon yoğunluğu hedefe yakın kaldı. Detaylı bulgular aşağıdaki bölümlerde özetlenmiştir.",
    kpiler: [
      { baslik: "Toplam Tüketim", deger: "2.420", birim: "MWh", degisim: 3.4, iyiYon: "azalis" },
      { baslik: "Gerçekleşen Tasarruf", deger: "38,4", birim: "TEP", degisim: 12.0, iyiYon: "artis" },
      { baslik: "Karbon Yoğunluğu", deger: "0,42", birim: "tCO₂/MWh", degisim: -0.8, iyiYon: "azalis" },
      { baslik: "Hedef Gerçekleşme", deger: "%39", degisim: 6.0, iyiYon: "artis" },
    ],
    seri: seriYap([360, 372, 395, 430, 448, 415], [352, 360, 384, 410, 430, 402]),
    dagilimBaslik: "Kaynak Bazlı Dağılım",
    dagilim: [
      { etiket: "Elektrik", deger: 1240, renk: "#2563eb" },
      { etiket: "Doğalgaz", deger: 860, renk: "#8b5cf6" },
      { etiket: "Akaryakıt", deger: 320, renk: "#f59e0b" },
    ],
    tabloBaslik: "Aylık Özet",
    tabloKolonlar: ["Ay", "Tüketim (MWh)", "Önceki Yıl", "Değişim"],
    tabloSatirlar: tabloYap([360, 372, 395, 430, 448, 415], [352, 360, 384, 410, 430, 402], sayi),
    degerlendirme: [
      "Verimlilik projeleri planlanan tasarrufun %39'unu gerçekleştirdi; kalan projeler devrede.",
      "Karbon yoğunluğu hedefe yakın; yenilenebilir üretim payı artırıldığında düşüş hızlanacak.",
      "Yönetim aksiyonu gerektiren kritik sapma bulunmuyor.",
    ],
  },
};

export function raporOnizlemeGetir(kategori: RaporKategoriAnahtar): RaporOnizleme {
  return ICERIK[kategori];
}
