// -----------------------------------------------------------------------------
// TİPLER — Akıllı Teknik Satın Alma modülü
// Supabase sa_* tablolarını ve uygulama arabirimini yansıtır.
// -----------------------------------------------------------------------------

export type TalepDurum =
  | "taslak"
  | "kaynak_arama"
  | "rfq_gonderildi"
  | "teklif_toplama"
  | "karsilastirma"
  | "tamamlandi"
  | "iptal";

export type AiDurum = "beklemede" | "dogrulandi";
export type RfqDurum = "taslak" | "onay_bekliyor" | "gonderildi" | "yanitlandi" | "iptal";
export type TeklifKaynak = "gmail" | "manuel";
export type MailProviderTuru = "gmail" | "microsoft";

export type UrunDurumu = "yeni" | "ikinci_el_kabul" | "farketmez";
export type Kapsam = "parca" | "komple" | "farketmez";

export interface TalepKalem {
  id: string;
  talepId: string;
  sira: number;
  ad: string;
  marka: string | null;
  model: string | null;
  siparisKodu: string | null;
  adet: number | null;
  birim: string | null;
  urunDurumu: UrunDurumu;
  kapsam: Kapsam;
  alternatifKabul: boolean;
  teknikAciklama: string | null;
  aiCikarim: AiCikarim | null;
  aiDurum: AiDurum;
  notlar: string | null;
  createdAt: string;
}

export interface FirmaProfili {
  firmaAdi: string;
  gonderenAdi: string;
  departman: string;
  telefon: string;
  imza: string;
}

/** AI'nın görselden çıkardığı yapısal öneri (ai_cikarim jsonb). */
export interface AiCikarim {
  marka?: string;
  model?: string;
  urunKodu?: string; // tam sipariş/ürün kodu (kesilmeden, seri no ile karıştırmadan)
  kategori?: string;
  ozellikler?: { ad: string; deger: string }[];
  guven?: number; // 0..1
  belirsizAlanlar?: string[];
  ozet?: string;
}

export interface Talep {
  id: string;
  talepNo: string | null;
  baslik: string;
  marka: string | null;
  model: string | null;
  adet: number | null;
  birim: string | null;
  teknikAciklama: string | null;
  fotoUrl: string[];
  aiCikarim: AiCikarim | null;
  aiDurum: AiDurum;
  durum: TalepDurum;
  olusturan: string | null;
  olusturanAd?: string;
  kalemSayisi?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tedarikci {
  id: string;
  ad: string;
  webSitesi: string | null;
  eposta: string | null;
  telefon: string | null;
  ulke: string | null;
  kaynakUrl: string; // zorunlu
  dogrulanmis: boolean;
  notlar: string | null;
  createdAt: string;
}

export interface Rfq {
  id: string;
  talepId: string;
  tedarikciId: string | null;
  konu: string | null;
  govde: string | null;
  aliciEposta: string | null;
  durum: RfqDurum;
  provider: string | null;
  messageId: string | null;
  gonderildiAt: string | null;
  createdAt: string;
}

export interface Teklif {
  id: string;
  talepId: string;
  tedarikciId: string | null;
  rfqId: string | null;
  pdfUrl: string | null;
  depolamaYolu: string | null;
  kaynak: TeklifKaynak;
  fiyat: number | null;
  paraBirimi: string | null;
  kdvDahil: boolean | null;
  kdvOran: number | null;
  terminGun: number | null;
  nakliye: string | null;
  garantiAy: number | null;
  teknikUygun: boolean | null;
  teknikNot: string | null;
  notlar: string | null;
  aiOzet: string | null;
  okunamadi: boolean;
  surum: number;
  gecerlilik: string | null;
  createdAt: string;
}
