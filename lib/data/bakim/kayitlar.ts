// -----------------------------------------------------------------------------
// BAKIM — Bakım Kayıtları (tamamlanan bakımların arşivi) — mock
// -----------------------------------------------------------------------------

import type { BakimKayit } from "@/lib/types/bakim";
import { gecikmeIle } from "@/lib/data/mock-utils";

export const BAKIM_KAYITLARI: BakimKayit[] = [
  { id: "k-01", formNo: "WO-2026-0139", tarih: "19.09.2026", makineId: "mk-sp104", makineAd: "SP 104-ER", bakimTuru: "Aylık Genel Bakım", periyot: "aylik", kaynak: "teknik", yapan: "Mehmet Y.", sureSaat: 2, sonuc: "uygun", bulguSayi: 0, onaylayan: "Müh. Serkan D.", isEmriId: "wo-0139" },
  { id: "k-02", formNo: "WO-2026-0135", tarih: "07.07.2026", makineId: "mk-focusight", makineAd: "Focusight Shark 500", bakimTuru: "6 Aylık Kalibrasyon", periyot: "6aylik", kaynak: "teknik", yapan: "Ali K.", sureSaat: 3, sonuc: "bulguVar", bulguSayi: 1, onaylayan: "Müh. Serkan D.", isEmriId: "wo-0135" },
  { id: "k-03", formNo: "OK-2026-0048", tarih: "02.10.2026", makineId: "mk-rotomec1", makineAd: "Rotomec-1", bakimTuru: "Haftalık Operatör Kontrolü", periyot: "haftalik", kaynak: "operator", yapan: "Osman T.", sureSaat: 0.5, sonuc: "uygun", bulguSayi: 0 },
  { id: "k-04", formNo: "OK-2026-0047", tarih: "01.10.2026", makineId: "mk-foilmaster", makineAd: "Foilmaster", bakimTuru: "Haftalık Operatör Kontrolü", periyot: "haftalik", kaynak: "operator", yapan: "Kemal A.", sureSaat: 0.5, sonuc: "bulguVar", bulguSayi: 1 },
  { id: "k-05", formNo: "WO-2026-0131", tarih: "28.09.2026", makineId: "mk-lemanic1", makineAd: "Lemanic-1", bakimTuru: "3 Aylık Mekanik Bakım", periyot: "3aylik", kaynak: "teknik", yapan: "Mehmet Y.", sureSaat: 4, sonuc: "uygun", bulguSayi: 0, onaylayan: "Müh. Serkan D." },
  { id: "k-06", formNo: "WO-2026-0128", tarih: "21.09.2026", makineId: "mk-spanthera", makineAd: "Spanthera 106-LER", bakimTuru: "Aylık Baskı Ünitesi Bakımı", periyot: "aylik", kaynak: "teknik", yapan: "Mehmet Y.", sureSaat: 3, sonuc: "takip", bulguSayi: 1, onaylayan: "Müh. Serkan D." },
  { id: "k-07", formNo: "OK-2026-0044", tarih: "20.09.2026", makineId: "mk-lemanic2", makineAd: "Lemanic-2", bakimTuru: "Haftalık Operatör Kontrolü", periyot: "haftalik", kaynak: "operator", yapan: "Hasan D.", sureSaat: 0.5, sonuc: "uygun", bulguSayi: 0 },
  { id: "k-08", formNo: "WO-2026-0124", tarih: "15.09.2026", makineId: "mk-rotomec2", makineAd: "Rotomec-2", bakimTuru: "Aylık Genel Bakım", periyot: "aylik", kaynak: "teknik", yapan: "Ahmet K.", sureSaat: 2, sonuc: "uygun", bulguSayi: 0, onaylayan: "Müh. Serkan D." },
  { id: "k-09", formNo: "WO-2026-0119", tarih: "01.09.2026", makineId: "mk-expertfoil", makineAd: "Expertfoil", bakimTuru: "Aylık Genel Bakım", periyot: "aylik", kaynak: "teknik", yapan: "Ahmet K.", sureSaat: 2, sonuc: "uygun", bulguSayi: 0, onaylayan: "Müh. Serkan D." },
  { id: "k-10", formNo: "WO-2026-0114", tarih: "29.08.2026", makineId: "mk-rotomec2", makineAd: "Rotomec-2", bakimTuru: "Yıllık Kapsamlı Bakım", periyot: "yillik", kaynak: "teknik", yapan: "Mehmet Y.", sureSaat: 8, sonuc: "takip", bulguSayi: 2, onaylayan: "Müh. Serkan D." },
  { id: "k-11", formNo: "WO-2026-0109", tarih: "15.08.2026", makineId: "mk-foilmaster", makineAd: "Foilmaster", bakimTuru: "Aylık Genel Bakım", periyot: "aylik", kaynak: "teknik", yapan: "Mehmet Y.", sureSaat: 2, sonuc: "uygun", bulguSayi: 0, onaylayan: "Müh. Serkan D." },
  { id: "k-12", formNo: "WO-2026-0102", tarih: "21.07.2026", makineId: "mk-expertcut", makineAd: "Expertcut 106-PER", bakimTuru: "Aylık Genel Bakım", periyot: "aylik", kaynak: "teknik", yapan: "Ahmet K.", sureSaat: 2, sonuc: "uygun", bulguSayi: 0, onaylayan: "Müh. Serkan D." },
  { id: "k-13", formNo: "WO-2026-0096", tarih: "10.07.2026", makineId: "mk-lemanic3", makineAd: "Lemanic-3", bakimTuru: "3 Aylık Mekanik Bakım", periyot: "3aylik", kaynak: "teknik", yapan: "Mehmet Y.", sureSaat: 4, sonuc: "uygun", bulguSayi: 0, onaylayan: "Müh. Serkan D." },
  { id: "k-14", formNo: "WO-2026-0088", tarih: "19.06.2026", makineId: "mk-sp102", makineAd: "SP Evoline 102 E-Plus", bakimTuru: "3 Aylık Bıçak & Kalıp Bakımı", periyot: "3aylik", kaynak: "teknik", yapan: "Mehmet Y.", sureSaat: 3, sonuc: "uygun", bulguSayi: 0, onaylayan: "Müh. Serkan D." },
  { id: "k-15", formNo: "WO-2026-0079", tarih: "01.06.2026", makineId: "mk-kba-exit", makineAd: "KBA Exit Elevator", bakimTuru: "Aylık Genel Bakım", periyot: "aylik", kaynak: "teknik", yapan: "Ahmet K.", sureSaat: 1, sonuc: "uygun", bulguSayi: 0, onaylayan: "Müh. Serkan D." },
  { id: "k-16", formNo: "WO-2026-0071", tarih: "10.05.2026", makineId: "mk-spanthera", makineAd: "Spanthera 106-LER", bakimTuru: "Yıllık Kapsamlı Bakım", periyot: "yillik", kaynak: "teknik", yapan: "Mehmet Y.", sureSaat: 8, sonuc: "uygun", bulguSayi: 0, onaylayan: "Müh. Serkan D." },
];

export function bakimKayitlariGetir(): Promise<BakimKayit[]> {
  return gecikmeIle(BAKIM_KAYITLARI);
}
