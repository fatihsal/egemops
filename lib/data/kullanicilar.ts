// -----------------------------------------------------------------------------
// VERİ KATMANI — Kullanıcılar (mock)
// -----------------------------------------------------------------------------

import type { Kullanici, KullaniciAnaliz, KullaniciKpi, RolDagilim } from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";

const KPILER: KullaniciKpi[] = [
  { anahtar: "toplam", baslik: "Toplam Kullanıcı", deger: "12", altMetin: "Tüm departmanlar" },
  { anahtar: "aktif", baslik: "Aktif Kullanıcı", deger: "9", altMetin: "Son 30 günde giriş yaptı" },
  { anahtar: "davet", baslik: "Bekleyen Davet", deger: "2", altMetin: "Yanıt bekliyor" },
  { anahtar: "yonetici", baslik: "Yönetici", deger: "2", altMetin: "Tam yetkili" },
];

const ROLLER: RolDagilim[] = [
  { rol: "yonetici", adet: 2 },
  { rol: "editor", adet: 6 },
  { rol: "goruntuleyici", adet: 4 },
];

const KULLANICILAR: Kullanici[] = [
  { id: "u1", ad: "Uğur Melih", email: "ugur.melih@egemops.com", bas: "UM", renk: "#0d9488", rol: "yonetici", departman: "Enerji Yönetimi", durum: "aktif", sonGiris: "Bugün 09:12" },
  { id: "u2", ad: "Ayşe Demir", email: "ayse.demir@egemops.com", bas: "AD", renk: "#2563eb", rol: "editor", departman: "Enerji Yönetimi", durum: "aktif", sonGiris: "Bugün 08:40" },
  { id: "u3", ad: "Mehmet Kaya", email: "mehmet.kaya@egemops.com", bas: "MK", renk: "#f59e0b", rol: "editor", departman: "Bakım Onarım", durum: "aktif", sonGiris: "Dün 17:25" },
  { id: "u4", ad: "Fatma Şahin", email: "fatma.sahin@egemops.com", bas: "FŞ", renk: "#8b5cf6", rol: "editor", departman: "Satın Alma", durum: "aktif", sonGiris: "Dün 14:03" },
  { id: "u5", ad: "Ali Yıldız", email: "ali.yildiz@egemops.com", bas: "AY", renk: "#0891b2", rol: "goruntuleyici", departman: "Finans", durum: "pasif", sonGiris: "12.07.2026" },
  { id: "u6", ad: "Zeynep Arslan", email: "zeynep.arslan@egemops.com", bas: "ZA", renk: "#ec4899", rol: "editor", departman: "Bakım Onarım", durum: "davet", sonGiris: "—" },
  { id: "u7", ad: "Can Öztürk", email: "can.ozturk@egemops.com", bas: "CÖ", renk: "#16a34a", rol: "goruntuleyici", departman: "Üretim", durum: "aktif", sonGiris: "Bugün 07:55" },
  { id: "u8", ad: "Elif Aydın", email: "elif.aydin@egemops.com", bas: "EA", renk: "#dc2626", rol: "editor", departman: "Kalite", durum: "aktif", sonGiris: "Dün 11:18" },
  { id: "u9", ad: "Burak Çelik", email: "burak.celik@egemops.com", bas: "BÇ", renk: "#7c3aed", rol: "yonetici", departman: "Yönetim", durum: "aktif", sonGiris: "Bugün 08:02" },
  { id: "u10", ad: "Selin Koç", email: "selin.koc@egemops.com", bas: "SK", renk: "#0284c7", rol: "goruntuleyici", departman: "Üretim", durum: "aktif", sonGiris: "3 gün önce" },
  { id: "u11", ad: "Emre Doğan", email: "emre.dogan@egemops.com", bas: "ED", renk: "#d97706", rol: "editor", departman: "Bakım Onarım", durum: "aktif", sonGiris: "Dün 16:47" },
  { id: "u12", ad: "Deniz Yılmaz", email: "deniz.yilmaz@egemops.com", bas: "DY", renk: "#059669", rol: "goruntuleyici", departman: "Finans", durum: "davet", sonGiris: "—" },
];

export function kullaniciAnaliziGetir(): Promise<KullaniciAnaliz> {
  return gecikmeIle({ kpiler: KPILER, roller: ROLLER, kullanicilar: KULLANICILAR });
}
