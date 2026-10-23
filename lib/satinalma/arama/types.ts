// Web arama sağlayıcısı soyutlaması — tedarikçi adaylarını DOĞRULANABİLİR
// kaynaklardan bulmak için. Her sonuç gerçek bir URL taşır; firma/sonuç
// uydurulmaz. Sağlayıcı env anahtarına göre seçilir (factory).

export interface AramaSonucu {
  baslik: string;
  url: string;
  ozet: string;
  alanAdi: string; // gösterim için host (ör. festo.com)
}

export interface AramaSaglayici {
  ad: string;
  ara(sorgu: string, enCok?: number): Promise<AramaSonucu[]>;
}

export function alanAdiCikar(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
