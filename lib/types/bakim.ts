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
  altMetin: string;
  degisim?: number; // %
  ikon: string;
  renk: string; // tailwind sınıf grubu için anahtar: blue|emerald|amber|red|teal|slate
  ilerleme?: number; // % (halka ilerleme)
}

export interface FormDagilimSatir {
  makine: string;
  adet: number;
}

export interface PlanDurumDilim {
  etiket: string;
  adet: number;
  yuzde: number;
  renk: string;
}

export interface TrendNokta {
  ay: string;
  oran: number;
}

export interface YaklasanBakim {
  id: string;
  gun: string; // "15"
  ayKisa: string; // "Eki"
  makine: string;
  bakim: string;
  kalanGun: number;
}

export interface SonKayit {
  tarih: string;
  makine: string;
  bakimTuru: string;
  formNo: string;
  onaylayan: string;
  durum: string;
}

export interface SopKullanim {
  kullanildi: number;
  kismen: number;
  kullanilmadi: number;
  yuzde: number;
}

export interface TeknisyenYuk {
  ad: string;
  yuzde: number;
}

export type UyumHucre = "yesil" | "amber" | "kirmizi";

export interface UyumHaritaSatir {
  makine: string;
  haftalar: UyumHucre[];
  genelUyum: number;
}

export interface HaftaEtiket {
  kisa: string; // "H1"
  tarih: string; // "18-24 Kas"
}

export interface BakimDashboardAnaliz {
  kpiler: BakimKpi[];
  formDagilimi: FormDagilimSatir[];
  planDurumu: { toplam: number; dilimler: PlanDurumDilim[] };
  tamamlamaTrend: TrendNokta[];
  yaklasan: YaklasanBakim[];
  sonKayitlar: SonKayit[];
  sopKullanim: SopKullanim;
  teknisyenYuk: TeknisyenYuk[];
  uyumHaritasi: { haftalar: HaftaEtiket[]; satirlar: UyumHaritaSatir[] };
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
