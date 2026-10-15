// -----------------------------------------------------------------------------
// BAKIM — Planlı İş Emirleri sayfası (yönetim paneli) — mock
// -----------------------------------------------------------------------------

import { gecikmeIle } from "@/lib/data/mock-utils";

export type IsEmriSayfaDurum =
  | "planlamaBekliyor"
  | "tarihKesinlesti"
  | "bakimaHazir"
  | "bakimYapiliyor"
  | "tamamlandi"
  | "gecikme";

export interface IsEmriSatir {
  no: number;
  isEmriNo: string;
  makine: string;
  bakimAd: string;
  periyot: string; // "3 Aylık" | "6 Aylık" | "12 Aylık"
  kesinTarih: string;
  planlananTarih: string;
  sopRev: string; // "R.4"
  sopKodu: string; // "SOP-LM2-6A Rev.4"
  durusSaat: number;
  toplam: number;
  yapilan: number;
  yapiliyor: number;
  durum: IsEmriSayfaDurum;
  atananlar: string[]; // teknisyen adları
}

export const IS_EMRI_EKIP = ["Mehmet Kaya", "Ali Demir", "Serkan Çelik", "Mustafa Arslan", "Murat Şahin"];

export const SOP_MADDE_HAVUZ = [
  "Makine genel temizlik",
  "Vakum filtresi kontrolü",
  "Zincir yağlama",
  "Kayış gerginlik kontrolü",
  "Sensör temizliği",
  "Elektrik panosu kontrolü",
  "Rulman kontrolü",
  "Pnömatik hat kontrolü",
  "Hidrolik seviye kontrolü",
  "Acil stop testi",
  "Emniyet switch kontrolü",
  "Merdane yüzey kontrolü",
  "Tahrik sistemi kontrolü",
  "Soğutma fanı kontrolü",
  "Yağ değişimi",
  "Genel çalışma testi",
];

export const IS_EMIRLERI_SAYFA: IsEmriSatir[] = [
  { no: 1, isEmriNo: "İE-2026-0048", makine: "Lemanic-2", bakimAd: "Genel Bakım", periyot: "6 Aylık", kesinTarih: "22.10.2026", planlananTarih: "20.10.2026", sopRev: "R.4", sopKodu: "SOP-LM2-6A Rev.4", durusSaat: 8, toplam: 37, yapilan: 22, yapiliyor: 2, durum: "bakimYapiliyor", atananlar: ["Mehmet Kaya", "Ali Demir", "Serkan Çelik"] },
  { no: 2, isEmriNo: "İE-2026-0049", makine: "Rotomec-1", bakimAd: "Vakum Pompası Kontrolü", periyot: "3 Aylık", kesinTarih: "24.10.2026", planlananTarih: "22.10.2026", sopRev: "R.2", sopKodu: "SOP-RT1-3A Rev.2", durusSaat: 4, toplam: 18, yapilan: 0, yapiliyor: 0, durum: "bakimaHazir", atananlar: ["Ali Demir", "Serkan Çelik"] },
  { no: 3, isEmriNo: "İE-2026-0050", makine: "Foilmaster", bakimAd: "Genel Kontrol", periyot: "12 Aylık", kesinTarih: "28.10.2026", planlananTarih: "26.10.2026", sopRev: "R.3", sopKodu: "SOP-FM-12A Rev.3", durusSaat: 12, toplam: 46, yapilan: 0, yapiliyor: 0, durum: "tarihKesinlesti", atananlar: ["Mehmet Kaya", "Ali Demir"] },
  { no: 4, isEmriNo: "İE-2026-0051", makine: "SP 104-ER", bakimAd: "Filtre Temizliği", periyot: "6 Aylık", kesinTarih: "03.11.2026", planlananTarih: "01.11.2026", sopRev: "R.2", sopKodu: "SOP-SP104-6A Rev.2", durusSaat: 3, toplam: 25, yapilan: 0, yapiliyor: 0, durum: "planlamaBekliyor", atananlar: ["Ali Demir"] },
  { no: 5, isEmriNo: "İE-2026-0052", makine: "Lemanic-1", bakimAd: "Mekanik Kontrol", periyot: "3 Aylık", kesinTarih: "05.11.2026", planlananTarih: "03.11.2026", sopRev: "R.3", sopKodu: "SOP-LM1-3A Rev.3", durusSaat: 4, toplam: 32, yapilan: 0, yapiliyor: 0, durum: "planlamaBekliyor", atananlar: ["Mehmet Kaya", "Serkan Çelik"] },
  { no: 6, isEmriNo: "İE-2026-0053", makine: "Expertcut 106-PER", bakimAd: "Kayış Kontrolü", periyot: "3 Aylık", kesinTarih: "10.11.2026", planlananTarih: "08.11.2026", sopRev: "R.1", sopKodu: "SOP-EXP-3A Rev.1", durusSaat: 3, toplam: 20, yapilan: 0, yapiliyor: 0, durum: "planlamaBekliyor", atananlar: ["Ali Demir"] },
  { no: 7, isEmriNo: "İE-2026-0054", makine: "Lemanic-3", bakimAd: "Elektrik Panosu", periyot: "6 Aylık", kesinTarih: "12.11.2026", planlananTarih: "10.11.2026", sopRev: "R.2", sopKodu: "SOP-LM3-6A Rev.2", durusSaat: 5, toplam: 34, yapilan: 0, yapiliyor: 0, durum: "tarihKesinlesti", atananlar: ["Mehmet Kaya", "Ali Demir", "Serkan Çelik"] },
  { no: 8, isEmriNo: "İE-2026-0055", makine: "Spanthera 106-LER", bakimAd: "Zincir Gerginlik", periyot: "3 Aylık", kesinTarih: "15.11.2026", planlananTarih: "13.11.2026", sopRev: "R.2", sopKodu: "SOP-SPN-3A Rev.2", durusSaat: 3, toplam: 28, yapilan: 0, yapiliyor: 0, durum: "bakimaHazir", atananlar: ["Serkan Çelik"] },
  { no: 9, isEmriNo: "İE-2026-0056", makine: "Rotomec-2", bakimAd: "Genel Bakım", periyot: "12 Aylık", kesinTarih: "18.11.2026", planlananTarih: "16.11.2026", sopRev: "R.4", sopKodu: "SOP-RT2-12A Rev.4", durusSaat: 10, toplam: 51, yapilan: 6, yapiliyor: 0, durum: "bakimYapiliyor", atananlar: ["Mehmet Kaya", "Ali Demir"] },
  { no: 10, isEmriNo: "İE-2026-0057", makine: "SP Evoline 102 E-Plus", bakimAd: "Pnömatik Sistem", periyot: "6 Aylık", kesinTarih: "22.11.2026", planlananTarih: "20.11.2026", sopRev: "R.2", sopKodu: "SOP-SP102-6A Rev.2", durusSaat: 4, toplam: 30, yapilan: 0, yapiliyor: 0, durum: "gecikme", atananlar: ["Ali Demir", "Serkan Çelik"] },
];

export function isEmriSayfaGetir(): Promise<IsEmriSatir[]> {
  return gecikmeIle(IS_EMIRLERI_SAYFA);
}
