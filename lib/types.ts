// Uygulama genelinde paylaşılan tip tanımları.
// Backend eklendiğinde bu tipler API sözleşmesiyle hizalanmalı.

// Genel durum kodu — rozetlerde kullanılır (StatusBadge).
export type DurumKodu = "calisiyor" | "arizali" | "bekliyor" | "bakimda";

// -----------------------------------------------------------------------------
// Enerji yönetimi (tek tesis)
// -----------------------------------------------------------------------------

export type EnerjiTuru = "elektrik" | "dogalgaz" | "su";
export type UretimKaynagi = "solar" | "sebeke" | "jenerator";

/** Üst sıradaki özet göstergeler. */
export interface EnerjiKpi {
  anahtar: string;
  baslik: string;
  deger: number;
  birim: string;
  degisimYuzde: number; // önceki yıla göre değişim
  degisimBirim?: string; // "%" (varsayılan) veya "puan"
}

/** Zaman serisi: elektrik tüketimi ve öz üretim (kWh).
 *  `etiket` granülariteye göre ön-biçimlenir (saat veya gün). */
export interface TuketimNoktasi {
  etiket: string; // eksen etiketi (ör. "14:00" veya "12 Ağu")
  tuketim: number; // kWh
  uretim: number; // kWh (öz üretim)
}

/** Üretim kaynak kırılımı (dağılım grafiği için). */
export interface KaynakDilimi {
  kaynak: UretimKaynagi;
  etiket: string;
  deger: number; // kWh
}

/** Enerji türü bazında tüketim (elektrik / doğalgaz / su). */
export interface TurTuketim {
  tur: EnerjiTuru;
  etiket: string;
  deger: number;
  birim: string;
  degisimYuzde: number;
}

/** Aylık maliyet, tarife dönemine göre kırılmış (₺). */
export interface AylikMaliyet {
  ay: string; // "2026-01"
  gunduz: number;
  gece: number;
  puant: number;
}

/** Aylık şebeke ve GES elektrik üretimi (kWh) — yığılmış çubuk. */
export interface SebekeGesNoktasi {
  ay: string; // tam ay adı (benzersizlik için); eksende baş harf gösterilir
  sebeke: number;
  ges: number;
}

// -----------------------------------------------------------------------------
// Enerji Kayıtları (geçmiş aylık kayıtlar)
// -----------------------------------------------------------------------------

export type KayitDurum = "taslak" | "kontrol" | "onaylandi";
export type VeriKalite = "tam" | "kontrol" | "eksik";

export interface KayitGecmis {
  tarih: string; // "26.08.2026 15:20"
  baslik: string;
  aciklama?: string;
  kullanici: string;
  tur: "onay" | "duzenleme" | "ekleme";
}

export interface EnerjiKayit {
  id: string;
  donem: string; // "Ağustos 2026"
  yil: number;
  ay: number;
  elektrik: number; // kWh
  gesUretim: number; // kWh
  dogalgaz: number; // Sm³
  akaryakit: number; // Litre
  toplamTep: number;
  durum: KayitDurum;
  veriKalitesi: VeriKalite;
  // Detay panel
  elektrikTep: number;
  dogalgazTep: number;
  akaryakitTep: number;
  gesKarsilama: number; // %
  oncekiDonem: string | null;
  oncekiTep: number | null;
  degisimYuzde: number | null;
  sonGuncelleme: string;
  guncelleyen: string;
  olusturan: string;
  onaylayan: string;
  belgeSayisi: number;
  gecmis: KayitGecmis[];
  // Detay sayfası
  sebekeElektrik: number; // kWh
  gesOzTuketim: number; // kWh
  sebekeyeVerilen: number; // kWh
  motorin: number; // L
  benzin: number; // L
  diger: number; // L
  uretimTon: number;
  enerjiYogunluk: number; // TEP/ton
  oncekiYogunluk: number;
  yogunlukDegisim: number; // %
  notlar: string;
  belgeler: { ad: string; tur: string; ikon: string }[];
  oncekiElektrikTep: number | null;
  oncekiDogalgazTep: number | null;
  oncekiAkaryakitTep: number | null;
}

export interface KayitOzet {
  toplam: number;
  toplamAralik: string;
  onaylanan: number;
  onaylananOran: number;
  kontrolBekleyen: number;
  kontrolOran: number;
  taslak: number;
  taslakOran: number;
  eksik: number;
  eksikOran: number;
}

export interface YillikOzetSatir {
  kaynak: string;
  birim: string; // "kWh" | "Sm³" | "Litre" | "TEP"
  grup: "tuketim" | "tep";
  degerler: Record<string, number>;
  vurgu?: boolean;
}

export type KaynakTuru = "elektrik" | "dogalgaz" | "akaryakit";

/** Enerji kaynaklarının dağılımı (tür bazında). */
export interface EnerjiKaynak {
  tur: KaynakTuru;
  etiket: string;
  gwh: number;
  yuzde: number;
}

export interface EnerjiKaynakDagilim {
  kaynaklar: EnerjiKaynak[];
  toplamTep: number;
}

/** GES (güneş enerjisi santrali) performans özeti. */
export interface GesPerformans {
  yillikUretim: number; // GWh
  ozTuketim: number; // GWh
  sebekeyeVerilen: number; // GWh
  karsilamaOrani: number; // %
  karsilamaDegisim: number; // puan
  tahminiTasarruf: number; // TEP / yıl
}

/** Enerji yoğunluğu (TEP/ton). */
export interface EnerjiYogunluk {
  deger: number;
  degisimYuzde: number;
  gecenYil: number;
}

/** Yıllık enerji performans hedefi. */
export interface EnerjiHedef {
  hedef: number; // %
  gerceklesen: number; // %
  ilerlemeYuzde: number; // hedefe ilerleme %
  mesaj: string;
}

/** Enerji tasarruf fırsatları özeti. */
export interface EnerjiFirsat {
  toplamAcik: number;
  devamEden: number;
  tamamlanan: number;
}

export interface VeriKaynakDurum {
  etiket: string;
  mevcut: number;
  toplam: number;
}

/** Veri tamlık durumu (alt panel kartı). */
export interface VeriDurumDetay {
  kaynaklar: VeriKaynakDurum[];
  tamlikOrani: number; // %
  tamamlananAy: number;
  toplamAy: number;
}

/** Son güncelleme kaydı. */
export interface GuncellemeKaydi {
  tarih: string; // yyyy-MM-dd
  aciklama: string;
}

/** Yıllık aylık TEP karşılaştırması (son 3 yıl aynı grafikte). */
export interface YillikTepNoktasi {
  ay: string; // "Oca", "Şub", ...
  onceki2: number; // 2 yıl önce (ör. 2024)
  onceki1: number; // 1 yıl önce (ör. 2025)
  buYil: number | null; // içinde bulunulan yıl; gelecek aylar null
}

/** Karbon / sürdürülebilirlik özeti. */
export interface KarbonOzet {
  co2Kg: number; // bu ayki CO₂ salımı
  yenilenebilirOran: number; // %
  tasarrufKg: number; // önceki döneme göre azalış
}

// -----------------------------------------------------------------------------
// Elektrik & GES Analizi (analiz ekranı)
// -----------------------------------------------------------------------------

/** Üst KPI kartı — analiz ekranı için (alt-değer + yön). */
export interface ElektrikKpi {
  anahtar: string;
  baslik: string;
  deger: string; // ön-biçimlenmiş, ör. "7,84"
  birim?: string; // "GWh", "TEP" ...
  altDeger?: string; // ikinci satır, ör. "674,5 TEP"
  degisimYuzde: number; // önceki yılın aynı dönemine göre
  degisimBirim?: string; // "%" (varsayılan) | "puan"
  /** Dairesel gösterge KPI'ı (GES Karşılama Oranı gibi) için doluluk yüzdesi. */
  radyal?: number;
}

/** Aylık elektrik akışı — ana grafik ve detay tablosunun tek kaynağı (kWh). */
export interface ElektrikAylik {
  ay: string; // "Ocak" ... (benzersiz; eksende kısaltılır)
  kisa: string; // "Oca", "Şub" ...
  donem: string; // "Ocak 2026"
  sebeke: number; // şebeke tüketimi (kWh)
  gesUretim: number; // GES toplam üretim (kWh)
  gesOz: number; // GES öz tüketim (kWh)
  sebekeyeVerilen: number; // şebekeye verilen (kWh)
  fabrikaToplam: number; // şebeke + GES öz (kWh)
  gesKarsilama: number; // %
  elektrikTep: number; // TEP
  elektrikYogunluk: number; // kWh/ton
}

/** Donut dilimi — elektrik kaynak dağılımı. */
export interface ElektrikKaynakDilim {
  anahtar: "sebeke" | "gesOz" | "verilen";
  etiket: string;
  gwh: number;
  yuzde: number;
}

/** Analiz kartları için türetilmiş özet metrikler. */
export interface ElektrikOzet {
  ytd: {
    toplamElektrik: string; // "7,84"
    toplamDegisim: number;
    gesUretim: string; // "2,53"
    gesUretimDegisim: number;
    gesKarsilama: string; // "31,4"
    gesKarsilamaDegisim: number; // puan
  };
  enYuksek: { donem: string; gwh: string; trend: number[] };
  enDusuk: { donem: string; gwh: string; trend: number[] };
  ortalama: string; // "1,12"
  yogunluk: { deger: string; degisim: number }; // kWh/ton
  sebekeBagimlilik: number; // %
}

/** Yıllara göre aylık karşılaştırma noktası (çoklu çizgi grafik) — GWh. */
export interface AylikKarsilastirma {
  kisa: string; // "Oca" ...
  y2024: number;
  y2025: number;
  y2026: number | null; // gelecek aylar boş
}

/** Yıllık özet tablosu satırı — metrik × yıl + YoY. */
export interface YillikMetrik {
  metrik: string;
  birim: string;
  y2024: number;
  y2025: number;
  y2026: number;
  yoy: number; // 2025 → 2026 değişim
  yoyBirim?: string; // "%" (varsayılan) | "puan"
}

/** Yıl özet kartı. */
export interface YilKarti {
  yil: number;
  toplam: number; // GWh (yıllık toplam elektrik)
  yoy: number | null; // önceki yıla göre %
}

// -----------------------------------------------------------------------------
// Doğalgaz Analizi (analiz ekranı)
// -----------------------------------------------------------------------------

/** Üst KPI kartı — değişim yönü VEYA alt metin (ör. "Kasım 2026"). */
export interface DogalgazKpi {
  anahtar: string;
  baslik: string;
  deger: string;
  birim?: string;
  degisimYuzde?: number;
  altMetin?: string;
}

/** Yıllara göre aylık doğalgaz (Sm³) — 4 yıllık çizgi grafik. */
export interface DogalgazYilNokta {
  kisa: string;
  y2023: number;
  y2024: number;
  y2025: number;
  y2026: number | null;
}

/** Yıllık toplam doğalgaz — çubuk grafik. */
export interface DogalgazYilBar {
  yil: number;
  sm3: number;
}

/** Doğalgaz yoğunluğu serisi (gerçek + tahmin). */
export interface DogalgazYogunlukNokta {
  kisa: string;
  gercek: number | null;
  tahmin: number | null;
}

/** Mevsimsel dağılım dilimi. */
export interface DogalgazMevsim {
  anahtar: "kis" | "ilkbahar" | "yaz" | "sonbahar";
  etiket: string;
  yuzde: number;
  sm3: number;
}

/** Verimlilik fırsatı satırı. */
export interface DogalgazFirsat {
  baslik: string;
  aciklama: string;
  durum: "Fizibilite" | "Takip" | "Değerlendirme";
}

/** YTD özet. */
export interface DogalgazYtd {
  toplamSm3: string;
  toplamDegisim: number;
  tep: string;
  tepDegisim: number;
  ortalama: string;
  ortalamaDegisim: number;
  yogunluk: string;
  yogunlukDegisim: number;
}

/** Aylık detay satırı. */
export interface DogalgazAylik {
  ay: string;
  donem: string;
  sm3: number;
  tep: number;
  uretim: number; // ton
  yogunluk: number; // Sm³/ton
  oncekiAy: number | null;
  gecenYil: number | null;
}

/** Doğalgaz Analizi ekranının tüm mock verisi. */
export interface DogalgazAnaliz {
  kpiler: DogalgazKpi[];
  aylikTuketim: DogalgazYilNokta[];
  yillik: DogalgazYilBar[];
  yogunlukSeri: DogalgazYogunlukNokta[];
  mevsimsel: DogalgazMevsim[];
  toplamSm3: number;
  ytd: DogalgazYtd;
  firsatlar: DogalgazFirsat[];
  detay: DogalgazAylik[];
}

/** Elektrik & GES Analizi ekranının tüm mock verisi. */
export interface ElektrikGesAnaliz {
  kpiler: ElektrikKpi[];
  aylik: ElektrikAylik[];
  kaynaklar: ElektrikKaynakDilim[];
  toplamElektrikGwh: number; // donut merkezi
  ozet: ElektrikOzet;
  aylikKarsilastirma: AylikKarsilastirma[];
  yillikOzet: YillikMetrik[];
  yilKartlari: YilKarti[];
}

// -----------------------------------------------------------------------------
// Akaryakıt Analizi (analiz ekranı)
// -----------------------------------------------------------------------------

/** Üst KPI kartı — değişim yönü VEYA alt metin (ör. "Temmuz 2026"). */
export interface AkaryakitKpi {
  anahtar: string;
  baslik: string;
  deger: string;
  birim?: string;
  degisimYuzde?: number;
  altMetin?: string;
}

/** Yıllara göre aylık akaryakıt (Litre) — 4 yıllık çizgi grafik. */
export interface AkaryakitYilNokta {
  kisa: string;
  y2023: number;
  y2024: number;
  y2025: number;
  y2026: number | null;
}

/** Yıllık toplam akaryakıt — çubuk grafik. */
export interface AkaryakitYilBar {
  yil: number;
  litre: number;
}

/** Araç / jeneratör bazında aylık tüketim (Litre) — yığılmış çubuk grafik. */
export interface AkaryakitKullanimNokta {
  kisa: string;
  arac: number;
  jenerator: number;
}

/** Yakıt türü dağılımı dilimi. */
export interface AkaryakitTurDilim {
  anahtar: "motorin" | "benzin" | "diger";
  etiket: string;
  yuzde: number;
  litre: number;
}

/** Verimlilik fırsatı satırı. */
export interface AkaryakitFirsat {
  baslik: string;
  aciklama: string;
  durum: "Fizibilite" | "Takip" | "Değerlendirme";
}

/** YTD özet. */
export interface AkaryakitYtd {
  toplamLitre: string;
  toplamDegisim: number;
  tep: string;
  tepDegisim: number;
  ortalama: string;
  ortalamaDegisim: number;
  aracBasi: string;
  aracBasiDegisim: number;
}

/** Aylık detay satırı. */
export interface AkaryakitAylik {
  ay: string;
  donem: string;
  litre: number;
  tep: number;
  arac: number; // Litre
  jenerator: number; // Litre
  oncekiAy: number | null;
  gecenYil: number | null;
}

/** Akaryakıt Analizi ekranının tüm mock verisi. */
export interface AkaryakitAnaliz {
  kpiler: AkaryakitKpi[];
  aylikTuketim: AkaryakitYilNokta[];
  yillik: AkaryakitYilBar[];
  kullanimSeri: AkaryakitKullanimNokta[];
  turDagilimi: AkaryakitTurDilim[];
  toplamLitre: number;
  ytd: AkaryakitYtd;
  firsatlar: AkaryakitFirsat[];
  detay: AkaryakitAylik[];
}

// -----------------------------------------------------------------------------
// TEP Analizi (analiz ekranı)
// -----------------------------------------------------------------------------

/** Üst KPI kartı — değer + yön, veya yalnızca değişim (son kart). */
export interface TepKpi {
  anahtar: string;
  baslik: string;
  deger?: string;
  birim?: string;
  degisimYuzde?: number;
  sadeDegisim?: boolean; // yalnızca büyük yön göster (Geçen Yıla Göre Değişim)
}

/** Aylık TEP kırılımı — ana grafik + tablo tek kaynağı. */
export interface TepAylik {
  ay: string;
  kisa: string;
  donem: string;
  elektrik: number;
  dogalgaz: number;
  akaryakit: number;
  toplam: number;
  uretim: number; // ton
  yogunluk: number; // TEP/ton
  oncekiAy: number | null;
  gecenYil: number | null;
}

/** Yıllık toplam TEP — çubuk grafik + YoY. */
export interface TepYilBar {
  yil: number;
  tep: number;
  yoy: number | null;
}

/** Donut dilimi — enerji kaynak dağılımı. */
export interface TepKaynakDilim {
  anahtar: "elektrik" | "dogalgaz" | "akaryakit";
  etiket: string;
  tep: number;
  yuzde: number;
}

/** YTD özet. */
export interface TepYtd {
  yil2025: string;
  yil2026: string;
  fark: string;
  degisim: number;
}

/** Şelale (waterfall) adımı. */
export interface TepWaterfall {
  etiket: string;
  tur: "baz" | "artis" | "azalis" | "sonuc";
  deger: number;
}

/** Yoğunluk serisi noktası (TEP/ton). */
export interface TepYogunlukNokta {
  kisa: string;
  deger: number;
}

/** Baz yıla göre performans. */
export interface TepBazYil {
  bazYil: number;
  bazDeger: string;
  guncelDeger: string;
  iyilesme: number; // %
}

/** En yüksek / en düşük dönem kartı. */
export interface TepUcNokta {
  donem: string;
  deger: string;
  trend: number[];
}

/** TEP Analizi ekranının tüm mock verisi. */
/** Yıllara göre aylık toplam TEP (çoklu çizgi grafik). */
export interface TepYilNokta {
  kisa: string;
  y2023: number;
  y2024: number;
  y2025: number;
  y2026: number | null;
}

/** Yıllık özet tablosu satırı — metrik × yıl + YoY. */
export interface TepYillikMetrik {
  metrik: string;
  birim: string;
  y2023: number;
  y2024: number;
  y2025: number;
  y2026: number;
  yoy: number;
  yoyBirim?: string; // "%" (varsayılan) | "puan"
}

export interface TepAnaliz {
  kpiler: TepKpi[];
  aylik: TepAylik[];
  yillik: TepYilBar[];
  kaynaklar: TepKaynakDilim[];
  toplamTep: number;
  ytd: TepYtd;
  waterfall: TepWaterfall[];
  yogunlukSeri: TepYogunlukNokta[];
  bazYil: TepBazYil;
  enYuksek: TepUcNokta;
  enDusuk: TepUcNokta;
  aylikKarsilastirma: TepYilNokta[];
  yillikOzet: TepYillikMetrik[];
}

// -----------------------------------------------------------------------------
// Enerji Performansı (EnPI / baz yıl / hedef / sapma)
// -----------------------------------------------------------------------------

/** Üst KPI kartı — değer + yön / alt metin / ilerleme. */
export interface PerformansKpi {
  anahtar: string;
  baslik: string;
  deger?: string;
  birim?: string;
  degisimYuzde?: number;
  altMetin?: string;
  progress?: number; // 0-100 ilerleme çubuğu (İyileşme kartı)
  amber?: boolean; // uyarı vurgusu (Hedefe Kalan)
}

/** Aylık performans kaydı (trend + üretim-enerji + detay tablosu). */
export interface PerformansAylik {
  ay: string;
  kisa: string;
  donem: string;
  uretim: number; // ton
  toplamTep: number; // TEP
  bazEnPI: number; // TEP/ton
  hedefEnPI: number;
  gercekEnPI: number;
  sapma: number; // gercek - hedef
  performans: "takip" | "hedefte" | "iyi";
}

/** 2026 hedef gerçekleşme radial. */
export interface PerformansRadial {
  oran: number; // %63
  hedefIyilesme: number; // %10
  gerceklesen: number; // %6.3
  hedefeKalan: string; // "0,011"
}

/** Beklenen ve gerçekleşen enerji özeti. */
export interface PerformansBeklenen {
  beklenen: number; // TEP
  gerceklesen: number;
  kazanc: number;
  beklenenTrend: number[];
  gerceklesenTrend: number[];
  kazancTrend: number[];
}

/** Kaynak bazlı performans (elektrik / doğalgaz). */
export interface KaynakPerformans {
  anahtar: "elektrik" | "dogalgaz";
  etiket: string;
  deger: string;
  birim: string;
  bazDeger: string;
  iyilesme: number; // %
}

/** Performansı etkileyen proje. */
export interface PerformansProje {
  baslik: string;
  durum: "Devam Ediyor" | "Fizibilite" | "Teklif";
}

/** Baz yıla göre performans. */
export interface PerformansBazYil {
  bazYil: number;
  bazEnPI: string;
  guncelEnPI: string;
  iyilesme: number; // %
}

/** Sapma şelalesi adımı. */
export interface PerformansWaterfall {
  etiket: string;
  tur: "baz" | "artis" | "azalis" | "sonuc";
  deger: number;
}

/** Enerji hedefi satırı. */
export interface PerformansHedef {
  gosterge: string;
  baz: string;
  hedef: string;
  gercek: string;
  durum: "hedefte" | "takip" | "disi";
}

/** Enerji Performansı ekranının tüm mock verisi. */
export interface PerformansAnaliz {
  kpiler: PerformansKpi[];
  aylik: PerformansAylik[];
  radial: PerformansRadial;
  beklenen: PerformansBeklenen;
  kaynaklar: KaynakPerformans[];
  projeler: PerformansProje[];
  bazYil: PerformansBazYil;
  waterfall: PerformansWaterfall[];
  hedefler: PerformansHedef[];
}

// -----------------------------------------------------------------------------
// Enerji Fırsatları (verimlilik fırsatları)
// -----------------------------------------------------------------------------

export type FirsatDurum = "fizibilite" | "teklif" | "onaylandi" | "uygulama" | "tamamlandi";
export type FirsatOncelik = "yuksek" | "orta" | "dusuk";
export type FirsatKaynak = "elektrik" | "dogalgaz" | "akaryakit";

/** Üst KPI kartı. */
export interface FirsatKpi {
  anahtar: string;
  baslik: string;
  deger: string;
  birim?: string;
  altMetin: string;
}

/** Fırsat durum dağılımı dilimi (donut). */
export interface FirsatDurumDilim {
  anahtar: FirsatDurum;
  etiket: string;
  adet: number;
  yuzde: number;
}

/** Kaynak bazlı tasarruf dilimi (bar + donut). */
export interface FirsatKaynakDilim {
  anahtar: FirsatKaynak;
  etiket: string;
  tep: number;
  yuzde: number;
}

/** Tekil fırsat kaydı. */
export interface Firsat {
  id: string;
  oncelik: FirsatOncelik;
  ad: string;
  kaynak: FirsatKaynak;
  tasarruf: number; // TEP/yıl
  yatirim: number; // €
  geriDonus: number; // yıl
  durum: FirsatDurum;
  ilerleme: number; // %
}

/** Vade / etki potansiyeli kartı. */
export interface FirsatVade {
  anahtar: string;
  baslik: string;
  deger: string;
  birim: string;
  aciklama: string;
}

/** Enerji Fırsatları ekranının tüm mock verisi. */
export interface FirsatAnaliz {
  kpiler: FirsatKpi[];
  durumDagilimi: FirsatDurumDilim[];
  toplamFirsat: number;
  kaynakTasarruf: FirsatKaynakDilim[];
  toplamTasarruf: number;
  firsatlar: Firsat[];
  vadeler: FirsatVade[];
}

// -----------------------------------------------------------------------------
// Enerji Projeleri (onaylanmış / uygulama sürecindeki çalışmalar)
// -----------------------------------------------------------------------------

export type ProjeKaynak = "elektrik" | "dogalgaz" | "akaryakit";
export type ProjeDurum =
  | "planlama"
  | "muhendislik"
  | "satinAlma"
  | "uygulama"
  | "devreyeAlma"
  | "tamamlandi";
/** RAG (kırmızı/amber/yeşil) sağlık kodu; "yok" = henüz veri yok. */
export type ProjeRag = "yesil" | "amber" | "kirmizi" | "yok";

/** Üst KPI kartı. `ilerleme` verilirse kartta mini progress bar gösterilir. */
export interface ProjeKpi {
  anahtar: string;
  baslik: string;
  deger: string;
  birim?: string;
  altMetin: string;
  ilerleme?: number; // %
}

/** Proje yaşam döngüsü aşaması ve o aşamadaki proje sayısı. */
export interface ProjeAsama {
  anahtar: string;
  etiket: string;
  ikon: string; // iconify anahtarı
  adet: number;
}

/** Tekil proje kaydı — kartlar ve tablo için tek kaynak. */
export interface Proje {
  id: string;
  ad: string;
  aciklama: string;
  kaynak: ProjeKaynak;
  durum: ProjeDurum;
  ilerleme: number; // %
  baslangic: string; // "15.09.2026"
  hedefBitis: string; // "15.12.2026"
  sorumlu: string;
  butce: number; // TL
  harcanan: number; // TL
  beklenenTasarruf: number; // TEP/yıl
  dogrulananTasarruf: number | null; // TEP/yıl (henüz yoksa null)
  geriDonus: number; // yıl
  saglik: { zaman: ProjeRag; butce: ProjeRag; tasarruf: ProjeRag };
}

/** Gantt satırı — konumlar zaman ekseni genişliğinin yüzdesi cinsinden. */
export interface ProjeGantt {
  id: string;
  ad: string;
  renk: string; // proje bazlı accent
  sol: number; // %
  genislik: number; // %
  gecikme?: number; // çubuğun sonundaki çizgili/uyarı kısmının %'si
}

/** Bütçe donut dilimi / açıklama satırı (milyon TL). */
export interface ProjeButceKalem {
  etiket: string;
  deger: number; // M TL
  renk: string;
}

/** Dikkat gerektiren madde. */
export interface ProjeDikkatMadde {
  id: string;
  proje: string;
  mesaj: string;
  kaynak: ProjeKaynak;
}

/** Enerji Projeleri ekranının tüm mock verisi. */
export interface ProjeAnaliz {
  kpiler: ProjeKpi[];
  projeler: Proje[];
  asamalar: ProjeAsama[];
  gantt: ProjeGantt[];
  ganttEksen: string[]; // ["Ağu '26", ...]
  ganttBugun: number; // % konum
  butce: {
    toplam: number; // M TL
    kullanimYuzde: number;
    dilimler: ProjeButceKalem[]; // donut slice'ları
    kalemler: ProjeButceKalem[]; // açıklama satırları
  };
  tasarruf: { planlanan: number; dogrulanan: number }; // TEP/yıl
  dikkat: ProjeDikkatMadde[];
}

// -----------------------------------------------------------------------------
// Raporlar (raporlama merkezi)
// -----------------------------------------------------------------------------

export type RaporKategoriAnahtar =
  | "tuketim"
  | "performans"
  | "maliyet"
  | "tep"
  | "karsilastirma"
  | "ozel";
export type RaporFormat = "PDF" | "Excel" | "Excel, PDF";
export type RaporDurum = "aktif" | "taslak" | "arsivlendi" | "hata";

/** Üst KPI kartı. `boyut: "metin"` → değer sayı yerine uzun metin olarak gösterilir. */
export interface RaporKpi {
  anahtar: string;
  baslik: string;
  deger: string;
  birim?: string;
  altMetin: string;
  boyut?: "buyuk" | "metin";
}

/** Rapor kategorisi kartı. */
export interface RaporKategori {
  anahtar: RaporKategoriAnahtar;
  baslik: string;
  aciklama: string;
  adet: number;
}

/** Rapor trendi noktası (combo chart). */
export interface RaporTrendNoktasi {
  etiket: string; // "Ağu '26"
  olusturulan: number;
  indirilen: number;
}

/** En çok indirilen rapor satırı. */
export interface EnCokIndirilen {
  sira: number;
  ad: string;
  adet: number;
}

/** Son oluşturulan rapor satırı. */
export interface SonRapor {
  id: string;
  ad: string;
  tur: string;
  kategori: RaporKategoriAnahtar;
  tarih: string; // "26.08.2026 10:30"
  olusturan: string;
  format: RaporFormat;
}

/** Rapor listesi (tanımlı/kayıtlı rapor) satırı. */
export interface Rapor {
  id: string;
  ad: string;
  kategori: RaporKategoriAnahtar;
  aciklama: string;
  format: RaporFormat;
  siklik: string; // "Aylık"
  sonOlusturma: string; // "01.08.2026"
  durum: RaporDurum;
}

/** Raporlar ekranının tüm mock verisi. */
export interface RaporAnaliz {
  kpiler: RaporKpi[];
  kategoriler: RaporKategori[];
  trend: RaporTrendNoktasi[];
  enCokIndirilen: EnCokIndirilen[];
  sonRaporlar: SonRapor[];
  raporlar: Rapor[];
}

// --- Rapor Önizleme (detay ekranı mock içeriği) ---

export interface OnizlemeKpi {
  baslik: string;
  deger: string;
  birim?: string;
  degisim: number; // önceki döneme göre %
  iyiYon: "artis" | "azalis"; // hangi yön olumlu
}

export interface OnizlemeSeri {
  etiket: string; // "Mar"
  buDonem: number;
  oncekiDonem: number;
}

export interface OnizlemeDilim {
  etiket: string;
  deger: number;
  renk: string;
}

export interface RaporOnizleme {
  ozet: string;
  metrikAd: string;
  birim: string;
  kpiler: OnizlemeKpi[];
  seri: OnizlemeSeri[];
  dagilimBaslik: string;
  dagilim: OnizlemeDilim[];
  tabloBaslik: string;
  tabloKolonlar: string[];
  tabloSatirlar: string[][]; // son hücre değişim metni (± ile)
  degerlendirme: string[];
}

// -----------------------------------------------------------------------------
// Yönetim Özeti (yönetici gösterge ekranı)
// -----------------------------------------------------------------------------

export interface OzetKpi {
  anahtar: string;
  baslik: string;
  deger: string;
  birim?: string;
  degisim?: number; // % (yoksa değişim satırı yerine progress gösterilir)
  iyiYon?: "artis" | "azalis";
  altMetin: string;
  ilerleme?: number; // % — Hedefe Uyum kartındaki progress bar
}

export interface TuketimUretimNoktasi {
  ay: string; // "Oca"
  tuketim: number; // TEP
  uretim: number; // ton
}

export interface OzetKaynakDilim {
  anahtar: string;
  etiket: string;
  deger: number;
  yuzde: number;
  renk: string;
}

export interface OzetDonut {
  merkez: string; // "18.420"
  birim: string; // "TEP"
  dilimler: OzetKaynakDilim[];
}

export interface PerformansTrendNoktasi {
  ay: string;
  gerceklesen: number;
  hedef: number;
  bazYil: number;
}

export interface OzetOneCikan {
  anahtar: string;
  ikon: string;
  sinif: string;
  baslik: string;
  aciklama: string;
}

export interface OzetProje {
  id: string;
  ad: string;
  durum: ProjeDurum;
  ilerleme: number;
  tasarruf: number; // TEP/yıl
  termin: string;
}

export interface OzetRapor {
  id: string;
  ad: string;
  tarih: string;
  format: RaporFormat;
}

export interface OzetSistemDurum {
  alan: string;
  durum: string;
  iyi: boolean;
}

/** Yönetim Özeti ekranının tüm mock verisi. */
export interface YonetimOzetiAnaliz {
  kpiler: OzetKpi[];
  tuketimUretim: TuketimUretimNoktasi[];
  kaynakTep: OzetDonut;
  maliyetDagilim: OzetDonut;
  performansTrend: PerformansTrendNoktasi[];
  hedef: { yuzde: number; hedefIyilesme: string; gerceklesen: string; hedefeKalan: string };
  oneCikan: OzetOneCikan[];
  projeler: OzetProje[];
  raporlar: OzetRapor[];
  sistem: OzetSistemDurum[];
}

// -----------------------------------------------------------------------------
// Belgeler (doküman merkezi)
// -----------------------------------------------------------------------------

export type BelgeKategoriAnahtar = "yasal" | "sertifika" | "sozlesme" | "rapor" | "teknik" | "fatura";
export type BelgeDurum = "gecerli" | "yaklasiyor" | "doldu" | "taslak";
export type BelgeFormat = "PDF" | "Excel" | "Word" | "Görsel" | "Excel, PDF";

export interface BelgeKpi {
  anahtar: string;
  baslik: string;
  deger: string;
  birim?: string;
  altMetin: string;
  ilerleme?: number; // % — Depolama kartındaki progress
}

export interface BelgeKategori {
  anahtar: BelgeKategoriAnahtar;
  baslik: string;
  aciklama: string;
  adet: number;
  boyut: string; // "820 MB"
}

export interface Belge {
  id: string;
  ad: string;
  kategori: BelgeKategoriAnahtar;
  format: BelgeFormat;
  boyut: string; // "2,4 MB"
  yukleyen: string;
  tarih: string; // "15.03.2026"
  durum: BelgeDurum;
  gecerlilik: string | null; // son geçerlilik tarihi (yoksa null)
  aciklama: string;
}

export interface DepolamaKalem {
  anahtar: BelgeKategoriAnahtar;
  etiket: string;
  gb: number;
  renk: string;
}

export interface SureYaklasan {
  id: string;
  ad: string;
  kategori: BelgeKategoriAnahtar;
  tarih: string;
  kalanGun: number;
}

/** Belgeler ekranının tüm mock verisi. */
export interface BelgeAnaliz {
  kpiler: BelgeKpi[];
  kategoriler: BelgeKategori[];
  depolama: { toplam: number; kullanilan: number; yuzde: number; kalemler: DepolamaKalem[] };
  sureYaklasan: SureYaklasan[];
  belgeler: Belge[];
}

// -----------------------------------------------------------------------------
// Katsayılar (dönüşüm katsayıları / faktörler — ayar ekranı)
// -----------------------------------------------------------------------------

export interface KatsayiKpi {
  anahtar: string;
  baslik: string;
  deger: string;
  altMetin: string;
}

/** TEP dönüşüm katsayısı satırı. */
export interface TepKatsayi {
  id: string;
  ad: string; // "Elektrik"
  renk: string;
  birim: string; // "MWh"
  altIsil: string; // "860.000 kcal"
  tep: string; // "0,0860 TEP"
  referans: string;
}

/** CO₂ emisyon faktörü satırı. */
export interface EmisyonFaktor {
  id: string;
  ad: string;
  renk: string;
  birim: string;
  faktor: string; // "442 kgCO₂e"
  kapsam: "Kapsam 1" | "Kapsam 2";
}

/** Birim fiyat / tarife satırı. */
export interface BirimFiyat {
  id: string;
  ad: string;
  renk: string;
  birim: string;
  fiyat: string; // "2,45 TL"
  guncelleme: string; // "01.08.2026"
}

/** Genel parametre kartı. */
export interface GenelParametre {
  id: string;
  ad: string;
  deger: string;
  aciklama: string;
  ikon: string;
  sinif: string;
}

/** Katsayılar ekranının tüm mock verisi. */
export interface KatsayiAnaliz {
  kpiler: KatsayiKpi[];
  tep: TepKatsayi[];
  emisyon: EmisyonFaktor[];
  fiyat: BirimFiyat[];
  genel: GenelParametre[];
  kaynak: string;
  sonGuncelleme: string;
}

// -----------------------------------------------------------------------------
// Kullanıcılar (kullanıcı yönetimi)
// -----------------------------------------------------------------------------

export type KullaniciRol = "yonetici" | "editor" | "goruntuleyici";
export type KullaniciDurum = "aktif" | "pasif" | "davet";

export interface KullaniciKpi {
  anahtar: string;
  baslik: string;
  deger: string;
  altMetin: string;
}

export interface Kullanici {
  id: string;
  ad: string;
  email: string;
  bas: string; // avatar baş harfleri
  renk: string; // avatar arka plan
  rol: KullaniciRol;
  departman: string;
  durum: KullaniciDurum;
  sonGiris: string;
}

export interface RolDagilim {
  rol: KullaniciRol;
  adet: number;
}

/** Kullanıcılar ekranının tüm mock verisi. */
export interface KullaniciAnaliz {
  kpiler: KullaniciKpi[];
  roller: RolDagilim[];
  kullanicilar: Kullanici[];
}
