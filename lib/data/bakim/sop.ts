// -----------------------------------------------------------------------------
// BAKIM — SOP & Checklist şablonları (mock)
// Şablon → Versiyon (rev) → Madde. İş emri, oluşturulduğu an aktif versiyonun
// SNAPSHOT'ını alır (lib/data/bakim/is-emirleri.ts).
// -----------------------------------------------------------------------------

import type { SopMadde, SopSablon } from "@/lib/types/bakim";
import { gecikmeIle } from "@/lib/data/mock-utils";

function sm(
  no: string,
  bolum: string,
  baslik: string,
  turu: SopMadde["turu"],
  fotoGereksinimi: SopMadde["fotoGereksinimi"],
  tahminiDakika?: number,
  aciklama?: string,
): SopMadde {
  return { id: `sm-${no}`, no, bolum, baslik, turu, fotoGereksinimi, tahminiDakika, aciklama };
}

const LEM_TUM: SopMadde[] = [
  sm("1.1", "Besleme Ünitesi", "Besleme merdaneleri temizliği", "temizlik", "opsiyonel", 15),
  sm("1.2", "Besleme Ünitesi", "Kenar kontrol (EPC) sensörü kontrolü", "gorsel", "opsiyonel", 10),
  sm("2.1", "Laminasyon Ünitesi", "Aplikatör merdane durumu", "gorsel", "zorunlu", 15),
  sm("2.2", "Laminasyon Ünitesi", "Tutkal haznesi ve pompa temizliği", "temizlik", "zorunlu", 25),
  sm("2.3", "Laminasyon Ünitesi", "Nip (baskı) basınç ayarı kontrolü", "ayar", "opsiyonel", 15),
  sm("3.1", "Kurutma Ünitesi", "Kurutma fanları ve filtre kontrolü", "gorsel", "opsiyonel", 20),
  sm("3.2", "Kurutma Ünitesi", "Sıcaklık sensörleri kalibrasyon kontrolü", "seviye", "yok", 15),
  sm("4.1", "Mekanik & Tahrik", "Tahrik zinciri / kayış gerginliği", "ayar", "opsiyonel", 20),
  sm("4.2", "Mekanik & Tahrik", "Rulman ve hareketli parça yağlama", "islem", "yok", 20),
  sm("5.1", "Elektrik & Pano", "Pano içi temizlik ve bağlantı kontrolü", "temizlik", "opsiyonel", 20),
  sm("6.1", "Emniyet & Genel", "Acil stop ve kapı emniyet switch testi", "gorsel", "zorunlu", 15),
];
// rev1: 2.3 ve 6.1 yok (sonradan eklendi)
const LEM_R1: SopMadde[] = LEM_TUM.filter((m) => m.no !== "2.3" && m.no !== "6.1");

const GENEL: SopMadde[] = [
  sm("1.1", "Genel", "Genel görsel inceleme ve dış temizlik", "temizlik", "opsiyonel", 15),
  sm("1.2", "Mekanik", "Hareketli parça yağlama", "islem", "yok", 15),
  sm("1.3", "Mekanik", "Kayış / zincir gerginlik kontrolü", "ayar", "opsiyonel", 10),
  sm("2.1", "Elektrik", "Pano ve kablaj görsel kontrolü", "gorsel", "opsiyonel", 10),
  sm("2.2", "Emniyet", "Emniyet switch / acil stop testi", "gorsel", "zorunlu", 10),
  sm("3.1", "Genel", "Çalışma testi ve gözlem", "islem", "opsiyonel", 10),
];

const OPERATOR: SopMadde[] = [
  sm("1", "Haftalık", "Genel temizlik — makine çevresi ve yüzeyler", "temizlik", "opsiyonel"),
  sm("2", "Haftalık", "Yağ / gres seviyeleri kontrolü", "seviye", "yok"),
  sm("3", "Haftalık", "Hava basıncı / pnömatik kontrol", "seviye", "yok"),
  sm("4", "Haftalık", "Acil stop butonları kontrolü", "gorsel", "opsiyonel"),
  sm("5", "Haftalık", "Kayış / zincir görsel durumu", "gorsel", "opsiyonel"),
  sm("6", "Haftalık", "Anormal ses / titreşim kontrolü", "gorsel", "yok"),
  sm("7", "Haftalık", "Kaçak (yağ / hava / su) kontrolü", "gorsel", "yok"),
  sm("8", "Haftalık", "Emniyet kapakları / muhafazalar kontrolü", "gorsel", "yok"),
];

const FOCUSIGHT: SopMadde[] = [
  sm("1.1", "Optik", "Kamera lenslerinin temizliği", "temizlik", "zorunlu", 20),
  sm("1.2", "Optik", "Aydınlatma modülü kontrolü", "gorsel", "opsiyonel", 10),
  sm("2.1", "Kalibrasyon", "Referans kart ile kalibrasyon", "ayar", "zorunlu", 30),
  sm("2.2", "Kalibrasyon", "Hata yakalama testi (test numunesi)", "islem", "opsiyonel", 25),
  sm("3.1", "Mekanik", "Taşıma bandı ve ejektör kontrolü", "gorsel", "opsiyonel", 15),
];

export const SOP_SABLONLARI: SopSablon[] = [
  {
    id: "sop-lemanic", ad: "Lemanic Laminasyon — Yıllık Kapsamlı Bakım", makineId: "mk-lemanic1",
    tip: "TECHNICAL_MAINTENANCE", aktifVersiyonId: "v-lem-r2",
    versiyonlar: [
      { id: "v-lem-r1", sopId: "sop-lemanic", rev: 1, tarih: "15.01.2024", degisiklikNotu: "İlk yayın.", maddeler: LEM_R1 },
      { id: "v-lem-r2", sopId: "sop-lemanic", rev: 2, tarih: "20.02.2026", degisiklikNotu: "Nip basınç ayarı (2.3) ve acil stop/emniyet switch testi (6.1) eklendi.", maddeler: LEM_TUM },
    ],
  },
  {
    id: "sop-genel-aylik", ad: "Standart Aylık Genel Bakım", tip: "TECHNICAL_MAINTENANCE", aktifVersiyonId: "v-gen-r1",
    versiyonlar: [
      { id: "v-gen-r1", sopId: "sop-genel-aylik", rev: 1, tarih: "01.03.2025", degisiklikNotu: "İlk yayın.", maddeler: GENEL },
    ],
  },
  {
    id: "sop-operator", ad: "Haftalık Operatör Kontrol Formu", tip: "OPERATOR_INSPECTION", aktifVersiyonId: "v-op-r2",
    versiyonlar: [
      { id: "v-op-r1", sopId: "sop-operator", rev: 1, tarih: "10.06.2024", degisiklikNotu: "İlk yayın (6 madde).", maddeler: OPERATOR.slice(0, 6) },
      { id: "v-op-r2", sopId: "sop-operator", rev: 2, tarih: "05.01.2026", degisiklikNotu: "Kaçak ve muhafaza kontrolleri eklendi (8 madde).", maddeler: OPERATOR },
    ],
  },
  {
    id: "sop-focusight", ad: "Focusight Shark 500 — 6 Aylık Kalibrasyon", makineId: "mk-focusight",
    tip: "TECHNICAL_MAINTENANCE", aktifVersiyonId: "v-foc-r1",
    versiyonlar: [
      { id: "v-foc-r1", sopId: "sop-focusight", rev: 1, tarih: "12.01.2025", degisiklikNotu: "İlk yayın.", maddeler: FOCUSIGHT },
    ],
  },
  {
    id: "sop-spanthera", ad: "Spanthera Baskı Ünitesi — Yıllık Kapsamlı Bakım", makineId: "mk-spanthera",
    tip: "TECHNICAL_MAINTENANCE", aktifVersiyonId: "v-spa-r1",
    versiyonlar: [
      { id: "v-spa-r1", sopId: "sop-spanthera", rev: 1, tarih: "10.03.2026", degisiklikNotu: "İlk yayın.", maddeler: GENEL },
    ],
  },
];

export function sopListeGetir(): Promise<SopSablon[]> {
  return gecikmeIle(SOP_SABLONLARI);
}

export function sopGetir(id: string): Promise<SopSablon | undefined> {
  return gecikmeIle(SOP_SABLONLARI.find((s) => s.id === id));
}
