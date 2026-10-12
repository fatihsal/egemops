// -----------------------------------------------------------------------------
// BAKIM — Bakım Planları sayfası (yönetim paneli) — mock
// -----------------------------------------------------------------------------

import { gecikmeIle } from "@/lib/data/mock-utils";

export type PlanSayfaDurum = "aktif" | "devam" | "tamamlandi" | "gecikme" | "planlamaBekliyor";
export type GanttTip = "3aylik" | "6aylik" | "12aylik" | "haftalik" | "planlamaBekliyor" | "gecikme";

export interface MakinePlanKart {
  makineId: string;
  ad: string;
  kod: string;
  yuzde: number;
  planSayi: number;
  gecikme: number;
}
export interface GanttSatir {
  makine: string;
  cubuklar: { bas: number; bit: number; tip: GanttTip }[];
}
export interface PlanKayit {
  no: number;
  makine: string;
  bakimAd: string;
  periyot: string; // "3 Aylık" | "6 Aylık" | "12 Aylık"
  sorumlu: string;
  planlananTarih: string;
  durum: PlanSayfaDurum;
  tamamlanma: number;
  sonTamamlanma: string;
}
export interface PlanSayfaAnaliz {
  makineKartlari: MakinePlanKart[];
  gantt: GanttSatir[];
  kayitlar: PlanKayit[];
}

const ANALIZ: PlanSayfaAnaliz = {
  makineKartlari: [
    { makineId: "mk-lemanic1", ad: "Lemanic-1", kod: "LMN-001", yuzde: 92, planSayi: 12, gecikme: 2 },
    { makineId: "mk-lemanic2", ad: "Lemanic-2", kod: "LMN-002", yuzde: 76, planSayi: 10, gecikme: 2 },
    { makineId: "mk-lemanic3", ad: "Lemanic-3", kod: "LMN-003", yuzde: 88, planSayi: 11, gecikme: 1 },
    { makineId: "mk-sp102", ad: "SP Evoline 102 E-Plus", kod: "SP-102", yuzde: 85, planSayi: 9, gecikme: 1 },
    { makineId: "mk-sp104", ad: "SP 104-ER", kod: "SP-104", yuzde: 90, planSayi: 8, gecikme: 0 },
    { makineId: "mk-expertcut", ad: "Expertcut 106-PER", kod: "EXP-106", yuzde: 78, planSayi: 7, gecikme: 2 },
    { makineId: "mk-spanthera", ad: "Spanthera 106-LER", kod: "SPN-106", yuzde: 83, planSayi: 9, gecikme: 1 },
    { makineId: "mk-foilmaster", ad: "Foilmaster", kod: "FM-001", yuzde: 72, planSayi: 8, gecikme: 3 },
    { makineId: "mk-rotomec1", ad: "Rotomec-1", kod: "ROT-001", yuzde: 86, planSayi: 7, gecikme: 1 },
    { makineId: "mk-rotomec2", ad: "Rotomec-2", kod: "ROT-002", yuzde: 91, planSayi: 6, gecikme: 0 },
    { makineId: "mk-focusight", ad: "Focusight Shark 500", kod: "FS-500", yuzde: 95, planSayi: 6, gecikme: 0 },
    { makineId: "mk-kba-exit", ad: "KBA Exit Elevator", kod: "KBA-EE", yuzde: 90, planSayi: 4, gecikme: 0 },
  ],
  gantt: [
    { makine: "Lemanic-1", cubuklar: [{ bas: 2, bit: 5, tip: "haftalik" }, { bas: 6, bit: 9, tip: "3aylik" }, { bas: 23, bit: 25, tip: "12aylik" }] },
    { makine: "Lemanic-2", cubuklar: [{ bas: 12, bit: 14, tip: "6aylik" }, { bas: 18, bit: 21, tip: "12aylik" }] },
    { makine: "SP 104-ER", cubuklar: [{ bas: 4, bit: 6, tip: "haftalik" }, { bas: 11, bit: 13, tip: "planlamaBekliyor" }, { bas: 23, bit: 26, tip: "haftalik" }] },
    { makine: "Foilmaster", cubuklar: [{ bas: 9, bit: 12, tip: "haftalik" }, { bas: 15, bit: 17, tip: "gecikme" }, { bas: 20, bit: 22, tip: "haftalik" }] },
    { makine: "Rotomec-1", cubuklar: [{ bas: 13, bit: 16, tip: "12aylik" }, { bas: 26, bit: 27, tip: "haftalik" }, { bas: 28, bit: 30, tip: "planlamaBekliyor" }] },
  ],
  kayitlar: [
    { no: 1, makine: "Lemanic-1", bakimAd: "Mekanik Kontrol", periyot: "3 Aylık", sorumlu: "Ahmet Yılmaz", planlananTarih: "10.10.2026", durum: "aktif", tamamlanma: 80, sonTamamlanma: "12.07.2026" },
    { no: 2, makine: "Lemanic-1", bakimAd: "Elektrik Panosu Kontrolü", periyot: "6 Aylık", sorumlu: "Mehmet Kaya", planlananTarih: "15.10.2026", durum: "devam", tamamlanma: 40, sonTamamlanma: "20.04.2026" },
    { no: 3, makine: "Lemanic-2", bakimAd: "Pnömatik Sistem Kontrolü", periyot: "3 Aylık", sorumlu: "Ali Demir", planlananTarih: "05.10.2026", durum: "tamamlandi", tamamlanma: 100, sonTamamlanma: "05.10.2026" },
    { no: 4, makine: "SP 104-ER", bakimAd: "Filtre Temizliği", periyot: "3 Aylık", sorumlu: "Mustafa Arslan", planlananTarih: "08.10.2026", durum: "gecikme", tamamlanma: 0, sonTamamlanma: "15.06.2026" },
    { no: 5, makine: "Foilmaster", bakimAd: "Genel Kontrol", periyot: "12 Aylık", sorumlu: "Ali Demir", planlananTarih: "01.11.2026", durum: "planlamaBekliyor", tamamlanma: 0, sonTamamlanma: "01.11.2025" },
    { no: 6, makine: "Rotomec-1", bakimAd: "Vakum Pompası Kontrolü", periyot: "6 Aylık", sorumlu: "Serkan Çelik", planlananTarih: "20.10.2026", durum: "devam", tamamlanma: 60, sonTamamlanma: "18.04.2026" },
    { no: 7, makine: "Expertcut 106-PER", bakimAd: "Kayış Kontrolü", periyot: "3 Aylık", sorumlu: "Murat Şahin", planlananTarih: "09.10.2026", durum: "tamamlandi", tamamlanma: 100, sonTamamlanma: "09.10.2026" },
    { no: 8, makine: "Spanthera 106-LER", bakimAd: "Zincir Gerginlik Kontrolü", periyot: "3 Aylık", sorumlu: "Ali Demir", planlananTarih: "14.10.2026", durum: "aktif", tamamlanma: 20, sonTamamlanma: "18.07.2026" },
    { no: 9, makine: "Lemanic-3", bakimAd: "Rulman Yağlama", periyot: "3 Aylık", sorumlu: "Hasan Doğan", planlananTarih: "12.10.2026", durum: "aktif", tamamlanma: 55, sonTamamlanma: "10.07.2026" },
    { no: 10, makine: "Foilmaster", bakimAd: "Yaldız Ünitesi Bakımı", periyot: "6 Aylık", sorumlu: "Mehmet Kaya", planlananTarih: "15.10.2026", durum: "devam", tamamlanma: 35, sonTamamlanma: "15.04.2026" },
    { no: 11, makine: "Focusight Shark 500", bakimAd: "Kamera Kalibrasyonu", periyot: "6 Aylık", sorumlu: "Ali Demir", planlananTarih: "07.01.2027", durum: "tamamlandi", tamamlanma: 100, sonTamamlanma: "07.07.2026" },
    { no: 12, makine: "SP Evoline 102 E-Plus", bakimAd: "Bıçak & Kalıp Bakımı", periyot: "3 Aylık", sorumlu: "Mustafa Arslan", planlananTarih: "21.10.2026", durum: "aktif", tamamlanma: 45, sonTamamlanma: "21.07.2026" },
    { no: 13, makine: "Rotomec-2", bakimAd: "Genel Bakım", periyot: "3 Aylık", sorumlu: "Serkan Çelik", planlananTarih: "16.10.2026", durum: "devam", tamamlanma: 70, sonTamamlanma: "16.07.2026" },
    { no: 14, makine: "Expertfoil", bakimAd: "Genel Bakım", periyot: "3 Aylık", sorumlu: "Murat Şahin", planlananTarih: "01.12.2026", durum: "planlamaBekliyor", tamamlanma: 0, sonTamamlanma: "01.09.2026" },
  ],
};

export function planSayfaGetir(): Promise<PlanSayfaAnaliz> {
  return gecikmeIle(ANALIZ);
}
