// -----------------------------------------------------------------------------
// VERİ KATMANI — Enerji yönetimi (tek tesis)
// -----------------------------------------------------------------------------
// Şimdilik sahte (mock) veri döndürür ve seçili döneme göre ölçeklenir.
// Backend bağlandığında SADECE bu dosyadaki fonksiyonların içi değişir; imzalar
// (Donem alan / aynı tipi döndüren) sabit kaldığı sürece ekranlar etkilenmez.
// -----------------------------------------------------------------------------

import { eachDayOfInterval, format } from "date-fns";
import { tr } from "date-fns/locale";

import type {
  AylikMaliyet,
  EnerjiFirsat,
  EnerjiHedef,
  EnerjiKaynakDagilim,
  EnerjiKpi,
  EnerjiYogunluk,
  GesPerformans,
  GuncellemeKaydi,
  KarbonOzet,
  KaynakDilimi,
  SebekeGesNoktasi,
  TurTuketim,
  TuketimNoktasi,
  VeriDurumDetay,
  YillikTepNoktasi,
} from "@/lib/types";

const AY_ADLARI = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];
import { gecikmeIle } from "@/lib/data/mock-utils";
import { BUGUN, donemGunSayisi, type Donem } from "@/lib/donem";

// Günlük taban değerler — dönem uzunluğuna göre çarpılır.
const GUNLUK = {
  tuketim: 2807, // kWh (toplam elektrik)
  uretim: 720, // kWh (öz üretim)
  ges: 620, // kWh (GES / solar üretimi)
  maliyet: 10413, // ₺
  co2: 893, // kg
  dogalgaz: 425, // Sm³
  akaryakit: 180, // Litre
  tep: 0.78, // TEP (tüm kaynakların petrol eşdeğeri toplamı)
  su: 61, // m³
};

function olcek(taban: number, gun: number): number {
  return Math.round(taban * gun);
}

// KPI kartları — yıllık özet değerler (döneme bağlı değil, tıpkı görseldeki
// "Yıl" bazlı üst kartlar gibi). Değişimler bir önceki yıla kıyasla.
export function enerjiKpiGetir(): Promise<EnerjiKpi[]> {
  const kartlar: EnerjiKpi[] = [
    { anahtar: "toplamEnerji", baslik: "Toplam Enerji", deger: 842.6, birim: "TEP", degisimYuzde: -3.4 },
    { anahtar: "elektrik", baslik: "Toplam Elektrik", deger: 7.84, birim: "GWh", degisimYuzde: 2.1 },
    { anahtar: "ges", baslik: "GES Üretimi", deger: 2.53, birim: "GWh", degisimYuzde: 11.8 },
    { anahtar: "dogalgaz", baslik: "Doğalgaz", deger: 526000, birim: "Sm³", degisimYuzde: -4.2 },
    { anahtar: "akaryakit", baslik: "Akaryakıt", deger: 21687, birim: "L", degisimYuzde: 6.1 },
    { anahtar: "gesKatki", baslik: "GES Katkısı", deger: 32, birim: "%", degisimYuzde: 3.2, degisimBirim: "puan" },
  ];
  return gecikmeIle(kartlar);
}

export function turTuketimGetir(donem: Donem): Promise<TurTuketim[]> {
  const gun = donemGunSayisi(donem);
  const veri: TurTuketim[] = [
    { tur: "elektrik", etiket: "Elektrik", deger: olcek(GUNLUK.tuketim, gun), birim: "kWh", degisimYuzde: -3.4 },
    { tur: "dogalgaz", etiket: "Doğalgaz", deger: olcek(GUNLUK.dogalgaz, gun), birim: "Sm³", degisimYuzde: 6.7 },
    { tur: "su", etiket: "Su", deger: olcek(GUNLUK.su, gun), birim: "m³", degisimYuzde: -1.2 },
  ];
  return gecikmeIle(veri);
}

export function kaynakDagilimiGetir(donem: Donem): Promise<KaynakDilimi[]> {
  const gun = donemGunSayisi(donem);
  const toplam = olcek(GUNLUK.tuketim, gun);
  const veri: KaynakDilimi[] = [
    { kaynak: "sebeke", etiket: "Şebeke", deger: Math.round(toplam * 0.74) },
    { kaynak: "solar", etiket: "Solar", deger: Math.round(toplam * 0.22) },
    { kaynak: "jenerator", etiket: "Jeneratör", deger: Math.round(toplam * 0.04) },
  ];
  return gecikmeIle(veri);
}

export function karbonOzetGetir(donem: Donem): Promise<KarbonOzet> {
  const gun = donemGunSayisi(donem);
  const veri: KarbonOzet = {
    co2Kg: olcek(GUNLUK.co2, gun),
    yenilenebilirOran: 26,
    tasarrufKg: Math.round(GUNLUK.co2 * gun * 0.16),
  };
  return gecikmeIle(veri);
}

export function tuketimSerisiGetir(donem: Donem): Promise<TuketimNoktasi[]> {
  const gun = donemGunSayisi(donem);

  // Tek gün: saatlik kırılım (24 nokta).
  if (gun <= 1) {
    const noktalar: TuketimNoktasi[] = Array.from({ length: 24 }, (_, s) => {
      const gunduz = s >= 7 && s <= 19;
      return {
        etiket: `${String(s).padStart(2, "0")}:00`,
        tuketim: Math.round((gunduz ? 150 : 70) + Math.sin(s / 3) * 30),
        uretim: gunduz ? Math.round(35 + Math.sin((s - 6) / 4) * 45) : 0,
      };
    });
    return gecikmeIle(noktalar);
  }

  // Aralık: günlük kırılım.
  const gunler = eachDayOfInterval({
    start: new Date(donem.baslangic),
    end: new Date(donem.bitis),
  });
  const noktalar: TuketimNoktasi[] = gunler.map((g, i) => {
    const haftaSonu = g.getDay() === 0 || g.getDay() === 6;
    const taban = haftaSonu ? 1900 : 2900;
    return {
      etiket: format(g, "d MMM", { locale: tr }),
      tuketim: taban + Math.round(Math.sin(i / 2) * 260) + (i % 5) * 40,
      uretim: 520 + Math.round(Math.abs(Math.cos(i / 3)) * 380),
    };
  });
  return gecikmeIle(noktalar);
}

// --- Alt panel bileşenleri (görselin alt kısmı) ---

export function enerjiYogunlukGetir(): Promise<EnerjiYogunluk> {
  return gecikmeIle({ deger: 0.285, degisimYuzde: -5.3, gecenYil: 0.301 });
}

export function enerjiHedefGetir(): Promise<EnerjiHedef> {
  return gecikmeIle({
    hedef: 5,
    gerceklesen: 3.8,
    ilerlemeYuzde: 76,
    mesaj: "Hedefe doğru iyi ilerliyorsunuz",
  });
}

export function enerjiFirsatGetir(): Promise<EnerjiFirsat> {
  return gecikmeIle({ toplamAcik: 5, devamEden: 2, tamamlanan: 3 });
}

export function veriDurumGetir(): Promise<VeriDurumDetay> {
  return gecikmeIle({
    kaynaklar: [
      { etiket: "Elektrik", mevcut: 12, toplam: 12 },
      { etiket: "GES", mevcut: 12, toplam: 12 },
      { etiket: "Doğalgaz", mevcut: 12, toplam: 12 },
      { etiket: "Akaryakıt", mevcut: 12, toplam: 12 },
    ],
    tamlikOrani: 96,
    tamamlananAy: 7,
    toplamAy: 12,
  });
}

export function guncellemelerGetir(): Promise<GuncellemeKaydi[]> {
  return gecikmeIle([
    { tarih: "2026-08-24", aciklama: "Temmuz 2026 elektrik verisi güncellendi" },
    { tarih: "2026-08-22", aciklama: "Temmuz doğalgaz faturası eklendi" },
    { tarih: "2026-08-21", aciklama: "EAF aydınlatma projesi güncellendi" },
    { tarih: "2026-08-20", aciklama: "Akaryakıt tüketim verisi güncellendi" },
  ]);
}

// Aylık Şebeke / GES elektrik üretimi (kWh) — yığılmış çubuk grafiği.
export function sebekeGesGetir(): Promise<SebekeGesNoktasi[]> {
  const veri: SebekeGesNoktasi[] = AY_ADLARI.map((ay, i) => {
    const yaz = i >= 4 && i <= 8; // Mayıs–Eylül: GES yüksek
    return {
      ay,
      sebeke: 400000 + Math.round(Math.cos(i / 2) * 60000) + (yaz ? -35000 : 45000),
      ges: 140000 + Math.round((yaz ? 120000 : 45000) + Math.sin(i) * 25000),
    };
  });
  return gecikmeIle(veri);
}

// Enerji kaynaklarının dağılımı (yıllık, tür bazında) — görseldeki donut.
export function enerjiKaynakDagilimiGetir(): Promise<EnerjiKaynakDagilim> {
  return gecikmeIle({
    kaynaklar: [
      { tur: "elektrik", etiket: "Elektrik", gwh: 5.63, yuzde: 72 },
      { tur: "dogalgaz", etiket: "Doğalgaz", gwh: 1.96, yuzde: 25 },
      { tur: "akaryakit", etiket: "Akaryakıt", gwh: 0.26, yuzde: 3 },
    ],
    toplamTep: 842.6,
  });
}

// GES performans özeti (yıllık).
export function gesPerformansGetir(): Promise<GesPerformans> {
  return gecikmeIle({
    yillikUretim: 2.53,
    ozTuketim: 1.95,
    sebekeyeVerilen: 0.58,
    karsilamaOrani: 32,
    karsilamaDegisim: 3.2,
    tahminiTasarruf: 35.4,
  });
}

// Aylık Toplam Enerji Tüketimi (TEP) — her zaman son 3 yılı kapsar.
// İçinde bulunulan yılın gelecek ayları null (henüz veri yok).
const TEP_AYLAR = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];
// Aylık mevsimsel taban (kış aylarında ısıtma nedeniyle yüksek), TEP.
const TEP_MEVSIM = [26, 25, 24, 22, 20, 19, 19, 20, 22, 24, 25, 26];

export function yillikTepGetir(): Promise<YillikTepNoktasi[]> {
  const buAy = BUGUN.getMonth(); // 0 tabanlı: Ağustos = 7
  const veri: YillikTepNoktasi[] = TEP_AYLAR.map((ay, i) => ({
    ay,
    onceki2: Math.round(TEP_MEVSIM[i] * 1.08), // en eski yıl, en yüksek
    onceki1: Math.round(TEP_MEVSIM[i] * 1.03),
    buYil: i > buAy ? null : Math.round(TEP_MEVSIM[i] * 0.97), // verimlilik ↑ → düşüş
  }));
  return gecikmeIle(veri);
}

// Maliyet grafiği içinde bulunulan takvim yılını (2026) gösterir.
// Henüz gelmemiş aylar (bugünden sonrası) boş bırakılır; böylece yılın
// tamamlanmadığı görünür.
export function aylikMaliyetGetir(): Promise<AylikMaliyet[]> {
  const yil = BUGUN.getFullYear();
  const buAy = BUGUN.getMonth(); // 0 tabanlı: Ağustos = 7
  const veri: AylikMaliyet[] = Array.from({ length: 12 }, (_, i) => {
    const ay = `${yil}-${String(i + 1).padStart(2, "0")}`;
    // Gelecek aylar: veri yok.
    if (i > buAy) {
      return { ay, gunduz: 0, gece: 0, puant: 0 };
    }
    return {
      ay,
      gunduz: 140000 + Math.round(Math.sin(i) * 22000) + i * 1500,
      gece: 78000 + Math.round(Math.cos(i) * 12000),
      puant: 52000 + Math.round(Math.sin(i / 2) * 9000),
    };
  });
  return gecikmeIle(veri);
}
