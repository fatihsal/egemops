// Üst bar (MarkaHeader) için sayfa başlık/açıklama haritası.
// Yeni sayfa eklerken buraya bir satır eklemek yeterli.

export interface SayfaMeta {
  baslik: string;
  altBaslik: string;
}

const META: Record<string, SayfaMeta> = {
  "/": { baslik: "Enerji Yönetimi", altBaslik: "Daha verimli, daha yaşanabilir bir gelecek için enerjimizi doğru yönetiyoruz." },
  "/veri-girisi": { baslik: "Aylık Veri Girişi", altBaslik: "Aylık enerji tüketim ve üretim verilerini girin ve doğrulayın." },
  "/enerji-kayitlari": { baslik: "Enerji Kayıtları", altBaslik: "Tüm dönemlerin enerji kayıtlarını görüntüleyin ve yönetin." },
  "/elektrik-ges": { baslik: "Elektrik & GES", altBaslik: "Elektrik tüketimi ve güneş enerjisi (GES) üretim analizi." },
  "/dogalgaz": { baslik: "Doğalgaz", altBaslik: "Doğalgaz tüketimi, maliyet ve verimlilik analizi." },
  "/akaryakit": { baslik: "Akaryakıt", altBaslik: "Akaryakıt tüketimi, maliyet ve filo analizi." },
  "/tep-analizi": { baslik: "TEP Analizi", altBaslik: "Kaynak bazlı eşdeğer petrol (TEP) dönüşüm analizi." },
  "/enerji-performansi": { baslik: "Enerji Performansı", altBaslik: "Enerji performans göstergeleri (EnPI) ve hedef takibi." },
  "/firsatlar": { baslik: "Enerji Fırsatları", altBaslik: "Enerji verimliliği fırsatlarını görüntüleyin, potansiyel tasarrufları analiz edin." },
  "/projeler": { baslik: "Enerji Projeleri", altBaslik: "Onaylanan projelerin bütçe, termin ve ilerleme durumunu takip edin." },
  "/raporlar": { baslik: "Raporlar", altBaslik: "Enerji verilerinizi analiz edin ve raporları oluşturup dışa aktarın." },
  "/yonetim-ozeti": { baslik: "Yönetim Özeti", altBaslik: "Performansınızı, tasarruflarınızı ve stratejik göstergeleri tek ekranda görün." },
  "/belgeler": { baslik: "Belgeler", altBaslik: "Yasal belgeler, sertifikalar, sözleşmeler ve raporları arşivleyin." },
  "/katsayilar": { baslik: "Katsayılar", altBaslik: "Enerji hesaplamalarında kullanılan dönüşüm, emisyon ve fiyat katsayıları." },
  "/kullanicilar": { baslik: "Kullanıcılar", altBaslik: "Ekip üyelerini, rollerini ve erişim izinlerini yönetin." },
  "/ayarlar": { baslik: "Ayarlar", altBaslik: "Profil, kurum bilgileri, bildirimler ve entegrasyon tercihleri." },
};

const VARSAYILAN: SayfaMeta = META["/"];

export function sayfaMeta(pathname: string): SayfaMeta {
  if (META[pathname]) return META[pathname];
  if (pathname.startsWith("/raporlar/")) {
    return { baslik: "Rapor Önizleme", altBaslik: "Rapor içeriğini görüntüleyin, yazdırın veya dışa aktarın." };
  }
  if (pathname.startsWith("/enerji-kayitlari/")) {
    return { baslik: "Kayıt Detayı", altBaslik: "Dönemin enerji tüketim, üretim ve fatura verilerini görüntüleyin." };
  }
  return VARSAYILAN;
}
