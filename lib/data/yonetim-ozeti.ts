// -----------------------------------------------------------------------------
// VERİ KATMANI — Yönetim Özeti (Supabase: enerji_kayitlari + katsayilar)
// -----------------------------------------------------------------------------
// KPI'lar, tüketim/üretim, TEP & maliyet dağılımı, performans trendi ve öne
// çıkanlar gerçek veriden hesaplanır. Projeler/Raporlar/Sistem bölümleri henüz
// kendi domenleri kurulmadığı için yer tutucudur.

import type {
  OzetKpi,
  OzetProje,
  OzetRapor,
  OzetSistemDurum,
  PerformansTrendNoktasi,
  TuketimUretimNoktasi,
  YonetimOzetiAnaliz,
  OzetKaynakDilim,
  OzetOneCikan,
} from "@/lib/types";
import { supabaseTarayici } from "@/lib/supabase/client";

// TEP dönüşüm katsayıları (kayitlar.ts ile aynı)
const FT_ELK = 0.086 / 1000; // TEP/kWh
const FT_DG = 0.825 / 1000; // TEP/Sm³
const FT_AKR = 1.02 * 0.00085; // TEP/L

// Emisyon faktörleri (kgCO₂e / birim)
const EM_ELK = 442 / 1000; // kgCO₂e/kWh
const EM_DG = 1923 / 1000; // kgCO₂e/Sm³
const EM_AKR = 3170 * 0.00085; // kgCO₂e/L

const AY_KISA = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const RENK = { elektrik: "#2563eb", dogalgaz: "#8b5cf6", akaryakit: "#f59e0b", diger: "#94a3b8" };

const trTam = (n: number) => Math.round(n).toLocaleString("tr-TR");
const trOnd = (n: number, d: number) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });

function sayiAyikla(s: string | null): number {
  if (!s) return 0;
  const temiz = s.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(temiz);
  return Number.isNaN(n) ? 0 : n;
}

type Satir = {
  yil: number;
  ay: number;
  sebeke_elektrik: number | null;
  ges_toplam_uretim: number | null;
  ges_oz_tuketim: number | null;
  dogalgaz: number | null;
  motorin: number | null;
  benzin: number | null;
  diger_akaryakit: number | null;
  uretim_ton: number | null;
};

type AyMetrik = {
  ay: number;
  elektrikKwh: number;
  dogalgazSm3: number;
  motorinL: number;
  benzinL: number;
  digerL: number;
  uretimTon: number;
  elektrikTep: number;
  dogalgazTep: number;
  akaryakitTep: number;
  toplamTep: number;
  karbonKg: number;
};

function ayMetrik(s: Satir): AyMetrik {
  const n = (v: number | null) => v ?? 0;
  const elektrikKwh = n(s.sebeke_elektrik) + n(s.ges_oz_tuketim);
  const dogalgazSm3 = n(s.dogalgaz);
  const motorinL = n(s.motorin);
  const benzinL = n(s.benzin);
  const digerL = n(s.diger_akaryakit);
  const akaryakitL = motorinL + benzinL + digerL;
  const elektrikTep = elektrikKwh * FT_ELK;
  const dogalgazTep = dogalgazSm3 * FT_DG;
  const akaryakitTep = akaryakitL * FT_AKR;
  return {
    ay: s.ay,
    elektrikKwh,
    dogalgazSm3,
    motorinL,
    benzinL,
    digerL,
    uretimTon: n(s.uretim_ton),
    elektrikTep,
    dogalgazTep,
    akaryakitTep,
    toplamTep: elektrikTep + dogalgazTep + akaryakitTep,
    karbonKg: elektrikKwh * EM_ELK + dogalgazSm3 * EM_DG + akaryakitL * EM_AKR,
  };
}

type YilToplam = {
  elektrikKwh: number;
  dogalgazSm3: number;
  akaryakitL: number;
  motorinL: number;
  benzinL: number;
  digerL: number;
  uretimTon: number;
  elektrikTep: number;
  dogalgazTep: number;
  akaryakitTep: number;
  toplamTep: number;
  karbonKg: number;
  yogunluk: number;
};

function yilTopla(aylar: AyMetrik[]): YilToplam {
  const t = aylar.reduce(
    (a, m) => ({
      elektrikKwh: a.elektrikKwh + m.elektrikKwh,
      dogalgazSm3: a.dogalgazSm3 + m.dogalgazSm3,
      motorinL: a.motorinL + m.motorinL,
      benzinL: a.benzinL + m.benzinL,
      digerL: a.digerL + m.digerL,
      uretimTon: a.uretimTon + m.uretimTon,
      elektrikTep: a.elektrikTep + m.elektrikTep,
      dogalgazTep: a.dogalgazTep + m.dogalgazTep,
      akaryakitTep: a.akaryakitTep + m.akaryakitTep,
      toplamTep: a.toplamTep + m.toplamTep,
      karbonKg: a.karbonKg + m.karbonKg,
    }),
    {
      elektrikKwh: 0, dogalgazSm3: 0, motorinL: 0, benzinL: 0, digerL: 0, uretimTon: 0,
      elektrikTep: 0, dogalgazTep: 0, akaryakitTep: 0, toplamTep: 0, karbonKg: 0,
    },
  );
  return {
    ...t,
    akaryakitL: t.motorinL + t.benzinL + t.digerL,
    yogunluk: t.uretimTon > 0 ? t.toplamTep / t.uretimTon : 0,
  };
}

// Yer tutucu bölümler (Projeler / Raporlar / Sistem henüz ayrı domen)
const PROJELER: OzetProje[] = [];
const RAPORLAR: OzetRapor[] = [];
const SISTEM: OzetSistemDurum[] = [
  { alan: "Veri Girişi", durum: "Güncel", iyi: true },
  { alan: "Enerji Kayıtları", durum: "Sorun Yok", iyi: true },
  { alan: "Hesaplamalar", durum: "Sorun Yok", iyi: true },
  { alan: "Raporlama", durum: "Aktif", iyi: true },
  { alan: "Sistem Entegrasyonları", durum: "Aktif", iyi: true },
];

export async function yonetimOzetiGetir(): Promise<YonetimOzetiAnaliz> {
  const supabase = supabaseTarayici();
  const [{ data: kayitData, error }, { data: katsayiData }] = await Promise.all([
    supabase
      .from("enerji_kayitlari")
      .select(
        "yil, ay, sebeke_elektrik, ges_toplam_uretim, ges_oz_tuketim, dogalgaz, motorin, benzin, diger_akaryakit, uretim_ton",
      )
      .is("deleted_at", null),
    supabase.from("katsayilar").select("id, grup, fiyat, deger").is("deleted_at", null),
  ]);
  if (error) throw new Error(error.message);

  const satirlar = (kayitData ?? []) as Satir[];

  // Fiyat ve hedef katsayıları
  const kats = (katsayiData ?? []) as { id: string; grup: string; fiyat: string | null; deger: string | null }[];
  const fiyat = (id: string) => sayiAyikla(kats.find((k) => k.id === id)?.fiyat ?? null);
  const pElk = fiyat("fy-elk") || 2.45;
  const pDg = fiyat("fy-dg") || 6.8;
  const pMot = fiyat("fy-mot") || 44.5;
  const hedefPct = sayiAyikla(kats.find((k) => k.id === "gp-hedef")?.deger ?? null) || 10;
  const bazYilDeger = sayiAyikla(kats.find((k) => k.id === "gp-baz")?.deger ?? null);

  // Yıl bazında grupla
  const yilHarita = new Map<number, AyMetrik[]>();
  for (const s of satirlar) {
    const dizi = yilHarita.get(s.yil) ?? [];
    dizi.push(ayMetrik(s));
    yilHarita.set(s.yil, dizi);
  }
  const yillar = [...yilHarita.keys()].sort((a, b) => a - b);

  const bosDonut = { merkez: "0", birim: "TEP", dilimler: [] as OzetKaynakDilim[] };
  if (yillar.length === 0) {
    return {
      kpiler: [], tuketimUretim: [], kaynakTep: bosDonut,
      maliyetDagilim: { ...bosDonut, birim: "M TL" },
      performansTrend: [], hedef: { yuzde: 0, hedefIyilesme: `%${hedefPct}`, gerceklesen: "%0", hedefeKalan: "—" },
      oneCikan: [], projeler: PROJELER, raporlar: RAPORLAR, sistem: SISTEM,
    };
  }

  const buYil = yillar[yillar.length - 1];
  const gecenYil = yillar.includes(buYil - 1) ? buYil - 1 : null;
  const bazYil = yillar.includes(bazYilDeger) ? bazYilDeger : yillar[0];

  const buAylar = yilHarita.get(buYil)!.sort((a, b) => a.ay - b.ay);
  const bu = yilTopla(buAylar);
  const gecen = gecenYil ? yilTopla(yilHarita.get(gecenYil)!) : null;
  const baz = yilTopla(yilHarita.get(bazYil)!);

  const maliyet = (t: YilToplam) => t.elektrikKwh * pElk + t.dogalgazSm3 * pDg + t.akaryakitL * pMot;
  const buMaliyet = maliyet(bu);
  const gecenMaliyet = gecen ? maliyet(gecen) : null;

  const degisim = (yeni: number, eski: number | null | undefined) =>
    eski && eski !== 0 ? Math.round(((yeni - eski) / eski) * 1000) / 10 : undefined;

  // Hedef: baz yıla göre yoğunluk iyileşmesi
  const iyilesme = baz.yogunluk > 0 ? ((baz.yogunluk - bu.yogunluk) / baz.yogunluk) * 100 : 0;
  const hedefUyum = hedefPct > 0 ? Math.max(0, Math.min(100, Math.round((iyilesme / hedefPct) * 100))) : 0;
  const hedefYogunluk = baz.yogunluk * (1 - hedefPct / 100);
  const tasarrufTep = Math.max(0, (baz.yogunluk - bu.yogunluk) * bu.uretimTon);

  const kpiler: OzetKpi[] = [
    { anahtar: "tuketim", baslik: "Toplam Enerji Tüketimi", deger: trTam(bu.toplamTep), birim: "TEP", degisim: degisim(bu.toplamTep, gecen?.toplamTep), iyiYon: "azalis", altMetin: "geçen yıla göre" },
    { anahtar: "uretim", baslik: "Toplam Üretim", deger: trTam(bu.uretimTon), birim: "ton", degisim: degisim(bu.uretimTon, gecen?.uretimTon), iyiYon: "artis", altMetin: "geçen yıla göre" },
    { anahtar: "yogunluk", baslik: "Enerji Yoğunluğu", deger: trOnd(bu.yogunluk, 3), birim: "TEP/ton", degisim: degisim(bu.yogunluk, gecen?.yogunluk), iyiYon: "azalis", altMetin: "geçen yıla göre" },
    { anahtar: "hedef", baslik: "Hedefe Uyum", deger: `%${hedefUyum}`, altMetin: `Hedef: %${hedefPct} iyileşme`, ilerleme: hedefUyum },
    { anahtar: "tasarruf", baslik: "Gerçekleşen Tasarruf", deger: trOnd(tasarrufTep, 1), birim: "TEP", altMetin: "baz yıla göre" },
    { anahtar: "maliyet", baslik: "Toplam Enerji Maliyeti", deger: trOnd(buMaliyet / 1e6, 1), birim: "M TL", degisim: degisim(buMaliyet, gecenMaliyet), iyiYon: "azalis", altMetin: "geçen yıla göre" },
  ];

  const tuketimUretim: TuketimUretimNoktasi[] = buAylar.map((m) => ({
    ay: AY_KISA[m.ay - 1],
    tuketim: Math.round(m.toplamTep),
    uretim: Math.round(m.uretimTon),
  }));

  const dilimler = (deger: Record<string, number>, toplam: number): OzetKaynakDilim[] => [
    { anahtar: "elektrik", etiket: "Elektrik", deger: Math.round(deger.elektrik), yuzde: toplam ? Math.round((deger.elektrik / toplam) * 1000) / 10 : 0, renk: RENK.elektrik },
    { anahtar: "dogalgaz", etiket: "Doğalgaz", deger: Math.round(deger.dogalgaz), yuzde: toplam ? Math.round((deger.dogalgaz / toplam) * 1000) / 10 : 0, renk: RENK.dogalgaz },
    { anahtar: "akaryakit", etiket: "Akaryakıt", deger: Math.round(deger.akaryakit), yuzde: toplam ? Math.round((deger.akaryakit / toplam) * 1000) / 10 : 0, renk: RENK.akaryakit },
  ];

  const kaynakTep = {
    merkez: trTam(bu.toplamTep),
    birim: "TEP",
    dilimler: dilimler({ elektrik: bu.elektrikTep, dogalgaz: bu.dogalgazTep, akaryakit: bu.akaryakitTep }, bu.toplamTep),
  };

  const mElk = bu.elektrikKwh * pElk;
  const mDg = bu.dogalgazSm3 * pDg;
  const mAkr = bu.akaryakitL * pMot;
  const maliyetDagilim = {
    merkez: trOnd(buMaliyet / 1e6, 1),
    birim: "M TL",
    dilimler: dilimler({ elektrik: mElk / 1e6, dogalgaz: mDg / 1e6, akaryakit: mAkr / 1e6 }, buMaliyet / 1e6),
  };

  const performansTrend: PerformansTrendNoktasi[] = buAylar.map((m) => ({
    ay: AY_KISA[m.ay - 1],
    gerceklesen: m.uretimTon > 0 ? Math.round((m.toplamTep / m.uretimTon) * 1000) / 1000 : 0,
    hedef: Math.round(hedefYogunluk * 1000) / 1000,
    bazYil: Math.round(baz.yogunluk * 1000) / 1000,
  }));

  const hedef = {
    yuzde: hedefUyum,
    hedefIyilesme: `%${hedefPct}`,
    gerceklesen: `%${trOnd(Math.max(0, iyilesme), 1)}`,
    hedefeKalan: `${trOnd(Math.max(0, bu.yogunluk - hedefYogunluk), 3)} TEP/ton`,
  };

  // Öne çıkanlar
  const oneCikan: OzetOneCikan[] = [];
  const dUretim = degisim(bu.uretimTon, gecen?.uretimTon);
  const dTuketim = degisim(bu.toplamTep, gecen?.toplamTep);
  const dKarbon = degisim(bu.karbonKg, gecen?.karbonKg);
  if (dUretim !== undefined) {
    oneCikan.push({ anahtar: "uretim", ikon: "solar:chart-2-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", baslik: `Üretim %${trOnd(Math.abs(dUretim), 1)} ${dUretim >= 0 ? "arttı" : "azaldı"}.`, aciklama: "Geçen yılın aynı dönemine göre." });
  }
  if (dTuketim !== undefined) {
    oneCikan.push({ anahtar: "tuketim", ikon: "solar:bolt-bold-duotone", sinif: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300", baslik: `Enerji tüketimi %${trOnd(Math.abs(dTuketim), 1)} ${dTuketim <= 0 ? "azaldı" : "arttı"}.`, aciklama: "Geçen yıla göre toplam TEP değişimi." });
  }
  if (dKarbon !== undefined && gecen) {
    const farkTon = Math.abs(bu.karbonKg - gecen.karbonKg) / 1000;
    oneCikan.push({ anahtar: "karbon", ikon: "solar:leaf-bold-duotone", sinif: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300", baslik: `Karbon emisyonu %${trOnd(Math.abs(dKarbon), 1)} ${dKarbon <= 0 ? "azaldı" : "arttı"}.`, aciklama: `Geçen yıla göre ${trTam(farkTon)} ton CO₂e fark.` });
  }

  return {
    kpiler,
    tuketimUretim,
    kaynakTep,
    maliyetDagilim,
    performansTrend,
    hedef,
    oneCikan,
    projeler: PROJELER,
    raporlar: RAPORLAR,
    sistem: SISTEM,
  };
}
