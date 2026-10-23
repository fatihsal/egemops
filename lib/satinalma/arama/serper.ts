import { alanAdiCikar, type AramaSaglayici, type AramaSonucu } from "./types";

/** Serper.dev (Google Arama) API'si (SERPER_API_KEY). */
export function serperSaglayici(anahtar: string): AramaSaglayici {
  return {
    ad: "serper",
    async ara(sorgu, enCok = 8) {
      const r = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": anahtar },
        body: JSON.stringify({ q: sorgu, num: enCok, gl: "tr", hl: "tr" }),
      });
      if (!r.ok) throw new Error(`Serper HTTP ${r.status}`);
      const d = await r.json();
      const sonuclar: { title?: string; link?: string; snippet?: string }[] = d?.organic ?? [];
      return sonuclar
        .filter((x) => x.link)
        .map<AramaSonucu>((x) => ({ baslik: x.title ?? x.link!, url: x.link!, ozet: x.snippet ?? "", alanAdi: alanAdiCikar(x.link!) }));
    },
  };
}
