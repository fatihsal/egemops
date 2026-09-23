// -----------------------------------------------------------------------------
// VERİ KATMANI — Belgeler (Supabase: public.belgeler + Firebase Storage)
// -----------------------------------------------------------------------------

import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import type {
  Belge,
  BelgeAnaliz,
  BelgeDurum,
  BelgeFormat,
  BelgeKategori,
  BelgeKategoriAnahtar,
  BelgeKpi,
  DepolamaKalem,
  SureYaklasan,
} from "@/lib/types";
import { firebaseStorage } from "@/lib/firebase/client";
import { supabaseTarayici } from "@/lib/supabase/client";

const DEPOLAMA_TOPLAM_GB = 5; // Firebase ücretsiz katman

const KATEGORI_BILGI: Record<
  BelgeKategoriAnahtar,
  { baslik: string; aciklama: string; renk: string }
> = {
  yasal: { baslik: "Yasal & Mevzuat", aciklama: "Kanun, yönetmelik ve resmi bildirimler", renk: "#2563eb" },
  sertifika: { baslik: "Sertifikalar", aciklama: "ISO 50001, EKB ve yeterlilik belgeleri", renk: "#10b981" },
  sozlesme: { baslik: "Sözleşmeler", aciklama: "Tedarik ve enerji performans sözleşmeleri", renk: "#8b5cf6" },
  rapor: { baslik: "Etüt & Raporlar", aciklama: "Enerji etütleri ve VAP proje dosyaları", renk: "#14b8a6" },
  teknik: { baslik: "Teknik Dökümanlar", aciklama: "Ekipman kılavuzları ve kalibrasyon belgeleri", renk: "#f59e0b" },
  fatura: { baslik: "Faturalar", aciklama: "Elektrik, doğalgaz ve akaryakıt faturaları", renk: "#06b6d4" },
};

const KATEGORI_SIRA: BelgeKategoriAnahtar[] = [
  "yasal", "sertifika", "sozlesme", "rapor", "teknik", "fatura",
];

type Satir = {
  id: string;
  ad: string;
  tur: string | null;
  boyut: number | null;
  url: string;
  depolama_yolu: string;
  kategori: string | null;
  durum: string | null;
  gecerlilik: string | null;
  aciklama: string | null;
  yukleyen: string | null;
  created_at: string;
};

function tarihBicim(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function boyutMB(byte: number | null): string {
  if (!byte) return "0 KB";
  if (byte < 1024 * 1024) return `${Math.round(byte / 1024)} KB`;
  return `${(byte / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

function formatBelge(tur: string | null): BelgeFormat {
  if (tur === "PDF" || tur === "Excel" || tur === "Word" || tur === "Görsel") return tur;
  return "PDF";
}

function kategoriGuvenli(k: string | null): BelgeKategoriAnahtar {
  return KATEGORI_SIRA.includes(k as BelgeKategoriAnahtar) ? (k as BelgeKategoriAnahtar) : "fatura";
}

/** gecerlilik'e göre durum (satırda durum yoksa). */
function durumHesapla(gecerlilik: string | null, mevcut: string | null): { durum: BelgeDurum; kalanGun: number | null } {
  if (mevcut === "taslak") return { durum: "taslak", kalanGun: null };
  if (!gecerlilik) return { durum: "gecerli", kalanGun: null };
  const bugun = new Date();
  bugun.setHours(0, 0, 0, 0);
  const son = new Date(gecerlilik);
  const kalanGun = Math.round((son.getTime() - bugun.getTime()) / (1000 * 60 * 60 * 24));
  if (kalanGun < 0) return { durum: "doldu", kalanGun };
  if (kalanGun <= 35) return { durum: "yaklasiyor", kalanGun };
  return { durum: "gecerli", kalanGun };
}

async function satirlariGetir(): Promise<{ satirlar: Satir[]; isimAl: (id: string | null) => string }> {
  const supabase = supabaseTarayici();
  const [{ data, error }, { data: profiller }] = await Promise.all([
    supabase
      .from("belgeler")
      .select(
        "id, ad, tur, boyut, url, depolama_yolu, kategori, durum, gecerlilik, aciklama, yukleyen, created_at",
      )
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, ad_soyad, eposta").is("deleted_at", null),
  ]);
  if (error) throw new Error(error.message);

  const harita = new Map<string, string>();
  for (const p of (profiller ?? []) as { id: string; ad_soyad: string | null; eposta: string | null }[]) {
    harita.set(p.id, p.ad_soyad ?? p.eposta ?? "—");
  }
  const isimAl = (id: string | null) => (id ? harita.get(id) ?? "—" : "—");
  return { satirlar: (data ?? []) as Satir[], isimAl };
}

export async function belgeAnaliziGetir(): Promise<BelgeAnaliz> {
  const { satirlar, isimAl } = await satirlariGetir();

  const belgeler: Belge[] = satirlar.map((s) => {
    const { durum } = durumHesapla(s.gecerlilik, s.durum);
    return {
      id: s.id,
      ad: s.ad,
      kategori: kategoriGuvenli(s.kategori),
      format: formatBelge(s.tur),
      boyut: boyutMB(s.boyut),
      yukleyen: isimAl(s.yukleyen),
      tarih: tarihBicim(s.created_at),
      durum,
      gecerlilik: s.gecerlilik ? tarihBicim(s.gecerlilik) : null,
      aciklama: s.aciklama ?? "",
      url: s.url,
      depolamaYolu: s.depolama_yolu,
    };
  });

  // Kategoriler
  const kategoriler: BelgeKategori[] = KATEGORI_SIRA.map((k) => {
    const grup = satirlar.filter((s) => kategoriGuvenli(s.kategori) === k);
    const toplamByte = grup.reduce((t, s) => t + (s.boyut ?? 0), 0);
    return {
      anahtar: k,
      baslik: KATEGORI_BILGI[k].baslik,
      aciklama: KATEGORI_BILGI[k].aciklama,
      adet: grup.length,
      boyut: boyutMB(toplamByte),
    };
  });

  // Depolama
  const toplamByte = satirlar.reduce((t, s) => t + (s.boyut ?? 0), 0);
  const kullanilan = toplamByte / (1024 * 1024 * 1024); // GB
  const kalemler: DepolamaKalem[] = KATEGORI_SIRA.map((k) => {
    const gb =
      satirlar.filter((s) => kategoriGuvenli(s.kategori) === k).reduce((t, s) => t + (s.boyut ?? 0), 0) /
      (1024 * 1024 * 1024);
    return { anahtar: k, etiket: KATEGORI_BILGI[k].baslik, gb: Math.round(gb * 1000) / 1000, renk: KATEGORI_BILGI[k].renk };
  }).filter((x) => x.gb > 0);

  // Süresi yaklaşan
  const sureYaklasan: SureYaklasan[] = satirlar
    .map((s) => {
      const { durum, kalanGun } = durumHesapla(s.gecerlilik, s.durum);
      return { s, durum, kalanGun };
    })
    .filter((x) => x.durum === "yaklasiyor" && x.kalanGun !== null)
    .sort((a, b) => (a.kalanGun ?? 0) - (b.kalanGun ?? 0))
    .map((x) => ({
      id: x.s.id,
      ad: x.s.ad,
      kategori: kategoriGuvenli(x.s.kategori),
      tarih: tarihBicim(x.s.gecerlilik),
      kalanGun: x.kalanGun ?? 0,
    }));

  // KPI
  const simdi = new Date();
  const buAy = satirlar.filter((s) => {
    const d = new Date(s.created_at);
    return d.getFullYear() === simdi.getFullYear() && d.getMonth() === simdi.getMonth();
  }).length;
  const yuzde = Math.min(100, Math.round((kullanilan / DEPOLAMA_TOPLAM_GB) * 100));

  const kpiler: BelgeKpi[] = [
    { anahtar: "toplam", baslik: "Toplam Belge", deger: String(belgeler.length), altMetin: "Tüm kategoriler" },
    { anahtar: "buAy", baslik: "Bu Ay Yüklenen", deger: String(buAy), altMetin: "Son 30 gün" },
    { anahtar: "yaklasan", baslik: "Süresi Yaklaşan", deger: String(sureYaklasan.length), altMetin: "35 gün içinde" },
    {
      anahtar: "depolama",
      baslik: "Depolama",
      deger: kullanilan.toFixed(2).replace(".", ","),
      birim: "GB",
      altMetin: `${DEPOLAMA_TOPLAM_GB} GB'ın %${yuzde}'i`,
      ilerleme: yuzde,
    },
  ];

  return {
    kpiler,
    kategoriler,
    depolama: { toplam: DEPOLAMA_TOPLAM_GB, kullanilan: Math.round(kullanilan * 100) / 100, yuzde, kalemler },
    sureYaklasan,
    belgeler,
  };
}

// ----------------------------------------------------------------------------
// Yükleme / silme (genel belgeler)
// ----------------------------------------------------------------------------

function turEtiket(ad: string): string {
  const u = ad.split(".").pop()?.toLowerCase() ?? "";
  if (u === "pdf") return "PDF";
  if (u === "xlsx" || u === "xls" || u === "csv") return "Excel";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(u)) return "Görsel";
  if (u === "doc" || u === "docx") return "Word";
  return u.toUpperCase() || "Dosya";
}

export type BelgeYukleGirdi = {
  dosya: File;
  kategori: BelgeKategoriAnahtar;
  gecerlilik?: string | null; // "YYYY-MM-DD"
  aciklama?: string;
};

export async function belgeYukleGenel(girdi: BelgeYukleGirdi): Promise<void> {
  const supabase = supabaseTarayici();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const guvenliAd = girdi.dosya.name.replace(/[^\w.\-]+/g, "_");
  const yol = `belgeler/genel/${girdi.kategori}/${Date.now()}_${guvenliAd}`;

  const depoRef = ref(firebaseStorage, yol);
  await uploadBytes(depoRef, girdi.dosya, { contentType: girdi.dosya.type || undefined });
  const url = await getDownloadURL(depoRef);

  const { error } = await supabase.from("belgeler").insert({
    ad: girdi.dosya.name,
    tur: turEtiket(girdi.dosya.name),
    boyut: girdi.dosya.size,
    url,
    depolama_yolu: yol,
    kategori: girdi.kategori,
    gecerlilik: girdi.gecerlilik || null,
    aciklama: girdi.aciklama || null,
    yukleyen: user?.id ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function belgeSilGenel(id: string, depolamaYolu: string): Promise<void> {
  const supabase = supabaseTarayici();
  const { error } = await supabase
    .from("belgeler")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);

  try {
    await deleteObject(ref(firebaseStorage, depolamaYolu));
  } catch {
    /* dosya yoksa yut */
  }
}
