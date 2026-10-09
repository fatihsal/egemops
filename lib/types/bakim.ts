// -----------------------------------------------------------------------------
// BAKIM YÖNETİMİ — tip tanımları (V1 frontend)
// -----------------------------------------------------------------------------

export type Kritiklik = "dusuk" | "orta" | "yuksek" | "kritik";
export type BakimPeriyot = "haftalik" | "aylik" | "3aylik" | "6aylik" | "yillik" | "ozel";
export type BakimDurum = "planlandi" | "devam" | "tamamlandi" | "gecikti" | "planYok";

/** Checklist motoru tipi — SOP, operatör ve tesis kontrolleri aynı motoru kullanır. */
export type ChecklistTip = "TECHNICAL_MAINTENANCE" | "OPERATOR_INSPECTION" | "FACILITY_INSPECTION";

export type MaddeTuru = "temizlik" | "gorsel" | "ayar" | "seviye" | "islem";
export type FotoGereksinim = "yok" | "opsiyonel" | "zorunlu";

/** Teknik bakım madde durumu. */
export type MaddeDurum = "bekliyor" | "tamamlandi" | "bulguVar" | "uygulanmadi" | "uygulanamaz";
/** Operatör kontrol madde durumu. */
export type OperatorDurum = "bekliyor" | "uygun" | "uygunsuzluk";

export type IsEmriDurum =
  | "planlandi"
  | "devam"
  | "tamamlandi"
  | "muhendisKontrol"
  | "onaylandi";

export type FotoTur = "oncesi" | "sonrasi" | "yapilanIs" | "bulgu" | "genel";
export type BulguDurum = "acik" | "planlandi" | "tamamlandi" | "iptal";
export type RagDurum = "uygun" | "takip" | "uygunDegil";
export type GozlemSonuc = "uretimeUygun" | "takip" | "ekIslem";

export type BakimRolu = "TEKNISYEN" | "MUHENDIS" | "YONETICI" | "SISTEM_YONETICISI";

// ---------------------------------------------------------------------------

export interface Makine {
  id: string;
  ad: string;
  kod: string;
  bolum: string;
  grup: string;
  marka?: string;
  model?: string;
  seriNo?: string;
  lokasyon?: string;
  devreyeAlmaYili?: number;
  kritiklik: Kritiklik;
  sorumluEkip?: string;
  fotoUrl?: string;
  sonBakim?: string; // "28.09.2026"
  sonrakiBakim?: string;
  acikIsEmri: number;
  uyumOrani: number; // %
}

export interface BakimPlani {
  id: string;
  makineId: string;
  ad: string;
  bakimTuru: string;
  periyot: BakimPeriyot;
  ozelGun?: number; // periyot = ozel ise
  baslangic: string;
  sorumlu: string;
  tahminiSureSaat: number;
  kritiklik: Kritiklik;
  sopId?: string;
}

export interface SopMadde {
  id: string;
  no: string; // "1.1"
  bolum?: string; // ünite grubu: "Die", "Baskı Üniteleri"...
  baslik: string;
  aciklama?: string;
  turu: MaddeTuru;
  fotoGereksinimi: FotoGereksinim;
  tahminiDakika?: number;
}

export interface SopVersiyon {
  id: string;
  sopId: string;
  rev: number;
  tarih: string;
  degisiklikNotu?: string;
  maddeler: SopMadde[];
}

export interface SopSablon {
  id: string;
  ad: string;
  makineId?: string;
  tip: ChecklistTip;
  aktifVersiyonId: string;
  versiyonlar: SopVersiyon[];
}

/** İş emrine kopyalanan madde (snapshot) + uygulama kaydı. */
export interface IsEmriMadde {
  sopMaddeId: string;
  no: string;
  bolum?: string;
  baslik: string;
  aciklama?: string;
  turu: MaddeTuru;
  fotoGereksinimi: FotoGereksinim;
  durum: MaddeDurum | OperatorDurum;
  yapanPersonel?: string;
  tamamlanmaZamani?: string;
  not?: string;
  fotograflar: Foto[];
  bulguId?: string;
  malzeme?: string;
}

export interface Foto {
  id: string;
  tur: FotoTur;
  url: string;
  maddeNo?: string;
}

export interface IsEmri {
  id: string;
  no: string; // "WO-2026-0142"
  makineId: string;
  makineAd: string;
  planId?: string;
  bakimTuru: string;
  periyot: BakimPeriyot;
  tip: ChecklistTip;
  planlananTarih: string;
  baslama?: string;
  sorumluEkip: string;
  teknisyenler: string[];
  durum: IsEmriDurum;
  maddeler: IsEmriMadde[];
  tamamlananMadde: number;
  toplamMadde: number;
  gozlem?: BakimSonrasiGozlem;
  onaylayan?: string;
  onayTarihi?: string;
}

export interface Bulgu {
  id: string;
  makineId: string;
  makineAd: string;
  isEmriId?: string;
  sopMaddeNo?: string;
  kaynak: "bakim" | "operator";
  aciklama: string;
  onerilenAksiyon?: string;
  sorumlu?: string;
  termin?: string;
  durum: BulguDurum;
  olusturmaTarihi: string;
}

export interface BakimSonrasiGozlem {
  genelGozlem: string;
  detayliGozlem?: string;
  kontrol: {
    mekanik: RagDurum;
    elektrik: RagDurum;
    pnomatik: RagDurum;
    sensor: RagDurum;
    emniyet: RagDurum;
    urunAkisi: RagDurum;
  };
  denemeYapildi: boolean;
  sonuc: GozlemSonuc;
  takipNotlari?: string;
  onaylayan?: string;
  onayTarihi?: string;
}

export interface BakimDokuman {
  id: string;
  ad: string;
  tur: string;
  url: string;
  makineId?: string;
  planId?: string;
}

// --------------------------- Dashboard ---------------------------

export interface BakimKpi {
  anahtar: string;
  baslik: string;
  deger: string;
  birim?: string;
  altMetin?: string;
  degisim?: number; // %
  ikon: string;
  renk: string; // blue|emerald|amber|red|teal|slate|purple
  ilerleme?: number; // % (halka ilerleme)
  bilgi?: boolean; // (i) bilgi ikonu
}

/** Takvim olay tipi (periyot + planlama durumu). */
export type TakvimTip =
  | "haftalikForm"
  | "3aylik"
  | "6aylik"
  | "12aylik"
  | "planlamaBekliyor"
  | "tarihOnerildi"
  | "ertelendi";

export interface TakvimOlay {
  gun: number; // ayın günü
  kod: string; // "LM-01"
  tip: TakvimTip;
}

/** Genel renkli sayaç dilimi (liste/donut). */
export interface SayiDilim {
  etiket: string;
  adet: number;
  renk: string; // hex
}

/** Haftalık form hücre durumu (3 seviye). */
export type FormHucre = "tamamlandi" | "eksik" | "uygulanmadi";

export interface FormTakipSatir {
  makine: string;
  haftalar: FormHucre[];
}

export interface YaklasanPeriyodik {
  tarih: string;
  makine: string;
  bakimTuru: string;
  durum: string; // planlama durumu etiketi
  durumTipi: "cevapBekliyor" | "tarihOnerildi" | "uretimUyumDegil" | "onaylandi";
}

export interface SonTamamlanan {
  tarih: string;
  makine: string;
  bakimTuru: string;
  aciklama: string;
}

export interface BakimDashboardAnaliz {
  kpiler: BakimKpi[];
  takvim: { yil: number; ay: number; olaylar: TakvimOlay[] };
  buAyPlanlanan: { dilimler: SayiDilim[]; toplam: number };
  periyodikDagilim: { toplam: number; dilimler: SayiDilim[] };
  buAyTamamlanan: { yuzde: number; tamamlanan: number; planlanan: number };
  planlamaDurumu: SayiDilim[];
  formTakip: { haftalar: string[]; satirlar: FormTakipSatir[] };
  formOran: { hafta: string; oran: number }[];
  yaklasanPeriyodik: YaklasanPeriyodik[];
  sonTamamlanan: SonTamamlanan[];
}

export interface AuditKayit {
  id: string;
  varlik: string;
  alan: string;
  oncekiDeger: string;
  yeniDeger: string;
  degistiren: string;
  tarih: string;
  neden?: string;
}

// --------------------------- Operatör Kontrolleri ---------------------------
// Haftalık operatör formu — aynı Checklist Engine (OPERATOR_INSPECTION).
// 2 durumlu: Uygun / Uygunsuzluk. Uygunsuzlukta not+foto → bakıma bulgu.

export type OperatorKontrolDurum = "planlandi" | "devam" | "tamamlandi";

export interface OperatorMadde {
  no: string;
  bolum?: string;
  gorev: string;
  turu: MaddeTuru;
  aciklama?: string;
  durum: OperatorDurum; // bekliyor | uygun | uygunsuzluk
  not?: string;
  fotograflar: Foto[];
  bulguId?: string;
}

// --------------------------- SOP & Form Yönetimi (sayfa) ---------------------------

export type SopBakimTipi = "3A" | "6A" | "12A";
export type SopRevDurum = "aktif" | "kullanimda" | "revizeBekliyor" | "eksikFoto";
export type EslesenHazir = "hazir" | "revizeBekliyor" | "eksikFoto";

export interface MakineSopSatir {
  makineId: string;
  makineAd: string;
  ekipmanKodu: string;
  bakimTipleri: SopBakimTipi[];
  sonRevizyon: string; // "Rev.5"
  sonKullanim: string;
  durum: SopRevDurum;
  sopId?: string; // varsa gerçek SOP şablonu
}

export interface SonRevizeSatir {
  sopAd: string;
  revNo: string;
  tarih: string;
  sorumlu: string;
}

export interface EslesenSopSatir {
  makine: string;
  bakimTipi: string;
  planlananTarih: string;
  eslesenSop: string;
  hazir: EslesenHazir;
}

export interface SopSayfaAnaliz {
  satirlar: MakineSopSatir[];
  sonRevize: SonRevizeSatir[];
  yaklasanEslesen: EslesenSopSatir[];
}

// --------------------------- Bakım Kayıtları (arşiv) ---------------------------

export interface BakimKayit {
  id: string;
  formNo: string; // "WO-2026-0139"
  tarih: string; // tamamlanma tarihi
  makineId: string;
  makineAd: string;
  bakimTuru: string;
  periyot: BakimPeriyot;
  kaynak: "teknik" | "operator";
  yapan: string;
  sureSaat: number;
  sonuc: "uygun" | "takip" | "bulguVar";
  bulguSayi: number;
  onaylayan?: string;
  isEmriId?: string;
}

export interface OperatorKontrol {
  id: string;
  no: string; // "OK-2026-0042"
  makineId: string;
  makineAd: string;
  hafta: string; // "06 - 12 Ekim 2026"
  tarih: string; // planlanan / oluşturma
  operator: string;
  vardiya?: string; // "Gündüz" | "Gece"
  durum: OperatorKontrolDurum;
  maddeler: OperatorMadde[];
  tamamlananMadde: number;
  toplamMadde: number;
  uygunsuzlukSayi: number;
}
