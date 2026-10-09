// -----------------------------------------------------------------------------
// BAKIM — Planlı İş Emirleri (mock) + SOP snapshot maddeleri
// İş emri, oluşturulduğu andaki SOP versiyonunun KOPYASINI (snapshot) taşır;
// SOP sonradan değişse de bu iş emri değişmez (ISO/audit izi).
// -----------------------------------------------------------------------------

import type { IsEmri, IsEmriMadde, MaddeDurum } from "@/lib/types/bakim";
import { gecikmeIle } from "@/lib/data/mock-utils";

function madde(
  no: string,
  bolum: string,
  baslik: string,
  turu: IsEmriMadde["turu"],
  fotoGereksinimi: IsEmriMadde["fotoGereksinimi"],
  aciklama?: string,
  tahminiDakika?: number,
): IsEmriMadde {
  return {
    sopMaddeId: `sm-${no}`,
    no,
    bolum,
    baslik,
    aciklama,
    turu,
    fotoGereksinimi,
    durum: "bekliyor",
    fotograflar: [],
  };
}

/** Lemanic laminasyon — yıllık kapsamlı bakım SOP snapshot'ı (11 madde). */
function lemanicMaddeler(): IsEmriMadde[] {
  return [
    madde("1.1", "Besleme Ünitesi", "Besleme merdaneleri temizliği", "temizlik", "opsiyonel", "Merdane yüzeylerindeki tutkal/toz kalıntılarını temizleyin.", 15),
    madde("1.2", "Besleme Ünitesi", "Kenar kontrol (EPC) sensörü kontrolü", "gorsel", "opsiyonel", "Sensör lensini temizleyin, hizayı kontrol edin.", 10),
    madde("2.1", "Laminasyon Ünitesi", "Aplikatör merdane durumu", "gorsel", "zorunlu", "Yüzey aşınması ve çizik kontrolü; fotoğraf çekin.", 15),
    madde("2.2", "Laminasyon Ünitesi", "Tutkal haznesi ve pompa temizliği", "temizlik", "zorunlu", "Hazneyi boşaltıp temizleyin, pompa akışını kontrol edin.", 25),
    madde("2.3", "Laminasyon Ünitesi", "Nip (baskı) basınç ayarı kontrolü", "ayar", "opsiyonel", "Her iki taraf basınç değerlerini referansla karşılaştırın.", 15),
    madde("3.1", "Kurutma Ünitesi", "Kurutma fanları ve filtre kontrolü", "gorsel", "opsiyonel", "Filtreleri kontrol edin, gerekiyorsa değiştirin.", 20),
    madde("3.2", "Kurutma Ünitesi", "Sıcaklık sensörleri kalibrasyon kontrolü", "seviye", "yok", "Set değeri ile gerçek değeri karşılaştırın.", 15),
    madde("4.1", "Mekanik & Tahrik", "Tahrik zinciri / kayış gerginliği", "ayar", "opsiyonel", "Gerginliği ölçün, gerekiyorsa ayarlayın.", 20),
    madde("4.2", "Mekanik & Tahrik", "Rulman ve hareketli parça yağlama", "islem", "yok", "Yağlama noktalarını belirtilen gresle yağlayın.", 20),
    madde("5.1", "Elektrik & Pano", "Pano içi temizlik ve bağlantı kontrolü", "temizlik", "opsiyonel", "Toz temizliği + klemens sıkılık kontrolü.", 20),
    madde("6.1", "Emniyet & Genel", "Acil stop ve kapı emniyet switch testi", "gorsel", "zorunlu", "Tüm emniyet switchlerini fonksiyonel test edin.", 15),
  ];
}

/** Standart aylık genel bakım snapshot'ı (6 madde). */
function genelMaddeler(): IsEmriMadde[] {
  return [
    madde("1.1", "Genel", "Genel görsel inceleme ve dış temizlik", "temizlik", "opsiyonel", "Makine genel durumu, kaçak/gevşeklik kontrolü.", 15),
    madde("1.2", "Mekanik", "Hareketli parça yağlama", "islem", "yok", "Yağlama noktalarını yağlayın.", 15),
    madde("1.3", "Mekanik", "Kayış / zincir gerginlik kontrolü", "ayar", "opsiyonel", undefined, 10),
    madde("2.1", "Elektrik", "Pano ve kablaj görsel kontrolü", "gorsel", "opsiyonel", "Isınma/gevşeklik/kaçak izi kontrolü.", 10),
    madde("2.2", "Emniyet", "Emniyet switch / acil stop testi", "gorsel", "zorunlu", "Fonksiyonel test + fotoğraf.", 10),
    madde("3.1", "Genel", "Çalışma testi ve gözlem", "islem", "opsiyonel", "Kısa çalıştırma, ses/titreşim gözlemi.", 10),
  ];
}

/** Belirtilen indekslere durum uygular (+ tamamlananlar için personel/zaman). */
function isaretle(
  maddeler: IsEmriMadde[],
  harita: Record<number, MaddeDurum>,
  personel: string,
  zaman: string,
  notlar?: Record<number, string>,
): IsEmriMadde[] {
  for (const [i, durum] of Object.entries(harita)) {
    const idx = Number(i);
    const m = maddeler[idx];
    if (!m) continue;
    m.durum = durum;
    if (durum !== "bekliyor") {
      m.yapanPersonel = personel;
      m.tamamlanmaZamani = zaman;
    }
    if (notlar?.[idx]) m.not = notlar[idx];
  }
  return maddeler;
}

function tamamSay(m: IsEmriMadde[]): number {
  return m.filter((x) => x.durum !== "bekliyor").length;
}

function isEmri(
  base: Omit<IsEmri, "tamamlananMadde" | "toplamMadde">,
): IsEmri {
  return { ...base, tamamlananMadde: tamamSay(base.maddeler), toplamMadde: base.maddeler.length };
}

export const IS_EMIRLERI: IsEmri[] = [
  isEmri({
    id: "wo-0142", no: "WO-2026-0142", makineId: "mk-lemanic1", makineAd: "Lemanic-1",
    planId: "bp-004", bakimTuru: "Kapsamlı Bakım", periyot: "yillik", tip: "TECHNICAL_MAINTENANCE",
    planlananTarih: "05.10.2026", baslama: "05.10.2026", sorumluEkip: "Bakım Onarım",
    teknisyenler: ["Mehmet Y.", "Ahmet K."], durum: "devam",
    maddeler: isaretle(
      lemanicMaddeler(),
      { 0: "tamamlandi", 1: "tamamlandi", 2: "tamamlandi", 3: "tamamlandi", 4: "bulguVar" },
      "Mehmet Y.", "05.10.2026 10:20",
      { 4: "Sağ taraf nip basıncı referansın altında, ayar yapıldı ancak takip gerekiyor." },
    ),
  }),
  isEmri({
    id: "wo-0145", no: "WO-2026-0145", makineId: "mk-lemanic2", makineAd: "Lemanic-2",
    planId: "bp-006", bakimTuru: "Genel Bakım", periyot: "aylik", tip: "TECHNICAL_MAINTENANCE",
    planlananTarih: "12.10.2026", baslama: "12.10.2026", sorumluEkip: "Bakım Onarım",
    teknisyenler: ["Ahmet K."], durum: "devam",
    maddeler: isaretle(genelMaddeler(), { 0: "tamamlandi", 1: "tamamlandi" }, "Ahmet K.", "12.10.2026 09:10"),
  }),
  isEmri({
    id: "wo-0143", no: "WO-2026-0143", makineId: "mk-spanthera", makineAd: "Spanthera 106-LER",
    planId: "bp-017", bakimTuru: "Baskı Bakımı", periyot: "aylik", tip: "TECHNICAL_MAINTENANCE",
    planlananTarih: "10.10.2026", sorumluEkip: "Bakım Onarım", teknisyenler: ["Mehmet Y."], durum: "planlandi",
    maddeler: genelMaddeler(),
  }),
  isEmri({
    id: "wo-0144", no: "WO-2026-0144", makineId: "mk-foilmaster", makineAd: "Foilmaster",
    planId: "bp-020", bakimTuru: "Mekanik Bakım", periyot: "6aylik", tip: "TECHNICAL_MAINTENANCE",
    planlananTarih: "15.10.2026", sorumluEkip: "Bakım Onarım", teknisyenler: ["Mehmet Y."], durum: "planlandi",
    maddeler: genelMaddeler(),
  }),
  isEmri({
    id: "wo-0146", no: "WO-2026-0146", makineId: "mk-rotomec1", makineAd: "Rotomec-1",
    planId: "bp-023", bakimTuru: "Genel Bakım", periyot: "aylik", tip: "TECHNICAL_MAINTENANCE",
    planlananTarih: "16.10.2026", sorumluEkip: "Bakım Onarım", teknisyenler: ["Ahmet K."], durum: "planlandi",
    maddeler: genelMaddeler(),
  }),
  isEmri({
    id: "wo-0140", no: "WO-2026-0140", makineId: "mk-expertcut", makineAd: "Expertcut 106-PER",
    planId: "bp-015", bakimTuru: "Genel Bakım", periyot: "aylik", tip: "TECHNICAL_MAINTENANCE",
    planlananTarih: "21.09.2026", sorumluEkip: "Bakım Onarım", teknisyenler: ["Ahmet K."], durum: "planlandi",
    maddeler: genelMaddeler(),
  }),
  isEmri({
    id: "wo-0139", no: "WO-2026-0139", makineId: "mk-sp104", makineAd: "SP 104-ER",
    planId: "bp-012", bakimTuru: "Genel Bakım", periyot: "aylik", tip: "TECHNICAL_MAINTENANCE",
    planlananTarih: "19.09.2026", baslama: "19.09.2026", sorumluEkip: "Bakım Onarım",
    teknisyenler: ["Mehmet Y."], durum: "muhendisKontrol",
    maddeler: isaretle(
      genelMaddeler(),
      { 0: "tamamlandi", 1: "tamamlandi", 2: "tamamlandi", 3: "tamamlandi", 4: "tamamlandi", 5: "tamamlandi" },
      "Mehmet Y.", "19.09.2026 14:30",
    ),
  }),
  isEmri({
    id: "wo-0135", no: "WO-2026-0135", makineId: "mk-focusight", makineAd: "Focusight Shark 500",
    planId: "bp-026", bakimTuru: "Kalibrasyon", periyot: "6aylik", tip: "TECHNICAL_MAINTENANCE",
    planlananTarih: "07.07.2026", baslama: "07.07.2026", sorumluEkip: "Bakım Onarım",
    teknisyenler: ["Ali K."], durum: "onaylandi", onaylayan: "Müh. Serkan D.", onayTarihi: "08.07.2026",
    maddeler: isaretle(
      genelMaddeler(),
      { 0: "tamamlandi", 1: "tamamlandi", 2: "tamamlandi", 3: "tamamlandi", 4: "tamamlandi", 5: "tamamlandi" },
      "Ali K.", "07.07.2026 11:45",
    ),
    gozlem: {
      genelGozlem: "Kalibrasyon sonrası tüm eksenler ve kamera modülü referans değerlerinde. Deneme çalışmasında hata/kaçak gözlenmedi.",
      kontrol: { mekanik: "uygun", elektrik: "uygun", pnomatik: "uygun", sensor: "uygun", emniyet: "uygun", urunAkisi: "uygun" },
      denemeYapildi: true,
      sonuc: "uretimeUygun",
      takipNotlari: "",
      onaylayan: "Müh. Serkan D.",
      onayTarihi: "08.07.2026",
    },
  }),
];

export function isEmirleriGetir(): Promise<IsEmri[]> {
  return gecikmeIle(IS_EMIRLERI);
}

export function isEmriGetir(id: string): Promise<IsEmri | undefined> {
  return gecikmeIle(IS_EMIRLERI.find((w) => w.id === id));
}

export function makineIsEmirleriGetir(makineId: string): Promise<IsEmri[]> {
  return gecikmeIle(IS_EMIRLERI.filter((w) => w.makineId === makineId));
}
