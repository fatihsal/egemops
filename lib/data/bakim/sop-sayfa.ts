// -----------------------------------------------------------------------------
// BAKIM — SOP & Form Yönetimi sayfası (makine-merkezli özet) — mock
// -----------------------------------------------------------------------------

import type { SopSayfaAnaliz } from "@/lib/types/bakim";
import { gecikmeIle } from "@/lib/data/mock-utils";

const ANALIZ: SopSayfaAnaliz = {
  satirlar: [
    { makineId: "mk-lemanic1", makineAd: "Lemanic-1", ekipmanKodu: "LMN-001", bakimTipleri: ["3A", "6A", "12A"], sonRevizyon: "Rev.5", sonKullanim: "28.09.2026", durum: "aktif", sopId: "sop-lemanic" },
    { makineId: "mk-lemanic2", makineAd: "Lemanic-2", ekipmanKodu: "LMN-002", bakimTipleri: ["3A", "6A", "12A"], sonRevizyon: "Rev.4", sonKullanim: "22.09.2026", durum: "kullanimda", sopId: "sop-lemanic" },
    { makineId: "mk-lemanic3", makineAd: "Lemanic-3", ekipmanKodu: "LMN-003", bakimTipleri: ["3A", "6A", "12A"], sonRevizyon: "Rev.3", sonKullanim: "15.09.2026", durum: "aktif", sopId: "sop-lemanic" },
    { makineId: "mk-rotomec1", makineAd: "Rotomec-1", ekipmanKodu: "ROT-001", bakimTipleri: ["3A", "6A"], sonRevizyon: "Rev.2", sonKullanim: "10.09.2026", durum: "revizeBekliyor" },
    { makineId: "mk-rotomec2", makineAd: "Rotomec-2", ekipmanKodu: "ROT-002", bakimTipleri: ["3A", "6A", "12A"], sonRevizyon: "Rev.4", sonKullanim: "05.09.2026", durum: "aktif" },
    { makineId: "mk-sp104", makineAd: "SP 104-ER", ekipmanKodu: "SP-104", bakimTipleri: ["3A", "6A", "12A"], sonRevizyon: "Rev.3", sonKullanim: "01.09.2026", durum: "eksikFoto" },
    { makineId: "mk-foilmaster", makineAd: "Foilmaster", ekipmanKodu: "FM-001", bakimTipleri: ["3A", "6A"], sonRevizyon: "Rev.1", sonKullanim: "25.08.2026", durum: "aktif" },
    { makineId: "mk-focusight", makineAd: "Focusight Shark 500", ekipmanKodu: "FS-500", bakimTipleri: ["3A", "6A", "12A"], sonRevizyon: "Rev.2", sonKullanim: "20.08.2026", durum: "kullanimda", sopId: "sop-focusight" },
    { makineId: "mk-sp102", makineAd: "SP Evoline 102 E-Plus", ekipmanKodu: "SP-102", bakimTipleri: ["3A", "6A"], sonRevizyon: "Rev.2", sonKullanim: "18.09.2026", durum: "aktif" },
    { makineId: "mk-expertcut", makineAd: "Expertcut 106-PER", ekipmanKodu: "EXP-106", bakimTipleri: ["3A", "6A"], sonRevizyon: "Rev.2", sonKullanim: "12.09.2026", durum: "aktif" },
    { makineId: "mk-spanthera", makineAd: "Spanthera 106-LER", ekipmanKodu: "SPN-106", bakimTipleri: ["3A", "6A", "12A"], sonRevizyon: "Rev.3", sonKullanim: "10.09.2026", durum: "kullanimda", sopId: "sop-spanthera" },
    { makineId: "mk-expertfoil", makineAd: "Expertfoil", ekipmanKodu: "EF-001", bakimTipleri: ["3A", "6A"], sonRevizyon: "Rev.2", sonKullanim: "01.09.2026", durum: "aktif" },
    { makineId: "mk-kba-exit", makineAd: "KBA Exit Elevator", ekipmanKodu: "KBA-EE", bakimTipleri: ["3A"], sonRevizyon: "Rev.1", sonKullanim: "01.09.2026", durum: "aktif" },
  ],
  sonRevize: [
    { sopAd: "Lemanic-2 6 Aylık Bakım SOP", revNo: "Rev.4", tarih: "28.09.2026 14:32", sorumlu: "Mehmet Y." },
    { sopAd: "SP 104 3 Aylık Bakım SOP", revNo: "Rev.3", tarih: "26.09.2026 11:18", sorumlu: "Ali D." },
    { sopAd: "Rotomec-2 12 Aylık Bakım SOP", revNo: "Rev.4", tarih: "24.09.2026 16:45", sorumlu: "Serkan K." },
    { sopAd: "Foilmaster 6 Aylık Bakım SOP", revNo: "Rev.2", tarih: "22.09.2026 10:12", sorumlu: "Mehmet Y." },
    { sopAd: "Lemanic-1 3 Aylık Bakım SOP", revNo: "Rev.5", tarih: "20.09.2026 09:30", sorumlu: "Ali D." },
  ],
  yaklasanEslesen: [
    { makine: "Lemanic-2", bakimTipi: "6 Aylık", planlananTarih: "05.10.2026", eslesenSop: "Lemanic-2 6A SOP", hazir: "hazir" },
    { makine: "Rotomec-1", bakimTipi: "3 Aylık", planlananTarih: "07.10.2026", eslesenSop: "Rotomec-1 3A SOP", hazir: "hazir" },
    { makine: "SP 104-ER", bakimTipi: "6 Aylık", planlananTarih: "10.10.2026", eslesenSop: "SP 104 6A SOP", hazir: "revizeBekliyor" },
    { makine: "Foilmaster", bakimTipi: "3 Aylık", planlananTarih: "12.10.2026", eslesenSop: "Foilmaster 3A SOP", hazir: "hazir" },
    { makine: "Focusight Shark 500", bakimTipi: "12 Aylık", planlananTarih: "15.10.2026", eslesenSop: "Focusight 12A SOP", hazir: "eksikFoto" },
  ],
};

export function sopSayfaGetir(): Promise<SopSayfaAnaliz> {
  return gecikmeIle(ANALIZ);
}
