// -----------------------------------------------------------------------------
// VERİ KATMANI — Enerji Projeleri (Supabase: public.projeler)
// KPI/gantt/bütçe/aşama/dikkat özetleri projeler listesinden hesaplanır.
// -----------------------------------------------------------------------------

import type {
  Proje,
  ProjeAnaliz,
  ProjeAsama,
  ProjeButceKalem,
  ProjeDikkatMadde,
  ProjeDurum,
  ProjeGantt,
  ProjeKaynak,
  ProjeKpi,
  ProjeRag,
} from "@/lib/types";
import { supabaseTarayici } from "@/lib/supabase/client";

const AY_KISA = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const RENKLER = ["#14b8a6", "#f59e0b", "#8b5cf6", "#22c55e", "#3b82f6", "#ec4899", "#0891b2"];

const ASAMA_META: { anahtar: ProjeDurum; etiket: string; ikon: string }[] = [
  { anahtar: "planlama", etiket: "Planlama", ikon: "solar:clipboard-list-bold-duotone" },
  { anahtar: "muhendislik", etiket: "Mühendislik", ikon: "solar:ruler-pen-bold-duotone" },
  { anahtar: "satinAlma", etiket: "Satın Alma", ikon: "solar:cart-large-2-bold-duotone" },
  { anahtar: "uygulama", etiket: "Uygulama", ikon: "solar:settings-bold-duotone" },
  { anahtar: "devreyeAlma", etiket: "Devreye Alma", ikon: "solar:bolt-circle-bold-duotone" },
  { anahtar: "tamamlandi", etiket: "Tamamlandı", ikon: "solar:verified-check-bold-duotone" },
];

const trOnd = (n: number, d: number) =>
  n.toLocaleString("tr-TR", { minimumFractionDigits: d, maximumFractionDigits: d });

function isoYap(iso: string | null): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}
function trTarih(iso: string | null): string {
  const d = isoYap(iso);
  if (!d) return "—";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}
const GUN = 1000 * 60 * 60 * 24;

type Satir = {
  id: string;
  ad: string;
  aciklama: string | null;
  kaynak: ProjeKaynak;
  durum: ProjeDurum;
  ilerleme: number;
  baslangic: string | null;
  hedef_bitis: string | null;
  sorumlu: string | null;
  butce: number;
  harcanan: number;
  beklenen_tasarruf: number;
  dogrulanan_tasarruf: number | null;
  geri_donus: number;
  saglik_zaman: ProjeRag;
  saglik_butce: ProjeRag;
  saglik_tasarruf: ProjeRag;
};

export async function projeAnaliziGetir(): Promise<ProjeAnaliz> {
  const supabase = supabaseTarayici();
  const { data, error } = await supabase
    .from("projeler")
    .select("*")
    .is("deleted_at", null)
    .order("baslangic", { ascending: true });

  // Tablo henüz yoksa (migration çalışmadıysa) boş/güvenli dön.
  const satirlar = (error ? [] : data ?? []) as Satir[];

  const projeler: Proje[] = satirlar.map((s) => ({
    id: s.id,
    ad: s.ad,
    aciklama: s.aciklama ?? "",
    kaynak: s.kaynak,
    durum: s.durum,
    ilerleme: s.ilerleme,
    baslangic: trTarih(s.baslangic),
    hedefBitis: trTarih(s.hedef_bitis),
    sorumlu: s.sorumlu ?? "—",
    butce: s.butce,
    harcanan: s.harcanan,
    beklenenTasarruf: s.beklenen_tasarruf,
    dogrulananTasarruf: s.dogrulanan_tasarruf,
    geriDonus: s.geri_donus,
    saglik: { zaman: s.saglik_zaman, butce: s.saglik_butce, tasarruf: s.saglik_tasarruf },
  }));

  const toplamButce = satirlar.reduce((t, s) => t + s.butce, 0);
  const toplamHarcanan = satirlar.reduce((t, s) => t + s.harcanan, 0);
  const planlanan = satirlar.reduce((t, s) => t + s.beklenen_tasarruf, 0);
  const dogrulanan = satirlar.reduce((t, s) => t + (s.dogrulanan_tasarruf ?? 0), 0);
  const aktif = satirlar.filter((s) => s.durum !== "tamamlandi").length;
  const zamaninda = satirlar.filter((s) => s.saglik_zaman !== "kirmizi").length;
  const kullanimYuzde = toplamButce > 0 ? Math.round((toplamHarcanan / toplamButce) * 100) : 0;

  const kpiler: ProjeKpi[] = [
    { anahtar: "aktif", baslik: "Aktif Proje", deger: String(aktif), altMetin: "Devam eden proje sayısı" },
    { anahtar: "butce", baslik: "Toplam Proje Bütçesi", deger: trOnd(toplamButce / 1e6, 2), birim: "M TL", altMetin: "Onaylı toplam bütçe" },
    { anahtar: "harcama", baslik: "Gerçekleşen Harcama", deger: trOnd(toplamHarcanan / 1e6, 2), birim: "M TL", altMetin: `Bütçenin %${kullanimYuzde}'i`, ilerleme: kullanimYuzde },
    { anahtar: "planlanan", baslik: "Planlanan Tasarruf", deger: trOnd(planlanan, 1), birim: "TEP / yıl", altMetin: "Toplam beklenti" },
    { anahtar: "dogrulanan", baslik: "Doğrulanan Tasarruf", deger: trOnd(dogrulanan, 1), birim: "TEP / yıl", altMetin: "Gerçekleşen tasarruf" },
    { anahtar: "zamaninda", baslik: "Zamanında İlerleyen", deger: `${zamaninda} / ${satirlar.length}`, altMetin: `${satirlar.length - zamaninda} proje gecikmede` },
  ];

  const asamalar: ProjeAsama[] = ASAMA_META.map((m) => ({
    anahtar: m.anahtar,
    etiket: m.etiket,
    ikon: m.ikon,
    adet: satirlar.filter((s) => s.durum === m.anahtar).length,
  }));

  // Gantt penceresi: en erken başlangıç → en geç hedef bitiş
  const baslar = satirlar.map((s) => isoYap(s.baslangic)).filter(Boolean) as Date[];
  const bitisler = satirlar.map((s) => isoYap(s.hedef_bitis)).filter(Boolean) as Date[];
  let gantt: ProjeGantt[] = [];
  let ganttEksen: string[] = [];
  let ganttBugun = 0;
  if (baslar.length && bitisler.length) {
    const pencereBas = new Date(Math.min(...baslar.map((d) => d.getTime())));
    const pencereBit = new Date(Math.max(...bitisler.map((d) => d.getTime())));
    const toplamGun = Math.max(1, (pencereBit.getTime() - pencereBas.getTime()) / GUN);
    const yuzde = (d: Date) => ((d.getTime() - pencereBas.getTime()) / GUN / toplamGun) * 100;

    gantt = satirlar
      .filter((s) => s.baslangic && s.hedef_bitis)
      .map((s, i) => {
        const b = isoYap(s.baslangic)!;
        const e = isoYap(s.hedef_bitis)!;
        return {
          id: s.id,
          ad: s.ad,
          renk: RENKLER[i % RENKLER.length],
          sol: Math.round(yuzde(b) * 10) / 10,
          genislik: Math.round((yuzde(e) - yuzde(b)) * 10) / 10,
        };
      });

    // Aylık eksen etiketleri
    const ekYil = pencereBas.getFullYear();
    const ekAy = pencereBas.getMonth();
    const aySayisi =
      (pencereBit.getFullYear() - ekYil) * 12 + (pencereBit.getMonth() - ekAy) + 1;
    ganttEksen = Array.from({ length: aySayisi }, (_, i) => {
      const m = (ekAy + i) % 12;
      const y = ekYil + Math.floor((ekAy + i) / 12);
      return `${AY_KISA[m]} '${String(y).slice(-2)}`;
    });

    const bugun = new Date();
    ganttBugun = Math.max(0, Math.min(100, Math.round(yuzde(bugun) * 10) / 10));
  }

  const butce = {
    toplam: Math.round((toplamButce / 1e6) * 100) / 100,
    kullanimYuzde,
    dilimler: [
      { etiket: "Gerçekleşen Harcama", deger: Math.round((toplamHarcanan / 1e6) * 100) / 100, renk: "#14b8a6" },
      { etiket: "Serbest Bütçe", deger: Math.round(((toplamButce - toplamHarcanan) / 1e6) * 100) / 100, renk: "#cbd5e1" },
    ] as ProjeButceKalem[],
    kalemler: [
      { etiket: "Toplam Onaylı Bütçe", deger: Math.round((toplamButce / 1e6) * 100) / 100, renk: "#0f766e" },
      { etiket: "Gerçekleşen Harcama", deger: Math.round((toplamHarcanan / 1e6) * 100) / 100, renk: "#14b8a6" },
      { etiket: "Kalan Bütçe", deger: Math.round(((toplamButce - toplamHarcanan) / 1e6) * 100) / 100, renk: "#cbd5e1" },
    ] as ProjeButceKalem[],
  };

  // Dikkat: sağlığı amber/kırmızı olan (tamamlanmamış) projeler
  const dikkat: ProjeDikkatMadde[] = satirlar
    .filter((s) => s.durum !== "tamamlandi" && [s.saglik_zaman, s.saglik_butce].some((r) => r === "amber" || r === "kirmizi"))
    .map((s) => {
      const alan = s.saglik_zaman === "kirmizi" || s.saglik_zaman === "amber" ? "Zaman" : "Bütçe";
      return { id: s.id, proje: s.ad, mesaj: `${alan} açısından takip gerektiriyor.`, kaynak: s.kaynak };
    });

  return {
    kpiler,
    projeler,
    asamalar,
    gantt,
    ganttEksen,
    ganttBugun,
    butce,
    tasarruf: { planlanan: Math.round(planlanan * 10) / 10, dogrulanan: Math.round(dogrulanan * 10) / 10 },
    dikkat,
  };
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export type ProjeGirdi = {
  ad: string;
  aciklama?: string;
  kaynak: ProjeKaynak;
  durum: ProjeDurum;
  ilerleme: number;
  baslangic?: string | null; // YYYY-MM-DD
  hedefBitis?: string | null;
  sorumlu?: string;
  butce: number;
  harcanan: number;
  beklenenTasarruf: number;
  dogrulananTasarruf?: number | null;
  geriDonus: number;
};

function girdidenSatir(g: ProjeGirdi) {
  return {
    ad: g.ad.trim(),
    aciklama: g.aciklama ?? null,
    kaynak: g.kaynak,
    durum: g.durum,
    ilerleme: g.ilerleme,
    baslangic: g.baslangic || null,
    hedef_bitis: g.hedefBitis || null,
    sorumlu: g.sorumlu ?? null,
    butce: g.butce,
    harcanan: g.harcanan,
    beklenen_tasarruf: g.beklenenTasarruf,
    dogrulanan_tasarruf: g.dogrulananTasarruf ?? null,
    geri_donus: g.geriDonus,
  };
}

export async function projeEkle(g: ProjeGirdi): Promise<void> {
  const { error } = await supabaseTarayici().from("projeler").insert(girdidenSatir(g));
  if (error) throw new Error(error.message);
}

export async function projeGuncelle(id: string, g: ProjeGirdi): Promise<void> {
  const { error } = await supabaseTarayici().from("projeler").update(girdidenSatir(g)).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function projeSil(id: string): Promise<void> {
  const { error } = await supabaseTarayici().rpc("proje_sil", { p_id: id });
  if (error) throw new Error(error.message);
}
