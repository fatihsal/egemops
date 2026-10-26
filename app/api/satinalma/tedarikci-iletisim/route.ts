import { NextResponse } from "next/server";

import { supabaseSunucu } from "@/lib/supabase/server";

// Tedarikçi iletişim bilgisi bulma — GERÇEK web sayfasından e-posta/telefon çeker.
// E-posta UYDURULMAZ; yalnızca sitenin HTML'inde yazan adresler döndürülür.
// Bulunamazsa boş döner (kullanıcı elle girebilir).

const ILETISIM_YOLLARI = [
  "",
  "/iletisim",
  "/iletisim/",
  "/iletisim.html",
  "/iletisim-bilgileri",
  "/contact",
  "/contact-us",
  "/contact/",
  "/tr/iletisim",
  "/en/contact",
  "/kurumsal/iletisim",
];

const EPOSTA_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const TEL_RE = /(?:\+?\d[\d\s().-]{8,}\d)/g;

const COP_PARCALAR = ["sentry.", "wixpress", "example.", "domain.com", "yourdomain", "email.com", "@2x", "u002", "localhost"];
const COP_UZANTI = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".js", ".css"];

function temizEposta(e: string): boolean {
  const l = e.toLowerCase();
  if (COP_PARCALAR.some((p) => l.includes(p))) return false;
  if (COP_UZANTI.some((u) => l.endsWith(u))) return false;
  if (l.length > 60) return false;
  return true;
}

function anaEtiket(host: string): string {
  const p = host.replace(/^www\./, "").split(".");
  // festo.com.tr -> "festo"; festo.com -> "festo"
  return p[0] ?? host;
}

// Cloudflare e-posta gizleme çözümü (data-cfemail="HEX").
function cfCoz(hex: string): string {
  try {
    const r = parseInt(hex.substr(0, 2), 16);
    let e = "";
    for (let i = 2; i < hex.length; i += 2) e += String.fromCharCode(parseInt(hex.substr(i, 2), 16) ^ r);
    return e;
  } catch {
    return "";
  }
}

// HTML sayısal varlıkları (&#64; &#x40;) düz karaktere çevir — entity ile gizlenmiş e-postalar için.
function varliklariCoz(html: string): string {
  return html
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => { try { return String.fromCodePoint(parseInt(h, 16)); } catch { return _; } })
    .replace(/&#(\d+);/g, (_, d) => { try { return String.fromCodePoint(parseInt(d, 10)); } catch { return _; } });
}

function puan(eposta: string, siteAna: string): number {
  const [yerel, alan] = eposta.toLowerCase().split("@");
  let s = 0;
  if (alan?.includes(siteAna)) s += 5; // site alan adıyla eşleşiyor
  if (["info", "satis", "sales", "iletisim", "bilgi", "contact", "teklif", "export", "purchasing", "siparis"].some((k) => yerel?.startsWith(k))) s += 3;
  if (alan?.endsWith(".tr")) s += 1;
  return s;
}

async function sayfaCek(url: string): Promise<string> {
  const kontrol = new AbortController();
  const zaman = setTimeout(() => kontrol.abort(), 8000);
  try {
    const r = await fetch(url, {
      signal: kontrol.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EgemOpsBot/1.0)", Accept: "text/html" },
      redirect: "follow",
    });
    if (!r.ok) return "";
    const tur = r.headers.get("content-type") ?? "";
    if (!tur.includes("text/html") && !tur.includes("text/")) return "";
    return (await r.text()).slice(0, 500_000);
  } catch {
    return "";
  } finally {
    clearTimeout(zaman);
  }
}

export async function POST(req: Request) {
  const sb = await supabaseSunucu();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Oturum bulunamadı." }, { status: 401 });

  let govde: { url?: string };
  try {
    govde = await req.json();
  } catch {
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
  }
  const ham = (govde.url ?? "").trim();
  if (!ham) return NextResponse.json({ hata: "URL gerekli." }, { status: 400 });

  let origin: string;
  let host: string;
  try {
    const u = new URL(ham.startsWith("http") ? ham : `https://${ham}`);
    origin = u.origin;
    host = u.hostname;
  } catch {
    return NextResponse.json({ hata: "Geçersiz URL." }, { status: 400 });
  }

  const siteAna = anaEtiket(host);
  const hedefler = Array.from(new Set([ham.startsWith("http") ? ham : `https://${ham}`, ...ILETISIM_YOLLARI.map((y) => origin + y)]));

  const sonuclar = await Promise.allSettled(hedefler.slice(0, 7).map((u) => sayfaCek(u).then((h) => ({ u, h }))));

  const bulunan = new Map<string, string>(); // eposta -> bulunduğu sayfa
  const telefonlar = new Set<string>();

  const ekle = (e: string, u: string) => { if (e && temizEposta(e) && !bulunan.has(e.toLowerCase())) bulunan.set(e.toLowerCase(), u); };

  for (const s of sonuclar) {
    if (s.status !== "fulfilled" || !s.value.h) continue;
    const { u } = s.value;
    const html = varliklariCoz(s.value.h.replace(/&commat;/gi, "@"));
    // 1) Düz metin / mailto / entity-çözülmüş e-postalar
    for (const m of html.matchAll(EPOSTA_RE)) ekle(m[0], u);
    // 2) Cloudflare gizli e-postalar (data-cfemail="HEX")
    for (const m of html.matchAll(/data-cfemail="([0-9a-fA-F]{6,})"/g)) ekle(cfCoz(m[1]), u);
    for (const m of html.matchAll(/\/cdn-cgi\/l\/email-protection#([0-9a-fA-F]{6,})/g)) ekle(cfCoz(m[1]), u);
    for (const m of (html.replace(/<[^>]+>/g, " ").matchAll(TEL_RE))) {
      const tel = m[0].trim();
      if (tel.replace(/\D/g, "").length >= 10 && telefonlar.size < 3) telefonlar.add(tel);
    }
  }

  const epostalar = Array.from(bulunan.entries())
    .map(([eposta, kaynakSayfa]) => ({ eposta, kaynakSayfa }))
    .sort((a, b) => puan(b.eposta, siteAna) - puan(a.eposta, siteAna))
    .slice(0, 6);

  return NextResponse.json({ epostalar, telefonlar: Array.from(telefonlar), host });
}
