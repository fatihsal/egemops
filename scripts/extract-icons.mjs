// Kaynaktaki tüm "solar:*" ve "vscode-icons:*" ikon adlarını tarar,
// ilgili @iconify-json paketlerinden SADECE kullanılanların verisini çıkarıp
// lib/icon-collections.json'a yazar. Böylece ikonlar çalışma anında API
// yerine yerel (çevrimdışı) veriden yüklenir.
//
// Çalıştırma:  node scripts/extract-icons.mjs

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { getIconData } from "@iconify/utils";

const KOKLER = ["app", "components", "lib"];
const PREFIXLER = ["solar", "vscode-icons"];

// 1) Kaynak dosyalarında ikon adlarını topla
const isimler = new Set();
for (const kok of KOKLER) {
  const dosyalar = readdirSync(kok, { recursive: true });
  for (const rel of dosyalar) {
    const yol = `${kok}/${rel}`.replace(/\\/g, "/");
    if (!/\.(tsx?|jsx?)$/.test(yol)) continue;
    let icerik;
    try {
      icerik = readFileSync(yol, "utf8");
    } catch {
      continue;
    }
    const bulunan = icerik.match(/(?:solar|vscode-icons):[a-z0-9-]+/g);
    if (bulunan) bulunan.forEach((x) => isimler.add(x));
  }
}

// 2) Koleksiyon JSON'larını yükle
const koleksiyonlar = {};
for (const p of PREFIXLER) {
  koleksiyonlar[p] = JSON.parse(
    readFileSync(`node_modules/@iconify-json/${p}/icons.json`, "utf8"),
  );
}

// 3) Yalnız kullanılan ikonların verisini çıkar
const cikti = {};
const eksik = [];
for (const tam of isimler) {
  const [prefix, ad] = tam.split(":");
  const kok = koleksiyonlar[prefix];
  const veri = kok ? getIconData(kok, ad) : null;
  if (!veri) {
    eksik.push(tam);
    continue;
  }
  cikti[prefix] ??= { prefix, icons: {} };
  cikti[prefix].icons[ad] = veri;
}

writeFileSync(
  "lib/icon-collections.json",
  JSON.stringify(Object.values(cikti)),
);

console.log(
  `Çıkarılan ikon: ${isimler.size - eksik.length} / ${isimler.size}`,
);
if (eksik.length) console.warn("Bulunamayan:", eksik);
