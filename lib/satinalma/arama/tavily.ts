import { alanAdiCikar, type AramaSaglayici, type AramaSonucu } from "./types";

/** Tavily arama API'si (TAVILY_API_KEY). */
export function tavilySaglayici(anahtar: string): AramaSaglayici {
  return {
    ad: "tavily",
    async ara(sorgu, enCok = 8) {
      const r = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${anahtar}` },
        body: JSON.stringify({ query: sorgu, max_results: enCok, search_depth: "basic", country: "turkey" }),
      });
      if (!r.ok) throw new Error(`Tavily HTTP ${r.status}`);
      const d = await r.json();
      const sonuclar: { title?: string; url?: string; content?: string }[] = d?.results ?? [];
      return sonuclar
        .filter((x) => x.url)
        .map<AramaSonucu>((x) => ({ baslik: x.title ?? x.url!, url: x.url!, ozet: x.content ?? "", alanAdi: alanAdiCikar(x.url!) }));
    },
  };
}
