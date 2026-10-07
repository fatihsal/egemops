// -----------------------------------------------------------------------------
// BAKIM — Bakım Planları (mock)
// Her plan bir makineye bağlı, periyodik tekrar eden bakım tanımıdır.
// Takvim olayları bu planlardan türetilir (lib/bakim/tarih.ts).
// -----------------------------------------------------------------------------

import type { BakimPlani } from "@/lib/types/bakim";
import { gecikmeIle } from "@/lib/data/mock-utils";

export const BAKIM_PLANLARI: BakimPlani[] = [
  // Lemanic-1
  { id: "bp-001", makineId: "mk-lemanic1", ad: "Haftalık Operatör Kontrolü", bakimTuru: "Operatör Kontrolü", periyot: "haftalik", baslangic: "05.01.2026", sorumlu: "Üretim Operatörü", tahminiSureSaat: 0.5, kritiklik: "dusuk" },
  { id: "bp-002", makineId: "mk-lemanic1", ad: "Aylık Genel Bakım", bakimTuru: "Genel Bakım", periyot: "aylik", baslangic: "05.01.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 2, kritiklik: "orta" },
  { id: "bp-003", makineId: "mk-lemanic1", ad: "3 Aylık Mekanik Bakım", bakimTuru: "Mekanik Bakım", periyot: "3aylik", baslangic: "15.01.2026", sorumlu: "Mehmet Y. (Mekanik)", tahminiSureSaat: 4, kritiklik: "orta" },
  { id: "bp-004", makineId: "mk-lemanic1", ad: "Yıllık Kapsamlı Bakım (SOP)", bakimTuru: "Kapsamlı Bakım", periyot: "yillik", baslangic: "20.02.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 8, kritiklik: "yuksek", sopId: "sop-lemanic" },
  // Lemanic-2
  { id: "bp-005", makineId: "mk-lemanic2", ad: "Haftalık Operatör Kontrolü", bakimTuru: "Operatör Kontrolü", periyot: "haftalik", baslangic: "06.01.2026", sorumlu: "Üretim Operatörü", tahminiSureSaat: 0.5, kritiklik: "dusuk" },
  { id: "bp-006", makineId: "mk-lemanic2", ad: "Aylık Genel Bakım", bakimTuru: "Genel Bakım", periyot: "aylik", baslangic: "12.01.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 2, kritiklik: "orta" },
  { id: "bp-007", makineId: "mk-lemanic2", ad: "6 Aylık Elektrik Bakımı", bakimTuru: "Elektrik Bakımı", periyot: "6aylik", baslangic: "10.03.2026", sorumlu: "Ali K. (Elektrik)", tahminiSureSaat: 5, kritiklik: "yuksek" },
  // Lemanic-3
  { id: "bp-008", makineId: "mk-lemanic3", ad: "Haftalık Operatör Kontrolü", bakimTuru: "Operatör Kontrolü", periyot: "haftalik", baslangic: "07.01.2026", sorumlu: "Üretim Operatörü", tahminiSureSaat: 0.5, kritiklik: "dusuk" },
  { id: "bp-009", makineId: "mk-lemanic3", ad: "Aylık Genel Bakım", bakimTuru: "Genel Bakım", periyot: "aylik", baslangic: "15.01.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 2, kritiklik: "orta" },
  // SP Evoline 102
  { id: "bp-010", makineId: "mk-sp102", ad: "Haftalık Operatör Kontrolü", bakimTuru: "Operatör Kontrolü", periyot: "haftalik", baslangic: "08.01.2026", sorumlu: "Üretim Operatörü", tahminiSureSaat: 0.5, kritiklik: "dusuk" },
  { id: "bp-011", makineId: "mk-sp102", ad: "3 Aylık Bıçak & Kalıp Bakımı", bakimTuru: "Mekanik Bakım", periyot: "3aylik", baslangic: "21.01.2026", sorumlu: "Mehmet Y. (Mekanik)", tahminiSureSaat: 3, kritiklik: "orta" },
  // SP 104-ER
  { id: "bp-012", makineId: "mk-sp104", ad: "Aylık Genel Bakım", bakimTuru: "Genel Bakım", periyot: "aylik", baslangic: "19.01.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 2, kritiklik: "orta" },
  { id: "bp-013", makineId: "mk-sp104", ad: "6 Aylık Mekanik Bakım", bakimTuru: "Mekanik Bakım", periyot: "6aylik", baslangic: "19.04.2026", sorumlu: "Mehmet Y. (Mekanik)", tahminiSureSaat: 4, kritiklik: "yuksek" },
  // Expertcut 106
  { id: "bp-014", makineId: "mk-expertcut", ad: "Haftalık Operatör Kontrolü", bakimTuru: "Operatör Kontrolü", periyot: "haftalik", baslangic: "09.01.2026", sorumlu: "Üretim Operatörü", tahminiSureSaat: 0.5, kritiklik: "dusuk" },
  { id: "bp-015", makineId: "mk-expertcut", ad: "Aylık Genel Bakım", bakimTuru: "Genel Bakım", periyot: "aylik", baslangic: "21.01.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 2, kritiklik: "orta" },
  // Spanthera 106
  { id: "bp-016", makineId: "mk-spanthera", ad: "Haftalık Operatör Kontrolü", bakimTuru: "Operatör Kontrolü", periyot: "haftalik", baslangic: "05.01.2026", sorumlu: "Üretim Operatörü", tahminiSureSaat: 0.5, kritiklik: "dusuk" },
  { id: "bp-017", makineId: "mk-spanthera", ad: "Aylık Baskı Ünitesi Bakımı", bakimTuru: "Baskı Bakımı", periyot: "aylik", baslangic: "10.01.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 3, kritiklik: "orta" },
  { id: "bp-018", makineId: "mk-spanthera", ad: "Yıllık Kapsamlı Bakım (SOP)", bakimTuru: "Kapsamlı Bakım", periyot: "yillik", baslangic: "10.03.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 8, kritiklik: "yuksek", sopId: "sop-spanthera" },
  // Foilmaster
  { id: "bp-019", makineId: "mk-foilmaster", ad: "Aylık Genel Bakım", bakimTuru: "Genel Bakım", periyot: "aylik", baslangic: "15.01.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 2, kritiklik: "orta" },
  { id: "bp-020", makineId: "mk-foilmaster", ad: "6 Aylık Yaldız Ünitesi Bakımı", bakimTuru: "Mekanik Bakım", periyot: "6aylik", baslangic: "15.02.2026", sorumlu: "Mehmet Y. (Mekanik)", tahminiSureSaat: 5, kritiklik: "yuksek" },
  // Expertfoil
  { id: "bp-021", makineId: "mk-expertfoil", ad: "Aylık Genel Bakım", bakimTuru: "Genel Bakım", periyot: "aylik", baslangic: "01.01.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 2, kritiklik: "orta" },
  // Rotomec-1
  { id: "bp-022", makineId: "mk-rotomec1", ad: "Haftalık Operatör Kontrolü", bakimTuru: "Operatör Kontrolü", periyot: "haftalik", baslangic: "02.01.2026", sorumlu: "Üretim Operatörü", tahminiSureSaat: 0.5, kritiklik: "dusuk" },
  { id: "bp-023", makineId: "mk-rotomec1", ad: "Aylık Genel Bakım", bakimTuru: "Genel Bakım", periyot: "aylik", baslangic: "16.01.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 2, kritiklik: "orta" },
  // Rotomec-2
  { id: "bp-024", makineId: "mk-rotomec2", ad: "Aylık Genel Bakım", bakimTuru: "Genel Bakım", periyot: "aylik", baslangic: "29.01.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 2, kritiklik: "orta" },
  // Focusight Shark 500
  { id: "bp-025", makineId: "mk-focusight", ad: "Aylık Kamera & Sensör Kontrolü", bakimTuru: "Kalibrasyon", periyot: "aylik", baslangic: "07.01.2026", sorumlu: "Ali K. (Elektrik)", tahminiSureSaat: 1, kritiklik: "orta" },
  { id: "bp-026", makineId: "mk-focusight", ad: "6 Aylık Kalibrasyon & Bakım", bakimTuru: "Kalibrasyon", periyot: "6aylik", baslangic: "07.01.2026", sorumlu: "Ali K. (Elektrik)", tahminiSureSaat: 3, kritiklik: "yuksek" },
  // KBA Exit Elevator
  { id: "bp-027", makineId: "mk-kba-exit", ad: "Aylık Genel Bakım", bakimTuru: "Genel Bakım", periyot: "aylik", baslangic: "01.01.2026", sorumlu: "Bakım Onarım", tahminiSureSaat: 1, kritiklik: "dusuk" },
];

export function planlariGetir(): Promise<BakimPlani[]> {
  return gecikmeIle(BAKIM_PLANLARI);
}

export function planGetir(id: string): Promise<BakimPlani | undefined> {
  return gecikmeIle(BAKIM_PLANLARI.find((p) => p.id === id));
}

export function makinePlanlariGetir(makineId: string): Promise<BakimPlani[]> {
  return gecikmeIle(BAKIM_PLANLARI.filter((p) => p.makineId === makineId));
}
