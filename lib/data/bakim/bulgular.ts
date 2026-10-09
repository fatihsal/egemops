// -----------------------------------------------------------------------------
// BAKIM — Bulgular (mock)
// SOP "Bulgu Var" + operatör "Uygunsuzluk" aynı havuzda birleşir.
// -----------------------------------------------------------------------------

import type { Bulgu } from "@/lib/types/bakim";
import { gecikmeIle } from "@/lib/data/mock-utils";

export const BULGULAR: Bulgu[] = [
  {
    id: "bl-001", makineId: "mk-lemanic1", makineAd: "Lemanic-1", isEmriId: "wo-0142", sopMaddeNo: "2.3",
    kaynak: "bakim", aciklama: "Sağ taraf nip (baskı) basıncı referans değerin altında.",
    onerilenAksiyon: "Basınç regülatörü kontrol edilip gerekirse değiştirilecek.",
    sorumlu: "Mehmet Y.", termin: "15.10.2026", durum: "acik", olusturmaTarihi: "05.10.2026",
  },
  {
    id: "bl-002", makineId: "mk-foilmaster", makineAd: "Foilmaster",
    kaynak: "operator", aciklama: "Yaldız ünitesi altında hafif yağ kaçağı gözlendi.",
    onerilenAksiyon: "Conta ve sızdırmazlık elemanları kontrol edilecek.",
    sorumlu: "Bakım Onarım", termin: "12.10.2026", durum: "planlandi", olusturmaTarihi: "01.10.2026",
  },
  {
    id: "bl-003", makineId: "mk-rotomec1", makineAd: "Rotomec-1", isEmriId: "wo-0146",
    kaynak: "bakim", aciklama: "Tahrik zincirinde aşırı gevşeklik tespit edildi.",
    onerilenAksiyon: "Zincir gerginlik ayarı yapılacak.",
    sorumlu: "Mehmet Y.", termin: "10.10.2026", durum: "tamamlandi", olusturmaTarihi: "28.09.2026",
  },
  {
    id: "bl-004", makineId: "mk-sp104", makineAd: "SP 104-ER",
    kaynak: "operator", aciklama: "Acil stop butonu zor basılıyor, tepki süresi yavaş.",
    onerilenAksiyon: "Buton mekanizması değiştirilecek.",
    sorumlu: "Ali K.", termin: "09.10.2026", durum: "acik", olusturmaTarihi: "02.10.2026",
  },
  {
    id: "bl-005", makineId: "mk-spanthera", makineAd: "Spanthera 106-LER",
    kaynak: "bakim", aciklama: "Baskı ünitesinde yüksek devirde titreşim.",
    onerilenAksiyon: "Rulman ve balans kontrolü yapılacak.",
    sorumlu: "Mehmet Y.", termin: "18.10.2026", durum: "planlandi", olusturmaTarihi: "10.09.2026",
  },
  {
    id: "bl-006", makineId: "mk-expertcut", makineAd: "Expertcut 106-PER",
    kaynak: "operator", aciklama: "Çıkış konveyöründe anormal ses.",
    onerilenAksiyon: "Rulman / yatak kontrolü.",
    sorumlu: "Bakım Onarım", durum: "acik", olusturmaTarihi: "03.10.2026",
  },
  {
    id: "bl-007", makineId: "mk-focusight", makineAd: "Focusight Shark 500", isEmriId: "wo-0135",
    kaynak: "bakim", aciklama: "Kamera lenslerinde kirlilik birikimi.",
    onerilenAksiyon: "Haftalık temizlik planına eklenecek.",
    sorumlu: "Ali K.", termin: "07.07.2026", durum: "tamamlandi", olusturmaTarihi: "07.07.2026",
  },
  {
    id: "bl-008", makineId: "mk-lemanic2", makineAd: "Lemanic-2",
    kaynak: "operator", aciklama: "Elektrik panosu kapağı tam kapanmıyor.",
    onerilenAksiyon: "Menteşe ve kilit ayarı.",
    durum: "iptal", olusturmaTarihi: "20.09.2026",
  },
];

export function bulgulariGetir(): Promise<Bulgu[]> {
  return gecikmeIle(BULGULAR);
}

export function bulguGetir(id: string): Promise<Bulgu | undefined> {
  return gecikmeIle(BULGULAR.find((b) => b.id === id));
}

export function makineBulgulariGetir(makineId: string): Promise<Bulgu[]> {
  return gecikmeIle(BULGULAR.filter((b) => b.makineId === makineId));
}
