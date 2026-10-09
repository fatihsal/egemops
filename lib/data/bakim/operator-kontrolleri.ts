// -----------------------------------------------------------------------------
// BAKIM — Operatör Kontrolleri (haftalık operatör formu) — mock
// OPERATOR_INSPECTION: 2 durumlu (uygun / uygunsuzluk). Aynı Checklist Engine.
// -----------------------------------------------------------------------------

import type { OperatorDurum, OperatorKontrol, OperatorMadde } from "@/lib/types/bakim";
import { gecikmeIle } from "@/lib/data/mock-utils";

function madde(no: string, gorev: string, turu: OperatorMadde["turu"], aciklama?: string): OperatorMadde {
  return { no, gorev, turu, aciklama, durum: "bekliyor", fotograflar: [] };
}

/** Standart haftalık operatör kontrol listesi (8 madde). */
function operatorMaddeler(): OperatorMadde[] {
  return [
    madde("1", "Genel temizlik — makine çevresi ve yüzeyler", "temizlik", "Toz, kalıntı ve dökülme kontrolü."),
    madde("2", "Yağ / gres seviyeleri kontrolü", "seviye", "Gösterge camından seviyeyi kontrol edin."),
    madde("3", "Hava basıncı / pnömatik kontrol", "seviye", "Basınç değerini referansla karşılaştırın."),
    madde("4", "Acil stop butonları çalışıyor mu", "gorsel", "Fonksiyonel kontrol."),
    madde("5", "Kayış / zincir görsel durumu", "gorsel", "Aşınma, gevşeklik, hizalama."),
    madde("6", "Anormal ses / titreşim var mı", "gorsel"),
    madde("7", "Kaçak (yağ / hava / su) var mı", "gorsel"),
    madde("8", "Emniyet kapakları / muhafazalar yerinde mi", "gorsel"),
  ];
}

function isaretle(maddeler: OperatorMadde[], harita: Record<number, OperatorDurum>, notlar?: Record<number, string>): OperatorMadde[] {
  for (const [i, durum] of Object.entries(harita)) {
    const idx = Number(i);
    const m = maddeler[idx];
    if (!m) continue;
    m.durum = durum;
    if (notlar?.[idx]) m.not = notlar[idx];
    if (durum === "uygunsuzluk") m.bulguId = `bl-ok-${m.no}`;
  }
  return maddeler;
}

function olustur(
  base: Omit<OperatorKontrol, "tamamlananMadde" | "toplamMadde" | "uygunsuzlukSayi">,
): OperatorKontrol {
  return {
    ...base,
    tamamlananMadde: base.maddeler.filter((m) => m.durum !== "bekliyor").length,
    toplamMadde: base.maddeler.length,
    uygunsuzlukSayi: base.maddeler.filter((m) => m.durum === "uygunsuzluk").length,
  };
}

export const OPERATOR_KONTROLLERI: OperatorKontrol[] = [
  olustur({
    id: "ok-0051", no: "OK-2026-0051", makineId: "mk-lemanic1", makineAd: "Lemanic-1",
    hafta: "05 - 11 Ekim 2026", tarih: "06.10.2026", operator: "Hasan D.", vardiya: "Gündüz", durum: "devam",
    maddeler: isaretle(operatorMaddeler(), { 0: "uygun", 1: "uygun", 2: "uygun" }),
  }),
  olustur({
    id: "ok-0052", no: "OK-2026-0052", makineId: "mk-lemanic2", makineAd: "Lemanic-2",
    hafta: "05 - 11 Ekim 2026", tarih: "06.10.2026", operator: "Osman T.", vardiya: "Gündüz", durum: "planlandi",
    maddeler: operatorMaddeler(),
  }),
  olustur({
    id: "ok-0053", no: "OK-2026-0053", makineId: "mk-sp104", makineAd: "SP 104-ER",
    hafta: "05 - 11 Ekim 2026", tarih: "07.10.2026", operator: "Kemal A.", vardiya: "Gece", durum: "planlandi",
    maddeler: operatorMaddeler(),
  }),
  olustur({
    id: "ok-0054", no: "OK-2026-0054", makineId: "mk-spanthera", makineAd: "Spanthera 106-LER",
    hafta: "05 - 11 Ekim 2026", tarih: "06.10.2026", operator: "Hasan D.", vardiya: "Gündüz", durum: "planlandi",
    maddeler: operatorMaddeler(),
  }),
  olustur({
    id: "ok-0048", no: "OK-2026-0048", makineId: "mk-rotomec1", makineAd: "Rotomec-1",
    hafta: "28 Eylül - 04 Ekim 2026", tarih: "02.10.2026", operator: "Osman T.", vardiya: "Gündüz", durum: "tamamlandi",
    maddeler: isaretle(operatorMaddeler(), { 0: "uygun", 1: "uygun", 2: "uygun", 3: "uygun", 4: "uygun", 5: "uygun", 6: "uygun", 7: "uygun" }),
  }),
  olustur({
    id: "ok-0047", no: "OK-2026-0047", makineId: "mk-foilmaster", makineAd: "Foilmaster",
    hafta: "28 Eylül - 04 Ekim 2026", tarih: "01.10.2026", operator: "Kemal A.", vardiya: "Gündüz", durum: "tamamlandi",
    maddeler: isaretle(
      operatorMaddeler(),
      { 0: "uygun", 1: "uygun", 2: "uygun", 3: "uygun", 4: "uygun", 5: "uygun", 6: "uygunsuzluk", 7: "uygun" },
      { 6: "Yaldız ünitesi altında hafif yağ kaçağı tespit edildi, bakıma bildirildi." },
    ),
  }),
];

export function operatorKontrolleriGetir(): Promise<OperatorKontrol[]> {
  return gecikmeIle(OPERATOR_KONTROLLERI);
}

export function operatorKontrolGetir(id: string): Promise<OperatorKontrol | undefined> {
  return gecikmeIle(OPERATOR_KONTROLLERI.find((k) => k.id === id));
}
