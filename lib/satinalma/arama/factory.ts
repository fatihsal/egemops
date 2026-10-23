import type { AramaSaglayici } from "./types";
import { tavilySaglayici } from "./tavily";
import { serperSaglayici } from "./serper";

/** Env'de tanımlı anahtara göre arama sağlayıcısını seçer. Yoksa null. */
export function aramaSaglayici(): AramaSaglayici | null {
  const tavily = process.env.TAVILY_API_KEY;
  if (tavily) return tavilySaglayici(tavily);
  const serper = process.env.SERPER_API_KEY;
  if (serper) return serperSaglayici(serper);
  return null;
}
