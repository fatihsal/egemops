// -----------------------------------------------------------------------------
// BAKIM — tarih & periyodik tekrar yardımcıları.
// Planların periyoduna göre takvim olaylarını türetir.
// -----------------------------------------------------------------------------

import type { BakimPeriyot, BakimPlani } from "@/lib/types/bakim";

/** "gg.aa.yyyy" → Date (yerel, gün başı). */
export function tarihAyristir(s: string): Date {
  const [g, a, y] = s.split(".").map(Number);
  return new Date(y, (a ?? 1) - 1, g ?? 1);
}

/** Date → "gg.aa.yyyy". */
export function tarihBicim(d: Date): string {
  const g = String(d.getDate()).padStart(2, "0");
  const a = String(d.getMonth() + 1).padStart(2, "0");
  return `${g}.${a}.${d.getFullYear()}`;
}

/** Aynı gün mü (yıl/ay/gün). */
export function ayniGun(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const AY_ADIM: Record<Exclude<BakimPeriyot, "haftalik" | "ozel">, number> = {
  aylik: 1,
  "3aylik": 3,
  "6aylik": 6,
  yillik: 12,
};

/** Planın verilen ay (yıl, ay 0-tabanlı) içindeki tüm oluşum tarihleri. */
export function planAyOlusumlari(plan: BakimPlani, yil: number, ay: number): Date[] {
  const capa = tarihAyristir(plan.baslangic);
  const ilk = new Date(yil, ay, 1);
  const son = new Date(yil, ay + 1, 0);
  const sonuc: Date[] = [];

  if (plan.periyot === "haftalik" || plan.periyot === "ozel") {
    const adim = plan.periyot === "haftalik" ? 7 : Math.max(1, plan.ozelGun ?? 30);
    const d = new Date(capa);
    // Güvenlik: çok eski çapalarda döngüyü hızlandırmadan basitçe ilerlet (planlar 2026 içi).
    while (d <= son) {
      if (d >= ilk) sonuc.push(new Date(d));
      d.setDate(d.getDate() + adim);
    }
    return sonuc;
  }

  const adimAy = AY_ADIM[plan.periyot];
  const capaIdx = capa.getFullYear() * 12 + capa.getMonth();
  const curIdx = yil * 12 + ay;
  if (curIdx < capaIdx) return sonuc;
  if ((curIdx - capaIdx) % adimAy === 0) {
    const gun = Math.min(capa.getDate(), son.getDate());
    sonuc.push(new Date(yil, ay, gun));
  }
  return sonuc;
}

/** Verilen tarihten itibaren (dahil) planın bir sonraki oluşumu. */
export function planSonrakiOlusum(plan: BakimPlani, baslangic: Date): Date {
  const capa = tarihAyristir(plan.baslangic);
  const d = new Date(capa);
  const bas = new Date(baslangic.getFullYear(), baslangic.getMonth(), baslangic.getDate());
  if (plan.periyot === "haftalik" || plan.periyot === "ozel") {
    const adim = plan.periyot === "haftalik" ? 7 : Math.max(1, plan.ozelGun ?? 30);
    while (d < bas) d.setDate(d.getDate() + adim);
    return d;
  }
  const adimAy = AY_ADIM[plan.periyot];
  while (d < bas) d.setMonth(d.getMonth() + adimAy);
  return d;
}

/** Ay ızgarası: Pazartesi başlangıçlı, 6 satır × 7 gün (önceki/sonraki ay taşmaları dahil). */
export function ayIzgarasi(yil: number, ay: number): Date[] {
  const ilk = new Date(yil, ay, 1);
  // JS: 0=Pazar … 6=Cumartesi → Pazartesi başlangıcına çevir (0=Pzt … 6=Paz)
  const haftaGunu = (ilk.getDay() + 6) % 7;
  const bas = new Date(yil, ay, 1 - haftaGunu);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(bas);
    d.setDate(bas.getDate() + i);
    return d;
  });
}

export const AY_ADLARI = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export const GUN_KISA = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
