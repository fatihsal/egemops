// -----------------------------------------------------------------------------
// VERİ KATMANI — Raporlar (Supabase: public.raporlar + enerji_kayitlari)
// Üretilen rapor kayıtları + kataloga göre liste; Excel verisi gerçek veriden.
// -----------------------------------------------------------------------------

import type {
  EnCokIndirilen,
  Rapor,
  RaporAnaliz,
  RaporFormat,
  RaporKategori,
  RaporKategoriAnahtar,
  RaporKpi,
  RaporTrendNoktasi,
  SonRapor,
} from "@/lib/types";
import { supabaseTarayici } from "@/lib/supabase/client";

const AY_KISA = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];

// Oluşturulabilir rapor türleri kataloğu (liste + kategori sayıları için).
const KATALOG: { id: string; ad: string; kategori: RaporKategoriAnahtar; aciklama: string; format: RaporFormat; siklik: string }[] = [
  { id: "aylik-tuketim", ad: "Aylık Tüketim Raporu", kategori: "tuketim", aciklama: "Aylık enerji tüketimlerinin kaynak bazlı detaylı raporu", format: "Excel, PDF", siklik: "Aylık" },
  { id: "kaynak-bazli-tuketim", ad: "Kaynak Bazlı Tüketim Raporu", kategori: "tuketim", aciklama: "Enerji kaynaklarına göre tüketim dağılım raporu", format: "PDF", siklik: "Aylık" },
  { id: "enerji-performansi", ad: "Enerji Performansı Raporu", kategori: "performans", aciklama: "Enerji performans göstergeleri ve EnPI analiz raporu", format: "PDF", siklik: "Aylık" },
  { id: "enpi-ozet", ad: "EnPI Özet Raporu", kategori: "performans", aciklama: "EnPI özet ve hedef karşılaştırması", format: "Excel, PDF", siklik: "Aylık" },
  { id: "maliyet-analizi", ad: "Maliyet Analizi Raporu", kategori: "maliyet", aciklama: "Enerji maliyetleri ve birim fiyat analiz raporu", format: "Excel, PDF", siklik: "Aylık" },
  { id: "tep-analizi", ad: "TEP Analizi Raporu", kategori: "tep", aciklama: "TEP dönüşümleri ve kaynak bazlı TEP analiz raporu", format: "Excel, PDF", siklik: "Aylık" },
  { id: "yillik-karsilastirma", ad: "Yıllık Karşılaştırma Raporu", kategori: "karsilastirma", aciklama: "Yıllar arası tüketim ve maliyet karşılaştırma raporu", format: "PDF", siklik: "Yıllık" },
  { id: "ozel-yonetim", ad: "Özel Yönetim Sunumu", kategori: "ozel", aciklama: "Yönetim için özel tasarım enerji özeti", format: "PDF", siklik: "Talebe göre" },
];

const KATEGORI_BILGI: Record<RaporKategoriAnahtar, { baslik: string; aciklama: string }> = {
  tuketim: { baslik: "Tüketim Raporları", aciklama: "Elektrik, doğalgaz, akaryakıt ve TEP tüketim raporları" },
  performans: { baslik: "Performans Raporları", aciklama: "Enerji performansı ve EnPI analiz raporları" },
  maliyet: { baslik: "Maliyet Raporları", aciklama: "Enerji maliyetleri ve birim fiyat analiz raporları" },
  tep: { baslik: "TEP Raporları", aciklama: "TEP analizleri ve kaynak bazlı TEP raporları" },
  karsilastirma: { baslik: "Karşılaştırma Raporları", aciklama: "Dönemsel ve yıllar arası karşılaştırma raporları" },
  ozel: { baslik: "Özel Raporlar", aciklama: "Özel tasarım raporlar ve özel analizler" },
};
const KATEGORI_SIRA: RaporKategoriAnahtar[] = ["tuketim", "performans", "maliyet", "tep", "karsilastirma", "ozel"];

function gecerliFormat(f: string | null): RaporFormat {
  return f === "PDF" || f === "Excel" || f === "Excel, PDF" ? f : "PDF";
}
function gecerliKategori(k: string | null): RaporKategoriAnahtar {
  return KATEGORI_SIRA.includes(k as RaporKategoriAnahtar) ? (k as RaporKategoriAnahtar) : "ozel";
}
function tarihSaat(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
function tarih(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

type Kayit = {
  id: string;
  ad: string;
  kategori: string;
  tur: string | null;
  format: string;
  olusturan: string | null;
  created_at: string;
};

export async function raporAnaliziGetir(): Promise<RaporAnaliz> {
  const supabase = supabaseTarayici();
  const [{ data, error }, { data: profiller }] = await Promise.all([
    supabase
      .from("raporlar")
      .select("id, ad, kategori, tur, format, olusturan, created_at")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, ad_soyad, eposta").is("deleted_at", null),
  ]);

  const kayitlar = (error ? [] : data ?? []) as Kayit[];
  const isim = new Map<string, string>();
  for (const p of (profiller ?? []) as { id: string; ad_soyad: string | null; eposta: string | null }[]) {
    isim.set(p.id, p.ad_soyad ?? p.eposta ?? "—");
  }
  const isimAl = (id: string | null) => (id ? isim.get(id) ?? "—" : "—");

  const sonRaporlar: SonRapor[] = kayitlar.slice(0, 8).map((k) => ({
    id: k.id,
    ad: k.ad,
    tur: k.tur ?? "—",
    kategori: gecerliKategori(k.kategori),
    tarih: tarihSaat(k.created_at),
    olusturan: isimAl(k.olusturan),
    format: gecerliFormat(k.format),
  }));

  // Katalog listesi — her tür için son üretim tarihi
  const raporlar: Rapor[] = KATALOG.map((kat) => {
    const sonKayit = kayitlar.find((k) => k.ad === kat.ad);
    return {
      id: kat.id,
      ad: kat.ad,
      kategori: kat.kategori,
      aciklama: kat.aciklama,
      format: kat.format,
      siklik: kat.siklik,
      sonOlusturma: sonKayit ? tarih(sonKayit.created_at) : "—",
      durum: "aktif",
    };
  });

  const kategoriler: RaporKategori[] = KATEGORI_SIRA.map((k) => ({
    anahtar: k,
    baslik: KATEGORI_BILGI[k].baslik,
    aciklama: KATEGORI_BILGI[k].aciklama,
    adet: KATALOG.filter((x) => x.kategori === k).length,
  }));

  // Trend — son 6 ay üretilen sayısı
  const simdi = new Date();
  const trend: RaporTrendNoktasi[] = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(simdi.getFullYear(), simdi.getMonth() - (5 - i), 1);
    const sayi = kayitlar.filter((k) => {
      const kd = new Date(k.created_at);
      return kd.getFullYear() === d.getFullYear() && kd.getMonth() === d.getMonth();
    }).length;
    return { etiket: `${AY_KISA[d.getMonth()]} '${String(d.getFullYear()).slice(-2)}`, olusturulan: sayi, indirilen: sayi };
  });

  // En çok üretilen (ada göre)
  const sayac = new Map<string, number>();
  for (const k of kayitlar) sayac.set(k.ad, (sayac.get(k.ad) ?? 0) + 1);
  const enCokIndirilen: EnCokIndirilen[] = [...sayac.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ad, adet], i) => ({ sira: i + 1, ad, adet }));

  const buAy = kayitlar.filter((k) => {
    const kd = new Date(k.created_at);
    return kd.getFullYear() === simdi.getFullYear() && kd.getMonth() === simdi.getMonth();
  }).length;
  const enCokAd = enCokIndirilen[0]?.ad ?? "—";

  const kpiler: RaporKpi[] = [
    { anahtar: "olusturulan", baslik: "Oluşturulan Rapor", deger: String(kayitlar.length), altMetin: "Toplam" },
    { anahtar: "buAy", baslik: "Bu Ay Oluşturulan", deger: String(buAy), altMetin: "Son 30 gün" },
    { anahtar: "sablon", baslik: "Rapor Türü", deger: String(KATALOG.length), altMetin: "Kullanılabilir şablon" },
    { anahtar: "kategori", baslik: "Kategori", deger: String(KATEGORI_SIRA.length), altMetin: "Rapor kategorisi" },
    { anahtar: "encok", baslik: "En Çok Üretilen Rapor", deger: enCokAd, altMetin: enCokIndirilen[0] ? `${enCokIndirilen[0].adet} kez` : "—", boyut: "metin" },
    { anahtar: "kapsam", baslik: "Toplam Veri Kapsamı", deger: "%100", altMetin: "Dönem kapsamı" },
  ];

  return { kpiler, kategoriler, trend, enCokIndirilen, sonRaporlar, raporlar };
}

// ---------------------------------------------------------------------------
// Oluşturma / silme + Excel verisi
// ---------------------------------------------------------------------------

export type RaporGirdi = {
  ad: string;
  kategori: RaporKategoriAnahtar;
  tur: string;
  format: RaporFormat;
  donem?: string;
};

export async function raporEkle(g: RaporGirdi): Promise<void> {
  const supabase = supabaseTarayici();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase.from("raporlar").insert({
    ad: g.ad.trim(),
    kategori: g.kategori,
    tur: g.tur,
    format: g.format,
    donem: g.donem ?? null,
    olusturan: user?.id ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function raporSil(id: string): Promise<void> {
  const { error } = await supabaseTarayici().rpc("rapor_sil", { p_id: id });
  if (error) throw new Error(error.message);
}

/** Rapor içeriği: seçili yıl aralığındaki enerji kayıtları (Excel/CSV için). */
export async function raporVerisiGetir(
  baslangic?: Date,
  bitis?: Date,
): Promise<{ basliklar: string[]; satirlar: (string | number)[][] }> {
  const supabase = supabaseTarayici();
  let q = supabase
    .from("enerji_kayitlari")
    .select("yil, ay, sebeke_elektrik, ges_toplam_uretim, ges_oz_tuketim, sebekeye_verilen, dogalgaz, motorin, benzin, diger_akaryakit, uretim_ton, durum")
    .is("deleted_at", null)
    .order("yil", { ascending: true })
    .order("ay", { ascending: true });
  if (baslangic) q = q.gte("yil", baslangic.getFullYear());
  if (bitis) q = q.lte("yil", bitis.getFullYear());
  const { data } = await q;

  const basliklar = ["Yıl", "Ay", "Şebeke Elektrik (kWh)", "GES Üretim (kWh)", "GES Öz Tüketim (kWh)", "Şebekeye Verilen (kWh)", "Doğalgaz (Sm³)", "Motorin (L)", "Benzin (L)", "Diğer (L)", "Üretim (ton)", "Durum"];
  const satirlar = ((data ?? []) as Record<string, number | string | null>[]).map((r) => [
    r.yil as number, r.ay as number,
    (r.sebeke_elektrik as number) ?? 0, (r.ges_toplam_uretim as number) ?? 0, (r.ges_oz_tuketim as number) ?? 0,
    (r.sebekeye_verilen as number) ?? 0, (r.dogalgaz as number) ?? 0, (r.motorin as number) ?? 0,
    (r.benzin as number) ?? 0, (r.diger_akaryakit as number) ?? 0, (r.uretim_ton as number) ?? 0,
    (r.durum as string) ?? "",
  ]);
  return { basliklar, satirlar };
}
