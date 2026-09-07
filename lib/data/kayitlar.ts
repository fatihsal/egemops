// -----------------------------------------------------------------------------
// VERİ KATMANI — Enerji Kayıtları (mock)
// -----------------------------------------------------------------------------
// Frontend gösterim amaçlı sahte kayıtlar. Backend gelince yalnız bu dosya değişir.

import type {
  EnerjiKayit,
  KayitDurum,
  KayitGecmis,
  KayitOzet,
  VeriKalite,
  YillikOzetSatir,
} from "@/lib/types";
import { gecikmeIle } from "@/lib/data/mock-utils";

interface Baz {
  donem: string;
  yil: number;
  ay: number;
  elektrik: number;
  ges: number;
  dogalgaz: number;
  akaryakit: number;
  toplamTep: number;
  durum: KayitDurum;
  veriKalitesi: VeriKalite;
}

const BAZ: Baz[] = [
  { donem: "Ağustos 2026", yil: 2026, ay: 8, elektrik: 838217.4, ges: 295000, dogalgaz: 43921.18, akaryakit: 1630, toplamTep: 109.5, durum: "taslak", veriKalitesi: "kontrol" },
  { donem: "Temmuz 2026", yil: 2026, ay: 7, elektrik: 684250.3, ges: 315600, dogalgaz: 43850, akaryakit: 1740, toplamTep: 99.8, durum: "onaylandi", veriKalitesi: "tam" },
  { donem: "Haziran 2026", yil: 2026, ay: 6, elektrik: 655400.1, ges: 298300, dogalgaz: 41210, akaryakit: 1620, toplamTep: 95.4, durum: "onaylandi", veriKalitesi: "tam" },
  { donem: "Mayıs 2026", yil: 2026, ay: 5, elektrik: 620115.2, ges: 285000, dogalgaz: 40100, akaryakit: 1550, toplamTep: 91.3, durum: "onaylandi", veriKalitesi: "tam" },
  { donem: "Nisan 2026", yil: 2026, ay: 4, elektrik: 598440, ges: 270200, dogalgaz: 38900, akaryakit: 1420, toplamTep: 86.8, durum: "onaylandi", veriKalitesi: "tam" },
  { donem: "Mart 2026", yil: 2026, ay: 3, elektrik: 566300.5, ges: 245600, dogalgaz: 37450, akaryakit: 1380, toplamTep: 81.7, durum: "onaylandi", veriKalitesi: "tam" },
  { donem: "Şubat 2026", yil: 2026, ay: 2, elektrik: 545210.2, ges: 230800, dogalgaz: 35820, akaryakit: 1310, toplamTep: 77.6, durum: "kontrol", veriKalitesi: "kontrol" },
  { donem: "Ocak 2026", yil: 2026, ay: 1, elektrik: 533120, ges: 220500, dogalgaz: 34900, akaryakit: 1210, toplamTep: 74.2, durum: "onaylandi", veriKalitesi: "tam" },
  { donem: "Aralık 2025", yil: 2025, ay: 12, elektrik: 512440.1, ges: 210300, dogalgaz: 33500, akaryakit: 1180, toplamTep: 70.3, durum: "onaylandi", veriKalitesi: "tam" },
  { donem: "Kasım 2025", yil: 2025, ay: 11, elektrik: 498230, ges: 198600, dogalgaz: 32400, akaryakit: 1120, toplamTep: 66.9, durum: "onaylandi", veriKalitesi: "tam" },
];

const AY_ADI = [
  "", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

// BAZ'daki 10 kayıttan (2026-08 → 2025-11) daha eskileri üretir:
// 2025-10'dan 2023-02'ye kadar, toplam 33 kayıt.
function eskiUret(): Baz[] {
  const donemler: { yil: number; ay: number }[] = [];
  for (let y = 2025; y >= 2023; y--) {
    const bas = y === 2025 ? 10 : 12;
    const bit = y === 2023 ? 2 : 1;
    for (let ay = bas; ay >= bit; ay--) donemler.push({ yil: y, ay });
  }
  return donemler.map((d, i) => {
    const toplamTep = Math.round((64 - i * 0.72 + Math.sin(i) * 1.5) * 100) / 100;
    let durum: KayitDurum = "onaylandi";
    let veriKalitesi: VeriKalite = "tam";
    if (i === 5 || i === 8) durum = "taslak";
    if (i === 12) durum = "kontrol";
    if (i === 3) veriKalitesi = "eksik";
    return {
      donem: `${AY_ADI[d.ay]} ${d.yil}`,
      yil: d.yil,
      ay: d.ay,
      elektrik: Math.round(toplamTep * 7200 * 100) / 100,
      ges: Math.round(toplamTep * 2900),
      dogalgaz: Math.round(toplamTep * 430 * 100) / 100,
      akaryakit: Math.round(toplamTep * 15),
      toplamTep,
      durum,
      veriKalitesi,
    };
  });
}

function gecmisUret(k: Baz): KayitGecmis[] {
  const ustBaslik =
    k.durum === "onaylandi"
      ? "Kayıt onaylandı"
      : k.durum === "kontrol"
        ? "Kontrole gönderildi"
        : "Taslak kaydedildi";
  return [
    { tarih: "26.08.2026 15:20", baslik: ustBaslik, kullanici: "Uğur Melih", tur: "onay" },
    {
      tarih: "26.08.2026 14:48",
      baslik: "Doğalgaz: 42.850 → 43.921 Sm³",
      aciklama: "Fatura değeri düzeltildi",
      kullanici: "Uğur Melih",
      tur: "duzenleme",
    },
    { tarih: "25.08.2026 11:12", baslik: "Elektrik faturası eklendi", kullanici: "Uğur Melih", tur: "ekleme" },
  ];
}

function kayitlariUret(): EnerjiKayit[] {
  const tumu = [...BAZ, ...eskiUret()];
  return tumu.map((k, i) => {
    const onceki = tumu[i + 1] ?? null;
    const degisim = onceki
      ? Math.round(((k.toplamTep - onceki.toplamTep) / onceki.toplamTep) * 1000) / 10
      : null;
    const { ges, ...rest } = k;
    const gesOzTuketim = Math.round(ges * 0.8);
    const sebekeyeVerilen = ges - gesOzTuketim;
    const sebekeElektrik = Math.round((k.elektrik - gesOzTuketim) * 100) / 100;
    const motorin = Math.round(k.akaryakit * 0.86);
    const benzin = Math.round(k.akaryakit * 0.13);
    const diger = k.akaryakit - motorin - benzin;
    const uretimTon = Math.round((k.toplamTep / 0.285) * 10) / 10;
    const enerjiYogunluk = Math.round((k.toplamTep / uretimTon) * 1000) / 1000;
    const oncekiYogunluk = Math.round(enerjiYogunluk * 0.975 * 1000) / 1000;
    const slug = k.donem.replace(/\s/g, "_");
    return {
      id: `${k.yil}-${String(k.ay).padStart(2, "0")}`,
      ...rest,
      gesUretim: ges,
      elektrikTep: Math.round(k.toplamTep * 0.59 * 100) / 100,
      dogalgazTep: Math.round(k.toplamTep * 0.395 * 100) / 100,
      akaryakitTep: Math.round(k.toplamTep * 0.015 * 100) / 100,
      gesKarsilama: 31.4,
      oncekiDonem: onceki?.donem ?? null,
      oncekiTep: onceki?.toplamTep ?? null,
      degisimYuzde: degisim,
      sonGuncelleme: "24.08.2026 14:32",
      guncelleyen: "Uğur Melih",
      olusturan: "Uğur Melih",
      onaylayan: "Yönetici",
      belgeSayisi: 4,
      gecmis: gecmisUret(k),
      sebekeElektrik,
      gesOzTuketim,
      sebekeyeVerilen,
      motorin,
      benzin,
      diger,
      uretimTon,
      enerjiYogunluk,
      oncekiYogunluk,
      yogunlukDegisim:
        Math.round(((enerjiYogunluk - oncekiYogunluk) / oncekiYogunluk) * 1000) / 10,
      notlar:
        "GES üretimi planlanan seviyede gerçekleşmiştir. Kompresör dairesindeki yük artışı nedeniyle elektrik tüketimi geçen aya göre yükselmiştir. Doğalgaz tarafında üretim yoğunluğu nedeniyle sınırlı artış gözlenmiştir.",
      belgeler: [
        { ad: `Elektrik_Faturasi_${slug}.pdf`, tur: "PDF", ikon: "vscode-icons:file-type-pdf2" },
        { ad: `Dogalgaz_Faturasi_${slug}.pdf`, tur: "PDF", ikon: "vscode-icons:file-type-pdf2" },
        { ad: `GES_${slug}.xlsx`, tur: "Excel", ikon: "vscode-icons:file-type-excel" },
        { ad: `Akaryakit_${slug}.pdf`, tur: "PDF", ikon: "vscode-icons:file-type-pdf2" },
      ],
      oncekiElektrikTep: onceki ? Math.round(onceki.toplamTep * 0.59 * 100) / 100 : null,
      oncekiDogalgazTep: onceki ? Math.round(onceki.toplamTep * 0.395 * 100) / 100 : null,
      oncekiAkaryakitTep: onceki ? Math.round(onceki.toplamTep * 0.015 * 100) / 100 : null,
    };
  });
}

export function enerjiKayitlariGetir(): Promise<EnerjiKayit[]> {
  return gecikmeIle(kayitlariUret());
}

export function kayitGetir(id: string): Promise<EnerjiKayit | undefined> {
  return gecikmeIle(kayitlariUret().find((k) => k.id === id));
}

export function kayitOzetiGetir(): Promise<KayitOzet> {
  const kayitlar = kayitlariUret();
  const toplam = kayitlar.length;
  const say = (f: (k: EnerjiKayit) => boolean) => kayitlar.filter(f).length;
  const oran = (n: number) => Math.round((n / toplam) * 1000) / 10;
  const yillar = [...new Set(kayitlar.map((k) => k.yil))].sort();
  const onaylanan = say((k) => k.durum === "onaylandi");
  const kontrol = say((k) => k.durum === "kontrol");
  const taslak = say((k) => k.durum === "taslak");
  const eksik = say((k) => k.veriKalitesi === "eksik");
  return gecikmeIle({
    toplam,
    toplamAralik: `${yillar[0]} – ${yillar[yillar.length - 1]}`,
    onaylanan,
    onaylananOran: oran(onaylanan),
    kontrolBekleyen: kontrol,
    kontrolOran: oran(kontrol),
    taslak,
    taslakOran: oran(taslak),
    eksik,
    eksikOran: oran(eksik),
  });
}

export function yillikOzetGetir(): Promise<YillikOzetSatir[]> {
  return gecikmeIle([
    // Tüketim / üretim (birim bazında)
    { kaynak: "Elektrik", birim: "kWh", grup: "tuketim", degerler: { "2023": 8373000, "2024": 8664000, "2025": 8024000, "2026": 5955000 } },
    { kaynak: "GES Üretimi", birim: "kWh", grup: "tuketim", degerler: { "2023": 2810000, "2024": 3120000, "2025": 3405000, "2026": 2530000 } },
    { kaynak: "Doğalgaz", birim: "Sm³", grup: "tuketim", degerler: { "2023": 452000, "2024": 445000, "2025": 430000, "2026": 322000 } },
    { kaynak: "Akaryakıt", birim: "Litre", grup: "tuketim", degerler: { "2023": 19500, "2024": 18200, "2025": 17100, "2026": 12800 } },
    // Enerji (TEP)
    { kaynak: "Elektrik", birim: "TEP", grup: "tep", degerler: { "2023": 720, "2024": 745, "2025": 690, "2026": 512 } },
    { kaynak: "Doğalgaz", birim: "TEP", grup: "tep", degerler: { "2023": 480, "2024": 470, "2025": 455, "2026": 342 } },
    { kaynak: "Akaryakıt", birim: "TEP", grup: "tep", degerler: { "2023": 18, "2024": 17, "2025": 16, "2026": 12 } },
    { kaynak: "Toplam", birim: "TEP", grup: "tep", degerler: { "2023": 1218, "2024": 1232, "2025": 1161, "2026": 866 }, vurgu: true },
  ]);
}
