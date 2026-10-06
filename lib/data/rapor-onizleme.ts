// -----------------------------------------------------------------------------
// VERİ KATMANI — Rapor Önizleme (Supabase: enerji_kayitlari + katsayilar)
// Kategoriye göre vurgulanan metrik değişir; sayılar gerçek veriden hesaplanır.
// -----------------------------------------------------------------------------

import type { OnizlemeDilim, OnizlemeKpi, OnizlemeSeri, RaporKategoriAnahtar, RaporOnizleme } from "@/lib/types";
import { supabaseTarayici } from "@/lib/supabase/client";

const FT_ELK = 0.086 / 1000;
const FT_DG = 0.825 / 1000;
const FT_AKR = 1.02 * 0.00085;
const AY_KISA = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const RENK = { elektrik: "#2563eb", dogalgaz: "#8b5cf6", akaryakit: "#f59e0b" };

const trTam = (x: number) => Math.round(x).toLocaleString("tr-TR");
const trOnd = (x: number, d: number) => x.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });
const sayiAyikla = (s: string | null) => {
  const n = Number(String(s ?? "").replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isNaN(n) ? 0 : n;
};

type Satir = {
  yil: number; ay: number;
  sebeke_elektrik: number | null; ges_oz_tuketim: number | null;
  dogalgaz: number | null; motorin: number | null; benzin: number | null; diger_akaryakit: number | null;
  uretim_ton: number | null;
};
const n = (v: number | null | undefined) => v ?? 0;

type Metrik = { elektrikTep: number; dogalgazTep: number; akaryakitTep: number; toplamTep: number; uretimTon: number; maliyet: number; elektrikKwh: number; dogalgazSm3: number; akaryakitL: number };

function metrik(rows: Satir[], pElk: number, pDg: number, pMot: number): Metrik {
  const t = rows.reduce(
    (a, s) => {
      const elektrikKwh = n(s.sebeke_elektrik) + n(s.ges_oz_tuketim);
      const akaryakitL = n(s.motorin) + n(s.benzin) + n(s.diger_akaryakit);
      return {
        elektrikKwh: a.elektrikKwh + elektrikKwh,
        dogalgazSm3: a.dogalgazSm3 + n(s.dogalgaz),
        akaryakitL: a.akaryakitL + akaryakitL,
        uretimTon: a.uretimTon + n(s.uretim_ton),
      };
    },
    { elektrikKwh: 0, dogalgazSm3: 0, akaryakitL: 0, uretimTon: 0 },
  );
  const elektrikTep = t.elektrikKwh * FT_ELK;
  const dogalgazTep = t.dogalgazSm3 * FT_DG;
  const akaryakitTep = t.akaryakitL * FT_AKR;
  return {
    ...t, elektrikTep, dogalgazTep, akaryakitTep,
    toplamTep: elektrikTep + dogalgazTep + akaryakitTep,
    maliyet: t.elektrikKwh * pElk + t.dogalgazSm3 * pDg + t.akaryakitL * pMot,
  };
}

type Tip = "tep" | "maliyet" | "yogunluk";
const KATEGORI_CONF: Record<RaporKategoriAnahtar, { konu: string; metrikAd: string; birim: string; tip: Tip }> = {
  tuketim: { konu: "enerji tüketimi", metrikAd: "Aylık Toplam Enerji", birim: "TEP", tip: "tep" },
  performans: { konu: "enerji performansı", metrikAd: "Enerji Yoğunluğu", birim: "TEP/ton", tip: "yogunluk" },
  maliyet: { konu: "enerji maliyeti", metrikAd: "Aylık Enerji Maliyeti", birim: "M TL", tip: "maliyet" },
  tep: { konu: "TEP dönüşümü", metrikAd: "Aylık Toplam TEP", birim: "TEP", tip: "tep" },
  karsilastirma: { konu: "dönemsel karşılaştırma", metrikAd: "Aylık Toplam Enerji", birim: "TEP", tip: "tep" },
  ozel: { konu: "enerji özeti", metrikAd: "Aylık Toplam Enerji", birim: "TEP", tip: "tep" },
};

function bosOnizleme(konf: { konu: string; metrikAd: string; birim: string }): RaporOnizleme {
  return {
    ozet: "Bu dönem için yeterli veri bulunmuyor.",
    metrikAd: konf.metrikAd, birim: konf.birim, kpiler: [], seri: [],
    dagilimBaslik: "Kaynak Dağılımı", dagilim: [], tabloBaslik: "Aylık Detay",
    tabloKolonlar: ["Ay", "Bu Dönem", "Önceki Dönem", "Değişim"], tabloSatirlar: [], degerlendirme: [],
  };
}

export async function raporOnizlemeGetir(kategori: RaporKategoriAnahtar): Promise<RaporOnizleme> {
  const konf = KATEGORI_CONF[kategori] ?? KATEGORI_CONF.ozel;
  const supabase = supabaseTarayici();
  const [{ data: kayitData }, { data: katData }] = await Promise.all([
    supabase.from("enerji_kayitlari").select("yil, ay, sebeke_elektrik, ges_oz_tuketim, dogalgaz, motorin, benzin, diger_akaryakit, uretim_ton").is("deleted_at", null),
    supabase.from("katsayilar").select("id, fiyat").is("deleted_at", null),
  ]);
  const rows = (kayitData ?? []) as Satir[];
  const fiyat = (id: string) => sayiAyikla((katData ?? []).find((k: { id: string; fiyat: string | null }) => k.id === id)?.fiyat ?? null);
  const pElk = fiyat("fy-elk") || 2.45;
  const pDg = fiyat("fy-dg") || 6.8;
  const pMot = fiyat("fy-mot") || 44.5;

  const yillar = [...new Set(rows.map((r) => r.yil))].sort((a, b) => a - b);
  if (!yillar.length) return bosOnizleme(konf);
  const buYil = yillar[yillar.length - 1];
  const oncekiYil = yillar.includes(buYil - 1) ? buYil - 1 : null;

  const buRows = rows.filter((r) => r.yil === buYil);
  const oncekiRows = oncekiYil ? rows.filter((r) => r.yil === oncekiYil) : [];
  const bu = metrik(buRows, pElk, pDg, pMot);
  const onceki = oncekiRows.length ? metrik(oncekiRows, pElk, pDg, pMot) : null;

  const buYogunluk = bu.uretimTon > 0 ? bu.toplamTep / bu.uretimTon : 0;
  const oncekiYogunluk = onceki && onceki.uretimTon > 0 ? onceki.toplamTep / onceki.uretimTon : 0;
  const degisim = (yeni: number, eski: number) => (eski ? Math.round(((yeni - eski) / eski) * 1000) / 10 : 0);

  // KPI'lar (ortak)
  const kpiler: OnizlemeKpi[] = [
    { baslik: "Toplam Enerji", deger: trTam(bu.toplamTep), birim: "TEP", degisim: degisim(bu.toplamTep, onceki?.toplamTep ?? 0), iyiYon: "azalis" },
    { baslik: "Toplam Üretim", deger: trTam(bu.uretimTon), birim: "ton", degisim: degisim(bu.uretimTon, onceki?.uretimTon ?? 0), iyiYon: "artis" },
    { baslik: "Enerji Yoğunluğu", deger: trOnd(buYogunluk, 3), birim: "TEP/ton", degisim: degisim(buYogunluk, oncekiYogunluk), iyiYon: "azalis" },
    { baslik: "Enerji Maliyeti", deger: trOnd(bu.maliyet / 1e6, 1), birim: "M TL", degisim: degisim(bu.maliyet, onceki?.maliyet ?? 0), iyiYon: "azalis" },
  ];

  // Aylık seri (metrik tipine göre)
  const ayDeger = (rs: Satir[]): number => {
    const m = metrik(rs, pElk, pDg, pMot);
    if (konf.tip === "maliyet") return Math.round((m.maliyet / 1e6) * 100) / 100;
    if (konf.tip === "yogunluk") return m.uretimTon > 0 ? Math.round((m.toplamTep / m.uretimTon) * 1000) / 1000 : 0;
    return Math.round(m.toplamTep);
  };
  const seri: OnizlemeSeri[] = [];
  const tabloSatirlar: string[][] = [];
  for (let ay = 1; ay <= 12; ay++) {
    const buAyRows = buRows.filter((r) => r.ay === ay);
    if (!buAyRows.length) continue;
    const buD = ayDeger(buAyRows);
    const oncekiAyRows = oncekiRows.filter((r) => r.ay === ay);
    const oncekiD = oncekiAyRows.length ? ayDeger(oncekiAyRows) : 0;
    seri.push({ etiket: AY_KISA[ay - 1], buDonem: buD, oncekiDonem: oncekiD });
    const d = degisim(buD, oncekiD);
    const dMetin = oncekiD ? `${d > 0 ? "+" : ""}%${trOnd(d, 1)}` : "—";
    const bicim = konf.tip === "yogunluk" ? (v: number) => trOnd(v, 3) : konf.tip === "maliyet" ? (v: number) => trOnd(v, 2) : (v: number) => trTam(v);
    tabloSatirlar.push([AY_KISA[ay - 1], bicim(buD), oncekiD ? bicim(oncekiD) : "—", dMetin]);
  }

  // Dağılım (maliyet kategorisinde maliyet, diğerlerinde TEP)
  const dagilim: OnizlemeDilim[] =
    konf.tip === "maliyet"
      ? [
          { etiket: "Elektrik", deger: Math.round((bu.elektrikKwh * pElk) / 1e6 * 100) / 100, renk: RENK.elektrik },
          { etiket: "Doğalgaz", deger: Math.round((bu.dogalgazSm3 * pDg) / 1e6 * 100) / 100, renk: RENK.dogalgaz },
          { etiket: "Akaryakıt", deger: Math.round((bu.akaryakitL * pMot) / 1e6 * 100) / 100, renk: RENK.akaryakit },
        ]
      : [
          { etiket: "Elektrik", deger: Math.round(bu.elektrikTep), renk: RENK.elektrik },
          { etiket: "Doğalgaz", deger: Math.round(bu.dogalgazTep), renk: RENK.dogalgaz },
          { etiket: "Akaryakıt", deger: Math.round(bu.akaryakitTep), renk: RENK.akaryakit },
        ];

  // Değerlendirme
  const dTuketim = degisim(bu.toplamTep, onceki?.toplamTep ?? 0);
  const dYogunluk = degisim(buYogunluk, oncekiYogunluk);
  const dMaliyet = degisim(bu.maliyet, onceki?.maliyet ?? 0);
  const degerlendirme: string[] = [];
  if (onceki) {
    degerlendirme.push(`${buYil} yılında toplam enerji tüketimi geçen yıla göre %${trOnd(Math.abs(dTuketim), 1)} ${dTuketim <= 0 ? "azaldı" : "arttı"}.`);
    degerlendirme.push(`Enerji yoğunluğu %${trOnd(Math.abs(dYogunluk), 1)} ${dYogunluk <= 0 ? "iyileşti" : "arttı"} (${trOnd(buYogunluk, 3)} TEP/ton).`);
    degerlendirme.push(`Enerji maliyeti %${trOnd(Math.abs(dMaliyet), 1)} ${dMaliyet <= 0 ? "düştü" : "arttı"} (${trOnd(bu.maliyet / 1e6, 1)} M TL).`);
  } else {
    degerlendirme.push(`${buYil} yılı için toplam ${trTam(bu.toplamTep)} TEP enerji tüketimi kaydedildi.`);
    degerlendirme.push(`Enerji yoğunluğu ${trOnd(buYogunluk, 3)} TEP/ton olarak gerçekleşti.`);
  }

  const tabloKolonlar = [
    "Ay",
    `${buYil} (${konf.birim})`,
    oncekiYil ? `${oncekiYil} (${konf.birim})` : `Önceki (${konf.birim})`,
    "Değişim",
  ];

  return {
    ozet: `${buYil} dönemi ${konf.konu} raporu. ${degerlendirme[0] ?? ""}`,
    metrikAd: konf.metrikAd,
    birim: konf.birim,
    kpiler,
    seri,
    dagilimBaslik: konf.tip === "maliyet" ? "Maliyet Dağılımı (M TL)" : "Kaynak Dağılımı (TEP)",
    dagilim,
    tabloBaslik: `${buYil} Aylık Detay`,
    tabloKolonlar,
    tabloSatirlar,
    degerlendirme,
  };
}
