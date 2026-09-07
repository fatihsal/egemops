// Dönem (tarih aralığı) modeli — gösterge panosunun tek zaman kontrolü.
// Segmented seçici (Gün/Hafta/Ay/Özel) bu tipleri üretir; veri katmanı da
// aynı tipi alıp döneme uygun veri döndürür.

import {
  differenceInCalendarDays,
  format,
  startOfDay,
  subDays,
} from "date-fns";
import { tr } from "date-fns/locale";

export type DonemTuru = "gun" | "hafta" | "ay" | "ozel";

export interface Donem {
  tur: DonemTuru;
  baslangic: string; // yyyy-MM-dd
  bitis: string; // yyyy-MM-dd
}

// Demo verisi buna göre üretilir; gerçek uygulamada `new Date()` olur.
export const BUGUN = startOfDay(new Date("2026-08-26T00:00:00"));

function gunStr(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

/** Hazır dönemler (Gün/Hafta/Ay). */
export function donemOlustur(tur: Exclude<DonemTuru, "ozel">): Donem {
  if (tur === "gun") {
    return { tur, baslangic: gunStr(BUGUN), bitis: gunStr(BUGUN) };
  }
  const gun = tur === "hafta" ? 6 : 29;
  return { tur, baslangic: gunStr(subDays(BUGUN, gun)), bitis: gunStr(BUGUN) };
}

/** Takvimden seçilen özel aralık. */
export function ozelDonem(baslangic: Date, bitis: Date): Donem {
  return { tur: "ozel", baslangic: gunStr(baslangic), bitis: gunStr(bitis) };
}

export function varsayilanDonem(): Donem {
  return donemOlustur("hafta");
}

export function donemGunSayisi(d: Donem): number {
  return (
    differenceInCalendarDays(new Date(d.bitis), new Date(d.baslangic)) + 1
  );
}

/** Başlıkta gösterilecek okunur etiket. */
export function donemEtiket(d: Donem): string {
  switch (d.tur) {
    case "gun":
      return "Bugün";
    case "hafta":
      return "Bu hafta";
    case "ay":
      return "Bu ay";
    case "ozel":
      return `${format(new Date(d.baslangic), "d MMM", { locale: tr })} – ${format(
        new Date(d.bitis),
        "d MMM",
        { locale: tr },
      )}`;
  }
}
