// -----------------------------------------------------------------------------
// BAKIM — Makine & Ekipman envanteri (mock)
// Backend bağlanınca yalnızca bu dosyanın içi değişir; imza sabit kalır.
// -----------------------------------------------------------------------------

import type { Makine } from "@/lib/types/bakim";
import { gecikmeIle } from "@/lib/data/mock-utils";

export const MAKINELER: Makine[] = [
  { id: "mk-lemanic1", ad: "Lemanic-1", kod: "LMN-001", bolum: "Laminasyon", grup: "Laminasyon Makinesi", marka: "Lemanic", model: "Lemanic", seriNo: "BSA07552000003", lokasyon: "Üretim Salonu - Hat 1", devreyeAlmaYili: 2018, kritiklik: "yuksek", sorumluEkip: "Bakım Onarım", sonBakim: "28.09.2026", sonrakiBakim: "05.10.2026", acikIsEmri: 1, uyumOrani: 96 },
  { id: "mk-lemanic2", ad: "Lemanic-2", kod: "LMN-002", bolum: "Laminasyon", grup: "Laminasyon Makinesi", marka: "Lemanic", model: "Lemanic", seriNo: "BSA07552000005", lokasyon: "Üretim Salonu - Hat 1", devreyeAlmaYili: 2019, kritiklik: "yuksek", sorumluEkip: "Bakım Onarım", sonBakim: "28.09.2026", sonrakiBakim: "05.10.2026", acikIsEmri: 1, uyumOrani: 94 },
  { id: "mk-lemanic3", ad: "Lemanic-3", kod: "LMN-003", bolum: "Laminasyon", grup: "Laminasyon Makinesi", marka: "Lemanic", model: "Lemanic", seriNo: "BSA07552000008", lokasyon: "Üretim Salonu - Hat 2", devreyeAlmaYili: 2021, kritiklik: "orta", sorumluEkip: "Bakım Onarım", sonBakim: "15.09.2026", sonrakiBakim: "15.12.2026", acikIsEmri: 0, uyumOrani: 92 },
  { id: "mk-sp102", ad: "SP Evoline 102 E-Plus", kod: "SP-102", bolum: "Kesim", grup: "Kesim Makinesi", marka: "Bobst", model: "Evoline 102 E-Plus", seriNo: "BST102E00021", lokasyon: "Kesim Salonu", devreyeAlmaYili: 2020, kritiklik: "orta", sorumluEkip: "Bakım Onarım", sonBakim: "21.09.2026", sonrakiBakim: "21.12.2026", acikIsEmri: 0, uyumOrani: 90 },
  { id: "mk-sp104", ad: "SP 104-ER", kod: "SP-104", bolum: "Kesim", grup: "Kesim Makinesi", marka: "Bobst", model: "SP 104-ER", seriNo: "BST104ER0045", lokasyon: "Kesim Salonu", devreyeAlmaYili: 2017, kritiklik: "orta", sorumluEkip: "Bakım Onarım", sonBakim: "21.09.2026", sonrakiBakim: "19.10.2026", acikIsEmri: 0, uyumOrani: 88 },
  { id: "mk-expertcut", ad: "Expertcut 106-PER", kod: "EXP-106", bolum: "Kesim", grup: "Kesim Makinesi", marka: "Bobst", model: "Expertcut 106-PER", seriNo: "BST106PER012", lokasyon: "Kesim Salonu", devreyeAlmaYili: 2022, kritiklik: "orta", sorumluEkip: "Bakım Onarım", sonBakim: "21.09.2026", sonrakiBakim: "21.10.2026", acikIsEmri: 0, uyumOrani: 89 },
  { id: "mk-spanthera", ad: "Spanthera 106-LER", kod: "SPN-106", bolum: "Baskı", grup: "Baskı Makinesi", marka: "Bobst", model: "Spanthera 106-LER", seriNo: "BST106LER003", lokasyon: "Baskı Salonu", devreyeAlmaYili: 2023, kritiklik: "yuksek", sorumluEkip: "Bakım Onarım", sonBakim: "10.09.2026", sonrakiBakim: "10.12.2026", acikIsEmri: 1, uyumOrani: 93 },
  { id: "mk-foilmaster", ad: "Foilmaster", kod: "FM-001", bolum: "Yaldız", grup: "Yaldız Makinesi", marka: "Bobst", model: "Foilmaster", seriNo: "FM00120150", lokasyon: "Yaldız Salonu", devreyeAlmaYili: 2016, kritiklik: "yuksek", sorumluEkip: "Bakım Onarım", sonBakim: "15.08.2026", sonrakiBakim: "15.02.2027", acikIsEmri: 2, uyumOrani: 84 },
  { id: "mk-expertfoil", ad: "Expertfoil", kod: "EF-001", bolum: "Yaldız", grup: "Yaldız Makinesi", marka: "Bobst", model: "Expertfoil", seriNo: "EF00120190", lokasyon: "Yaldız Salonu", devreyeAlmaYili: 2020, kritiklik: "orta", sorumluEkip: "Bakım Onarım", sonBakim: "01.09.2026", sonrakiBakim: "01.12.2026", acikIsEmri: 0, uyumOrani: 91 },
  { id: "mk-rotomec1", ad: "Rotomec-1", kod: "ROT-001", bolum: "Dönüşüm", grup: "Dilimleme Makinesi", marka: "Rotomec", model: "Rotomec", seriNo: "RTM00120140", lokasyon: "Dönüşüm Salonu", devreyeAlmaYili: 2015, kritiklik: "orta", sorumluEkip: "Bakım Onarım", sonBakim: "02.10.2026", sonrakiBakim: "16.10.2026", acikIsEmri: 0, uyumOrani: 86 },
  { id: "mk-rotomec2", ad: "Rotomec-2", kod: "ROT-002", bolum: "Dönüşüm", grup: "Dilimleme Makinesi", marka: "Rotomec", model: "Rotomec", seriNo: "RTM00220160", lokasyon: "Dönüşüm Salonu", devreyeAlmaYili: 2017, kritiklik: "orta", sorumluEkip: "Bakım Onarım", sonBakim: "29.08.2026", sonrakiBakim: "12.03.2027", acikIsEmri: 0, uyumOrani: 90 },
  { id: "mk-focusight", ad: "Focusight Shark 500", kod: "FS-500", bolum: "Kalite", grup: "Kalite Kontrol Sistemi", marka: "Focusight", model: "Shark 500", seriNo: "FSH50020220", lokasyon: "Kalite Kontrol", devreyeAlmaYili: 2022, kritiklik: "yuksek", sorumluEkip: "Bakım Onarım", sonBakim: "07.07.2026", sonrakiBakim: "07.01.2027", acikIsEmri: 0, uyumOrani: 95 },
  { id: "mk-kba-exit", ad: "KBA Exit Elevator", kod: "KBA-EE", bolum: "Sevkiyat", grup: "Konveyör / Taşıma Sistemi", marka: "KBA", model: "Exit Elevator", seriNo: "KBAEE20180", lokasyon: "Sevkiyat", devreyeAlmaYili: 2018, kritiklik: "dusuk", sorumluEkip: "Bakım Onarım", sonBakim: "01.09.2026", sonrakiBakim: "01.03.2027", acikIsEmri: 0, uyumOrani: 90 },
];

export function makineleriGetir(): Promise<Makine[]> {
  return gecikmeIle(MAKINELER);
}

export function makineGetir(id: string): Promise<Makine | undefined> {
  return gecikmeIle(MAKINELER.find((m) => m.id === id));
}
