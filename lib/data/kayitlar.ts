// -----------------------------------------------------------------------------
// VERİ KATMANI — Enerji Kayıtları (Supabase: public.enerji_kayitlari)
// -----------------------------------------------------------------------------
// Ham girişlerden (Veri Girişi sayfası) türetilmiş TEP/yoğunluk alanlarını üretir.
// TEP katsayıları Katsayılar sayfasındaki resmi değerlerle uyumludur.

import type {
  EnerjiKayit,
  KayitDurum,
  KayitGecmis,
  KayitOzet,
  VeriKalite,
  YillikOzetSatir,
} from "@/lib/types";
import { supabaseTarayici } from "@/lib/supabase/client";

// TEP dönüşüm katsayıları (birim başına TEP)
const FT_ELK = 0.086 / 1000; // 0,0860 TEP / MWh  -> TEP/kWh
const FT_DG = 0.825 / 1000; // 0,8250 TEP / 1000 Sm³ -> TEP/Sm³
const FT_AKR = 1.02 * 0.00085; // ~1,0200 TEP/ton, ~0,85 kg/L -> TEP/L

const AY_ADI = [
  "", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

const y2 = (n: number) => Math.round(n * 100) / 100;

type Satir = {
  id: string;
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
  durum: "taslak" | "onayli";
  created_at: string;
  updated_at: string;
};

function tarihBicim(iso: string) {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function satirdanKayit(s: Satir, onceki: Satir | null): EnerjiKayit {
  const n = (v: number | null) => v ?? 0;
  const gesOzTuketim = n(s.ges_oz_tuketim);
  const sebekeElektrik = n(s.sebeke_elektrik);
  const elektrik = y2(sebekeElektrik + gesOzTuketim); // toplam elektrik tüketimi
  const gesUretim = n(s.ges_toplam_uretim);
  const sebekeyeVerilen = n(s.sebekeye_verilen);
  const dogalgaz = n(s.dogalgaz);
  const motorin = n(s.motorin);
  const benzin = n(s.benzin);
  const diger = n(s.diger_akaryakit);
  const akaryakit = y2(motorin + benzin + diger);
  const uretimTon = n(s.uretim_ton);

  const elektrikTep = y2(elektrik * FT_ELK);
  const dogalgazTep = y2(dogalgaz * FT_DG);
  const akaryakitTep = y2(akaryakit * FT_AKR);
  const toplamTep = y2(elektrikTep + dogalgazTep + akaryakitTep);

  const gesKarsilama = elektrik > 0 ? y2((gesOzTuketim / elektrik) * 100) : 0;
  const enerjiYogunluk = uretimTon > 0 ? Math.round((toplamTep / uretimTon) * 1000) / 1000 : 0;

  const durum: KayitDurum = s.durum === "onayli" ? "onaylandi" : "taslak";
  const veriKalitesi: VeriKalite = s.durum === "onayli" ? "tam" : "kontrol";

  // Önceki dönem
  const oncekiKayit = onceki ? satirdanKayitHam(onceki) : null;
  const oncekiTep = oncekiKayit?.toplamTep ?? null;
  const degisim =
    oncekiTep && oncekiTep > 0 ? Math.round(((toplamTep - oncekiTep) / oncekiTep) * 1000) / 10 : null;
  const oncekiYogunluk = oncekiKayit?.enerjiYogunluk ?? 0;

  const gecmis: KayitGecmis[] = [
    {
      tarih: tarihBicim(s.updated_at),
      baslik: durum === "onaylandi" ? "Kayıt onaylandı" : "Taslak kaydedildi",
      kullanici: "—",
      tur: "onay",
    },
    { tarih: tarihBicim(s.created_at), baslik: "Kayıt oluşturuldu", kullanici: "—", tur: "ekleme" },
  ];

  return {
    id: s.id,
    donem: `${AY_ADI[s.ay]} ${s.yil}`,
    yil: s.yil,
    ay: s.ay,
    elektrik,
    gesUretim,
    dogalgaz,
    akaryakit,
    toplamTep,
    durum,
    veriKalitesi,
    elektrikTep,
    dogalgazTep,
    akaryakitTep,
    gesKarsilama,
    oncekiDonem: oncekiKayit ? `${AY_ADI[onceki!.ay]} ${onceki!.yil}` : null,
    oncekiTep,
    degisimYuzde: degisim,
    sonGuncelleme: tarihBicim(s.updated_at),
    guncelleyen: "—",
    olusturan: "—",
    onaylayan: durum === "onaylandi" ? "—" : "—",
    belgeSayisi: 0,
    gecmis,
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
      oncekiYogunluk > 0
        ? Math.round(((enerjiYogunluk - oncekiYogunluk) / oncekiYogunluk) * 1000) / 10
        : 0,
    notlar: "",
    belgeler: [],
    oncekiElektrikTep: oncekiKayit?.elektrikTep ?? null,
    oncekiDogalgazTep: oncekiKayit?.dogalgazTep ?? null,
    oncekiAkaryakitTep: oncekiKayit?.akaryakitTep ?? null,
  };
}

// Önceki dönem için hafif hesap (özyineleme olmadan sadece gerekli TEP alanları).
function satirdanKayitHam(s: Satir) {
  const n = (v: number | null) => v ?? 0;
  const elektrik = n(s.sebeke_elektrik) + n(s.ges_oz_tuketim);
  const akaryakit = n(s.motorin) + n(s.benzin) + n(s.diger_akaryakit);
  const elektrikTep = y2(elektrik * FT_ELK);
  const dogalgazTep = y2(n(s.dogalgaz) * FT_DG);
  const akaryakitTep = y2(akaryakit * FT_AKR);
  const toplamTep = y2(elektrikTep + dogalgazTep + akaryakitTep);
  const uretimTon = n(s.uretim_ton);
  const enerjiYogunluk = uretimTon > 0 ? Math.round((toplamTep / uretimTon) * 1000) / 1000 : 0;
  return { toplamTep, enerjiYogunluk, elektrikTep, dogalgazTep, akaryakitTep };
}

async function satirlariGetir(): Promise<Satir[]> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("enerji_kayitlari")
    .select(
      "id, yil, ay, sebeke_elektrik, ges_toplam_uretim, ges_oz_tuketim, sebekeye_verilen, dogalgaz, motorin, benzin, diger_akaryakit, uretim_ton, durum, created_at, updated_at",
    )
    .is("deleted_at", null)
    .order("yil", { ascending: false })
    .order("ay", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Satir[];
}

function kayitlariUret(satirlar: Satir[]): EnerjiKayit[] {
  return satirlar.map((s, i) => satirdanKayit(s, satirlar[i + 1] ?? null));
}

export async function enerjiKayitlariGetir(): Promise<EnerjiKayit[]> {
  return kayitlariUret(await satirlariGetir());
}

export async function kayitGetir(id: string): Promise<EnerjiKayit | undefined> {
  return kayitlariUret(await satirlariGetir()).find((k) => k.id === id);
}

export async function kayitOzetiGetir(): Promise<KayitOzet> {
  const kayitlar = kayitlariUret(await satirlariGetir());
  const toplam = kayitlar.length;
  const say = (f: (k: EnerjiKayit) => boolean) => kayitlar.filter(f).length;
  const oran = (nn: number) => (toplam > 0 ? Math.round((nn / toplam) * 1000) / 10 : 0);
  const yillar = [...new Set(kayitlar.map((k) => k.yil))].sort();
  const onaylanan = say((k) => k.durum === "onaylandi");
  const kontrol = say((k) => k.durum === "kontrol");
  const taslak = say((k) => k.durum === "taslak");
  const eksik = say((k) => k.veriKalitesi === "eksik");
  return {
    toplam,
    toplamAralik: yillar.length ? `${yillar[0]} – ${yillar[yillar.length - 1]}` : "—",
    onaylanan,
    onaylananOran: oran(onaylanan),
    kontrolBekleyen: kontrol,
    kontrolOran: oran(kontrol),
    taslak,
    taslakOran: oran(taslak),
    eksik,
    eksikOran: oran(eksik),
  };
}

export async function yillikOzetGetir(): Promise<YillikOzetSatir[]> {
  const kayitlar = kayitlariUret(await satirlariGetir());
  const yillar = [...new Set(kayitlar.map((k) => String(k.yil)))].sort();
  const bosDeger = () => Object.fromEntries(yillar.map((y) => [y, 0])) as Record<string, number>;

  const topla = (sec: (k: EnerjiKayit) => number) => {
    const d = bosDeger();
    for (const k of kayitlar) d[String(k.yil)] += sec(k);
    return d;
  };

  return [
    { kaynak: "Elektrik", birim: "kWh", grup: "tuketim", degerler: topla((k) => k.elektrik) },
    { kaynak: "GES Üretimi", birim: "kWh", grup: "tuketim", degerler: topla((k) => k.gesUretim) },
    { kaynak: "Doğalgaz", birim: "Sm³", grup: "tuketim", degerler: topla((k) => k.dogalgaz) },
    { kaynak: "Akaryakıt", birim: "Litre", grup: "tuketim", degerler: topla((k) => k.akaryakit) },
    { kaynak: "Elektrik", birim: "TEP", grup: "tep", degerler: topla((k) => k.elektrikTep) },
    { kaynak: "Doğalgaz", birim: "TEP", grup: "tep", degerler: topla((k) => k.dogalgazTep) },
    { kaynak: "Akaryakıt", birim: "TEP", grup: "tep", degerler: topla((k) => k.akaryakitTep) },
    { kaynak: "Toplam", birim: "TEP", grup: "tep", degerler: topla((k) => k.toplamTep), vurgu: true },
  ];
}
