// Sahte veri yardımcıları.
// Gerçek backend eklendiğinde bu dosyaya ihtiyaç kalmaz; yerini `fetch` çağrıları alır.

/** Ağ gecikmesini taklit ederek yükleniyor/hata durumlarının gerçekçi görünmesini sağlar. */
export function gecikmeIle<T>(veri: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(veri), ms));
}
