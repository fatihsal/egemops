// -----------------------------------------------------------------------------
// VERİ KATMANI — Enerji Fırsatları (Supabase: public.firsatlar)
// Tüm KPI/donut/vade özetleri firsatlar listesinden hesaplanır.
// -----------------------------------------------------------------------------

import type {
  Firsat,
  FirsatAnaliz,
  FirsatDurum,
  FirsatDurumDilim,
  FirsatKaynak,
  FirsatKaynakDilim,
  FirsatKpi,
  FirsatOncelik,
  FirsatVade,
} from "@/lib/types";
import { supabaseTarayici } from "@/lib/supabase/client";

const DURUM_ETIKET: Record<FirsatDurum, string> = {
  fizibilite: "Fizibilite",
  teklif: "Teklif / Planlama",
  onaylandi: "Onaylandı",
  uygulama: "Uygulama",
  tamamlandi: "Tamamlandı",
};
const DURUM_SIRA: FirsatDurum[] = ["fizibilite", "teklif", "onaylandi", "uygulama", "tamamlandi"];
const KAYNAK_ETIKET: Record<FirsatKaynak, string> = {
  elektrik: "Elektrik",
  dogalgaz: "Doğalgaz",
  akaryakit: "Akaryakıt",
};
const KAYNAK_SIRA: FirsatKaynak[] = ["elektrik", "dogalgaz", "akaryakit"];

const trTam = (n: number) => Math.round(n).toLocaleString("tr-TR");
const trOnd = (n: number, d: number) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });
const yuzde1 = (pay: number, toplam: number) => (toplam > 0 ? Math.round((pay / toplam) * 1000) / 10 : 0);

type Satir = {
  id: string;
  oncelik: FirsatOncelik;
  ad: string;
  kaynak: FirsatKaynak;
  tasarruf: number;
  yatirim: number;
  geri_donus: number;
  durum: FirsatDurum;
  ilerleme: number;
};

export async function firsatAnaliziGetir(): Promise<FirsatAnaliz> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("firsatlar")
    .select("id, oncelik, ad, kaynak, tasarruf, yatirim, geri_donus, durum, ilerleme")
    .is("deleted_at", null)
    .order("tasarruf", { ascending: false });

  // Tablo henüz yoksa (migration çalışmadıysa) boş/güvenli dön.
  const satirlar = (error ? [] : data ?? []) as Satir[];
  const firsatlar: Firsat[] = satirlar.map((s) => ({
    id: s.id,
    oncelik: s.oncelik,
    ad: s.ad,
    kaynak: s.kaynak,
    tasarruf: s.tasarruf,
    yatirim: s.yatirim,
    geriDonus: s.geri_donus,
    durum: s.durum,
    ilerleme: s.ilerleme,
  }));

  const toplamFirsat = firsatlar.length;
  const toplamTasarruf = firsatlar.reduce((t, f) => t + f.tasarruf, 0);
  const toplamYatirim = firsatlar.reduce((t, f) => t + f.yatirim, 0);
  const agirlikliGeriDonus = toplamTasarruf > 0
    ? firsatlar.reduce((t, f) => t + f.geriDonus * f.tasarruf, 0) / toplamTasarruf
    : 0;
  const agirlikliIlerleme = toplamTasarruf > 0
    ? firsatlar.reduce((t, f) => t + f.ilerleme * f.tasarruf, 0) / toplamTasarruf
    : 0;
  const gerceklesen = firsatlar.filter((f) => f.durum === "tamamlandi").reduce((t, f) => t + f.tasarruf, 0);

  const kpiler: FirsatKpi[] = [
    { anahtar: "toplam", baslik: "Toplam Fırsat", deger: String(toplamFirsat), altMetin: "Aktif + Planlanan" },
    { anahtar: "tasarruf", baslik: "Toplam Potansiyel Tasarruf", deger: trOnd(toplamTasarruf, 1), birim: "TEP / yıl", altMetin: "Yıllık tahmini" },
    { anahtar: "yatirim", baslik: "Yatırım Tutarı", deger: trTam(toplamYatirim), birim: "€", altMetin: "Toplam yatırım ihtiyacı" },
    { anahtar: "geriDonus", baslik: "Geri Dönüş Süresi", deger: trOnd(agirlikliGeriDonus, 1), birim: "yıl", altMetin: "Ağırlıklı ortalama" },
    { anahtar: "gerceklesen", baslik: "Gerçekleşen Tasarruf", deger: trOnd(gerceklesen, 1), birim: "TEP", altMetin: "Tamamlananlar" },
    { anahtar: "uygulama", baslik: "Uygulama Oranı", deger: `%${Math.round(agirlikliIlerleme)}`, altMetin: "Ağırlıklı ilerleme" },
  ];

  const durumDagilimi: FirsatDurumDilim[] = DURUM_SIRA.map((d) => {
    const adet = firsatlar.filter((f) => f.durum === d).length;
    return { anahtar: d, etiket: DURUM_ETIKET[d], adet, yuzde: yuzde1(adet, toplamFirsat) };
  }).filter((x) => x.adet > 0);

  const kaynakTasarruf: FirsatKaynakDilim[] = KAYNAK_SIRA.map((k) => {
    const tep = firsatlar.filter((f) => f.kaynak === k).reduce((t, f) => t + f.tasarruf, 0);
    return { anahtar: k, etiket: KAYNAK_ETIKET[k], tep: Math.round(tep * 10) / 10, yuzde: yuzde1(tep, toplamTasarruf) };
  }).filter((x) => x.tep > 0);

  const vadeSum = (f: (g: Firsat) => boolean) => firsatlar.filter(f).reduce((t, g) => t + g.tasarruf, 0);
  const vadeler: FirsatVade[] = [
    { anahtar: "hizli", baslik: "Hızlı Etki Potansiyeli", deger: trOnd(vadeSum((f) => f.geriDonus < 1), 1), birim: "TEP / yıl", aciklama: "1 yıldan kısa geri dönüş süresi olan fırsatlar" },
    { anahtar: "orta", baslik: "Orta Vadeli Potansiyel", deger: trOnd(vadeSum((f) => f.geriDonus >= 1 && f.geriDonus <= 3), 1), birim: "TEP / yıl", aciklama: "1 – 3 yıl geri dönüş süresi olan fırsatlar" },
    { anahtar: "uzun", baslik: "Uzun Vadeli Potansiyel", deger: trOnd(vadeSum((f) => f.geriDonus > 3), 1), birim: "TEP / yıl", aciklama: "3 yıldan uzun geri dönüş süresi olan fırsatlar" },
    { anahtar: "co2", baslik: "CO₂ Azaltım Potansiyeli", deger: trTam(toplamTasarruf * 1.82), birim: "tCO₂e / yıl", aciklama: "Tahmini yıllık emisyon azaltımı" },
  ];

  return {
    kpiler,
    durumDagilimi,
    toplamFirsat,
    kaynakTasarruf,
    toplamTasarruf: Math.round(toplamTasarruf * 10) / 10,
    firsatlar,
    vadeler,
  };
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export type FirsatGirdi = {
  oncelik: FirsatOncelik;
  ad: string;
  kaynak: FirsatKaynak;
  tasarruf: number;
  yatirim: number;
  geriDonus: number;
  durum: FirsatDurum;
  ilerleme: number;
};

function girdidenSatir(g: FirsatGirdi) {
  return {
    oncelik: g.oncelik,
    ad: g.ad.trim(),
    kaynak: g.kaynak,
    tasarruf: g.tasarruf,
    yatirim: g.yatirim,
    geri_donus: g.geriDonus,
    durum: g.durum,
    ilerleme: g.ilerleme,
  };
}

export async function firsatEkle(g: FirsatGirdi): Promise<void> {
  const { error } = await supabaseTarayici().from("firsatlar").insert(girdidenSatir(g));
  if (error) throw new Error(error.message);
}

export async function firsatGuncelle(id: string, g: FirsatGirdi): Promise<void> {
  const { error } = await supabaseTarayici().from("firsatlar").update(girdidenSatir(g)).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function firsatSil(id: string): Promise<void> {
  const { error } = await supabaseTarayici().rpc("firsat_sil", { p_id: id });
  if (error) throw new Error(error.message);
}
