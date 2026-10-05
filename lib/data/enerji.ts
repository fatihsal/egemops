// -----------------------------------------------------------------------------
// VERİ KATMANI — Enerji yönetimi / Dashboard
// -----------------------------------------------------------------------------
// Ana paneldeki (render edilen) fonksiyonlar gerçek enerji_kayitlari verisinden
// hesaplanır. Panelde gösterilmeyen (günlük granülerlikteki) 5 fonksiyon mock
// kalır; sadece eski bileşenlerin derlenmesi için durur.
// -----------------------------------------------------------------------------

import { eachDayOfInterval, format } from "date-fns";
import { tr } from "date-fns/locale";

import type {
  AylikMaliyet,
  EnerjiFirsat,
  EnerjiHedef,
  EnerjiKaynak,
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
import { gecikmeIle } from "@/lib/data/mock-utils";
import { donemGunSayisi, BUGUN, type Donem } from "@/lib/donem";
import { supabaseTarayici } from "@/lib/supabase/client";

const FT_ELK = 0.086 / 1000; // TEP/kWh
const FT_DG = 0.825 / 1000; // TEP/Sm³
const FT_AKR = 1.02 * 0.00085; // TEP/L
const GWH_PER_TEP = 0.01163; // 1 TEP ≈ 11,63 MWh

const AY_TAM = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const AY_KISA = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

type Satir = {
  yil: number;
  ay: number;
  sebeke_elektrik: number | null;
  ges_toplam_uretim: number | null;
  ges_oz_tuketim: number | null;
  sebekeye_verilen: number | null;
  dogalgaz: number | null;
  motorin: number | null;
  benzin: number | null;
  diger_akaryakit: number | null;
  uretim_ton: number | null;
  updated_at: string;
};

const n = (v: number | null | undefined) => v ?? 0;

async function satirlar(): Promise<Satir[]> {
  const { data } = await supabaseTarayici()
    .from("enerji_kayitlari")
    .select("yil, ay, sebeke_elektrik, ges_toplam_uretim, ges_oz_tuketim, sebekeye_verilen, dogalgaz, motorin, benzin, diger_akaryakit, uretim_ton, updated_at")
    .is("deleted_at", null);
  return (data ?? []) as Satir[];
}

type YilT = {
  elektrikKwh: number; gesUretimKwh: number; gesOzKwh: number; sebekeyeVerilenKwh: number;
  dogalgazSm3: number; akaryakitL: number; uretimTon: number;
  elektrikTep: number; dogalgazTep: number; akaryakitTep: number; toplamTep: number; yogunluk: number;
};

function topla(rows: Satir[]): YilT {
  const t = rows.reduce(
    (a, s) => {
      const elektrikKwh = n(s.sebeke_elektrik) + n(s.ges_oz_tuketim);
      const akaryakitL = n(s.motorin) + n(s.benzin) + n(s.diger_akaryakit);
      return {
        elektrikKwh: a.elektrikKwh + elektrikKwh,
        gesUretimKwh: a.gesUretimKwh + n(s.ges_toplam_uretim),
        gesOzKwh: a.gesOzKwh + n(s.ges_oz_tuketim),
        sebekeyeVerilenKwh: a.sebekeyeVerilenKwh + n(s.sebekeye_verilen),
        dogalgazSm3: a.dogalgazSm3 + n(s.dogalgaz),
        akaryakitL: a.akaryakitL + akaryakitL,
        uretimTon: a.uretimTon + n(s.uretim_ton),
      };
    },
    { elektrikKwh: 0, gesUretimKwh: 0, gesOzKwh: 0, sebekeyeVerilenKwh: 0, dogalgazSm3: 0, akaryakitL: 0, uretimTon: 0 },
  );
  const elektrikTep = t.elektrikKwh * FT_ELK;
  const dogalgazTep = t.dogalgazSm3 * FT_DG;
  const akaryakitTep = t.akaryakitL * FT_AKR;
  const toplamTep = elektrikTep + dogalgazTep + akaryakitTep;
  return { ...t, elektrikTep, dogalgazTep, akaryakitTep, toplamTep, yogunluk: t.uretimTon > 0 ? toplamTep / t.uretimTon : 0 };
}

function yilGrupla(rows: Satir[]) {
  const harita = new Map<number, Satir[]>();
  for (const s of rows) harita.set(s.yil, [...(harita.get(s.yil) ?? []), s]);
  const yillar = [...harita.keys()].sort((a, b) => a - b);
  return { harita, yillar };
}

const degisim = (yeni: number, eski: number | undefined) =>
  eski && eski !== 0 ? Math.round(((yeni - eski) / eski) * 1000) / 10 : 0;
const yuvarla = (x: number, d = 2) => Math.round(x * 10 ** d) / 10 ** d;

// ===========================================================================
// RENDER EDİLEN (gerçek veri)
// ===========================================================================

export async function enerjiKpiGetir(): Promise<EnerjiKpi[]> {
  const rows = await satirlar();
  const { harita, yillar } = yilGrupla(rows);
  if (!yillar.length) return [];
  const buYil = yillar[yillar.length - 1];
  const bu = topla(harita.get(buYil)!);
  const gecen = yillar.includes(buYil - 1) ? topla(harita.get(buYil - 1)!) : undefined;

  const gesKatki = bu.elektrikKwh > 0 ? (bu.gesOzKwh / bu.elektrikKwh) * 100 : 0;
  const gecenGesKatki = gecen && gecen.elektrikKwh > 0 ? (gecen.gesOzKwh / gecen.elektrikKwh) * 100 : undefined;

  return [
    { anahtar: "toplamEnerji", baslik: "Toplam Enerji", deger: yuvarla(bu.toplamTep, 1), birim: "TEP", degisimYuzde: degisim(bu.toplamTep, gecen?.toplamTep) },
    { anahtar: "elektrik", baslik: "Toplam Elektrik", deger: yuvarla(bu.elektrikKwh / 1e6, 2), birim: "GWh", degisimYuzde: degisim(bu.elektrikKwh, gecen?.elektrikKwh) },
    { anahtar: "ges", baslik: "GES Üretimi", deger: yuvarla(bu.gesUretimKwh / 1e6, 2), birim: "GWh", degisimYuzde: degisim(bu.gesUretimKwh, gecen?.gesUretimKwh) },
    { anahtar: "dogalgaz", baslik: "Doğalgaz", deger: Math.round(bu.dogalgazSm3), birim: "Sm³", degisimYuzde: degisim(bu.dogalgazSm3, gecen?.dogalgazSm3) },
    { anahtar: "akaryakit", baslik: "Akaryakıt", deger: Math.round(bu.akaryakitL), birim: "L", degisimYuzde: degisim(bu.akaryakitL, gecen?.akaryakitL) },
    { anahtar: "gesKatki", baslik: "GES Katkısı", deger: yuvarla(gesKatki, 0), birim: "%", degisimYuzde: gecenGesKatki !== undefined ? yuvarla(gesKatki - gecenGesKatki, 1) : 0, degisimBirim: "puan" },
  ];
}

export async function yillikTepGetir(): Promise<YillikTepNoktasi[]> {
  const rows = await satirlar();
  const { yillar } = yilGrupla(rows);
  if (!yillar.length) return [];
  const buYil = yillar[yillar.length - 1];
  const aylikTep = (yil: number, ay: number): number | null => {
    const s = rows.find((r) => r.yil === yil && r.ay === ay);
    if (!s) return null;
    return yuvarla(topla([s]).toplamTep, 1);
  };
  return AY_KISA.map((ay, i) => ({
    ay,
    onceki2: aylikTep(buYil - 2, i + 1) ?? 0,
    onceki1: aylikTep(buYil - 1, i + 1) ?? 0,
    buYil: aylikTep(buYil, i + 1),
  }));
}

export async function sebekeGesGetir(): Promise<SebekeGesNoktasi[]> {
  const rows = await satirlar();
  const { harita, yillar } = yilGrupla(rows);
  if (!yillar.length) return [];
  const buYil = yillar[yillar.length - 1];
  return harita
    .get(buYil)!
    .sort((a, b) => a.ay - b.ay)
    .map((s) => ({ ay: AY_TAM[s.ay - 1], sebeke: Math.round(n(s.sebeke_elektrik)), ges: Math.round(n(s.ges_toplam_uretim)) }));
}

export async function enerjiKaynakDagilimiGetir(): Promise<EnerjiKaynakDagilim> {
  const rows = await satirlar();
  const { harita, yillar } = yilGrupla(rows);
  if (!yillar.length) return { kaynaklar: [], toplamTep: 0 };
  const bu = topla(harita.get(yillar[yillar.length - 1])!);
  const dilim = (tur: EnerjiKaynak["tur"], etiket: string, tep: number): EnerjiKaynak => ({
    tur, etiket, gwh: yuvarla(tep * GWH_PER_TEP, 2), yuzde: bu.toplamTep > 0 ? Math.round((tep / bu.toplamTep) * 100) : 0,
  });
  return {
    kaynaklar: [
      dilim("elektrik", "Elektrik", bu.elektrikTep),
      dilim("dogalgaz", "Doğalgaz", bu.dogalgazTep),
      dilim("akaryakit", "Akaryakıt", bu.akaryakitTep),
    ],
    toplamTep: yuvarla(bu.toplamTep, 1),
  };
}

export async function gesPerformansGetir(): Promise<GesPerformans> {
  const rows = await satirlar();
  const { harita, yillar } = yilGrupla(rows);
  if (!yillar.length) return { yillikUretim: 0, ozTuketim: 0, sebekeyeVerilen: 0, karsilamaOrani: 0, karsilamaDegisim: 0, tahminiTasarruf: 0 };
  const buYil = yillar[yillar.length - 1];
  const bu = topla(harita.get(buYil)!);
  const gecen = yillar.includes(buYil - 1) ? topla(harita.get(buYil - 1)!) : undefined;
  const oran = bu.elektrikKwh > 0 ? (bu.gesOzKwh / bu.elektrikKwh) * 100 : 0;
  const gecenOran = gecen && gecen.elektrikKwh > 0 ? (gecen.gesOzKwh / gecen.elektrikKwh) * 100 : undefined;
  return {
    yillikUretim: yuvarla(bu.gesUretimKwh / 1e6, 2),
    ozTuketim: yuvarla(bu.gesOzKwh / 1e6, 2),
    sebekeyeVerilen: yuvarla(bu.sebekeyeVerilenKwh / 1e6, 2),
    karsilamaOrani: yuvarla(oran, 0),
    karsilamaDegisim: gecenOran !== undefined ? yuvarla(oran - gecenOran, 1) : 0,
    tahminiTasarruf: yuvarla(bu.gesOzKwh * FT_ELK, 1),
  };
}

export async function enerjiYogunlukGetir(): Promise<EnerjiYogunluk> {
  const rows = await satirlar();
  const { harita, yillar } = yilGrupla(rows);
  if (!yillar.length) return { deger: 0, degisimYuzde: 0, gecenYil: 0 };
  const buYil = yillar[yillar.length - 1];
  const bu = topla(harita.get(buYil)!);
  const gecen = yillar.includes(buYil - 1) ? topla(harita.get(buYil - 1)!) : undefined;
  return {
    deger: yuvarla(bu.yogunluk, 3),
    degisimYuzde: degisim(bu.yogunluk, gecen?.yogunluk),
    gecenYil: yuvarla(gecen?.yogunluk ?? 0, 3),
  };
}

export async function enerjiHedefGetir(): Promise<EnerjiHedef> {
  const rows = await satirlar();
  const { harita, yillar } = yilGrupla(rows);
  const { data: kats } = await supabaseTarayici().from("katsayilar").select("id, deger").is("deleted_at", null);
  const katDeger = (id: string) => {
    const s = (kats ?? []).find((k: { id: string; deger: string | null }) => k.id === id)?.deger ?? "";
    const num = Number(String(s).replace(/[^\d.,]/g, "").replace(",", "."));
    return Number.isNaN(num) ? 0 : num;
  };
  const hedefPct = katDeger("gp-hedef") || 10;
  const bazYilNo = katDeger("gp-baz");

  if (!yillar.length) return { hedef: hedefPct, gerceklesen: 0, ilerlemeYuzde: 0, mesaj: "Veri bekleniyor" };
  const buYil = yillar[yillar.length - 1];
  const bazYil = yillar.includes(bazYilNo) ? bazYilNo : yillar[0];
  const bu = topla(harita.get(buYil)!);
  const baz = topla(harita.get(bazYil)!);
  const iyilesme = baz.yogunluk > 0 ? ((baz.yogunluk - bu.yogunluk) / baz.yogunluk) * 100 : 0;
  const ilerleme = hedefPct > 0 ? Math.max(0, Math.min(100, Math.round((iyilesme / hedefPct) * 100))) : 0;
  const mesaj = ilerleme >= 100 ? "Hedefe ulaşıldı" : ilerleme >= 50 ? "Hedefe doğru iyi ilerliyorsunuz" : "Hedefin gerisinde";
  return { hedef: hedefPct, gerceklesen: yuvarla(Math.max(0, iyilesme), 1), ilerlemeYuzde: ilerleme, mesaj };
}

export async function enerjiFirsatGetir(): Promise<EnerjiFirsat> {
  const { data } = await supabaseTarayici().from("firsatlar").select("durum").is("deleted_at", null);
  const list = (data ?? []) as { durum: string }[];
  return {
    toplamAcik: list.filter((f) => ["fizibilite", "teklif", "onaylandi"].includes(f.durum)).length,
    devamEden: list.filter((f) => f.durum === "uygulama").length,
    tamamlanan: list.filter((f) => f.durum === "tamamlandi").length,
  };
}

export async function veriDurumGetir(): Promise<VeriDurumDetay> {
  const rows = await satirlar();
  const { harita, yillar } = yilGrupla(rows);
  if (!yillar.length) {
    return { kaynaklar: [], tamlikOrani: 0, tamamlananAy: 0, toplamAy: 12 };
  }
  const buAylar = harita.get(yillar[yillar.length - 1])!;
  const say = (alan: (s: Satir) => number | null) => buAylar.filter((s) => alan(s) !== null && alan(s) !== undefined).length;
  const kaynaklar = [
    { etiket: "Elektrik", mevcut: say((s) => s.sebeke_elektrik), toplam: 12 },
    { etiket: "GES", mevcut: say((s) => s.ges_toplam_uretim), toplam: 12 },
    { etiket: "Doğalgaz", mevcut: say((s) => s.dogalgaz), toplam: 12 },
    { etiket: "Akaryakıt", mevcut: say((s) => s.motorin), toplam: 12 },
  ];
  const tamamlananAy = buAylar.length;
  const tamlik = Math.round((kaynaklar.reduce((t, k) => t + k.mevcut, 0) / (kaynaklar.length * 12)) * 100);
  return { kaynaklar, tamlikOrani: tamlik, tamamlananAy, toplamAy: 12 };
}

export async function guncellemelerGetir(): Promise<GuncellemeKaydi[]> {
  const rows = await satirlar();
  return [...rows]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 5)
    .map((s) => ({ tarih: s.updated_at.slice(0, 10), aciklama: `${AY_TAM[s.ay - 1]} ${s.yil} dönemi güncellendi` }));
}

// ===========================================================================
// PANELDE GÖSTERİLMEYEN (mock — eski bileşenlerin derlenmesi için)
// ===========================================================================

const GUNLUK = { tuketim: 2807, uretim: 720, ges: 620, maliyet: 10413, co2: 893, dogalgaz: 425, akaryakit: 180, tep: 0.78, su: 61 };
const olcek = (taban: number, gun: number) => Math.round(taban * gun);

export function turTuketimGetir(donem: Donem): Promise<TurTuketim[]> {
  const gun = donemGunSayisi(donem);
  return gecikmeIle([
    { tur: "elektrik", etiket: "Elektrik", deger: olcek(GUNLUK.tuketim, gun), birim: "kWh", degisimYuzde: -3.4 },
    { tur: "dogalgaz", etiket: "Doğalgaz", deger: olcek(GUNLUK.dogalgaz, gun), birim: "Sm³", degisimYuzde: 6.7 },
    { tur: "su", etiket: "Su", deger: olcek(GUNLUK.su, gun), birim: "m³", degisimYuzde: -1.2 },
  ]);
}

export function kaynakDagilimiGetir(donem: Donem): Promise<KaynakDilimi[]> {
  const toplam = olcek(GUNLUK.tuketim, donemGunSayisi(donem));
  return gecikmeIle([
    { kaynak: "sebeke", etiket: "Şebeke", deger: Math.round(toplam * 0.74) },
    { kaynak: "solar", etiket: "Solar", deger: Math.round(toplam * 0.22) },
    { kaynak: "jenerator", etiket: "Jeneratör", deger: Math.round(toplam * 0.04) },
  ]);
}

export function karbonOzetGetir(donem: Donem): Promise<KarbonOzet> {
  const gun = donemGunSayisi(donem);
  return gecikmeIle({ co2Kg: olcek(GUNLUK.co2, gun), yenilenebilirOran: 26, tasarrufKg: Math.round(GUNLUK.co2 * gun * 0.16) });
}

export function tuketimSerisiGetir(donem: Donem): Promise<TuketimNoktasi[]> {
  const gun = donemGunSayisi(donem);
  if (gun <= 1) {
    return gecikmeIle(Array.from({ length: 24 }, (_, s) => {
      const gunduz = s >= 7 && s <= 19;
      return { etiket: `${String(s).padStart(2, "0")}:00`, tuketim: Math.round((gunduz ? 150 : 70) + Math.sin(s / 3) * 30), uretim: gunduz ? Math.round(35 + Math.sin((s - 6) / 4) * 45) : 0 };
    }));
  }
  const gunler = eachDayOfInterval({ start: new Date(donem.baslangic), end: new Date(donem.bitis) });
  return gecikmeIle(gunler.map((g, i) => {
    const haftaSonu = g.getDay() === 0 || g.getDay() === 6;
    const taban = haftaSonu ? 1900 : 2900;
    return { etiket: format(g, "d MMM", { locale: tr }), tuketim: taban + Math.round(Math.sin(i / 2) * 260) + (i % 5) * 40, uretim: 520 + Math.round(Math.abs(Math.cos(i / 3)) * 380) };
  }));
}

export function aylikMaliyetGetir(): Promise<AylikMaliyet[]> {
  const yil = BUGUN.getFullYear();
  const buAy = BUGUN.getMonth();
  return gecikmeIle(Array.from({ length: 12 }, (_, i) => {
    const ay = `${yil}-${String(i + 1).padStart(2, "0")}`;
    if (i > buAy) return { ay, gunduz: 0, gece: 0, puant: 0 };
    return { ay, gunduz: 140000 + Math.round(Math.sin(i) * 22000) + i * 1500, gece: 78000 + Math.round(Math.cos(i) * 12000), puant: 52000 + Math.round(Math.sin(i / 2) * 9000) };
  }));
}
