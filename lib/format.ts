// Türkçe yerel biçimlendirme yardımcıları.

const sayiTR = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
const sayiTR1 = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const sayiTR2 = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const paraTR = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

/** 12.345 → "12.345" */
export function sayi(n: number): string {
  return sayiTR.format(n);
}

/** 12.3 → "12,3" */
export function sayiOndalik(n: number): string {
  return sayiTR1.format(n);
}

/** 7.84 → "7,84" */
export function sayi2(n: number): string {
  return sayiTR2.format(n);
}

/** 12345 → "₺12.345" */
export function para(n: number): string {
  return paraTR.format(n);
}

/** Değer + birim, ör. sayi=12.345, birim="kWh" → "12.345 kWh" */
export function birimli(n: number, birim: string): string {
  return `${sayi(n)} ${birim}`;
}

/** Grafik eksenleri için kısa gösterim: 1.200.000 → "1,2 Mn", 300.000 → "300 B". */
export function sayiKisa(n: number): string {
  const a = Math.abs(n);
  if (a >= 1_000_000_000) return `${sayiOndalik(n / 1_000_000_000)} Mr`;
  if (a >= 1_000_000) return `${sayiOndalik(n / 1_000_000)} Mn`;
  if (a >= 1_000) return `${sayi(Math.round(n / 1000))} B`;
  return sayi(n);
}
