// Tedarikçi kategorisi otomatik tahmini — sitenin başlık+özet metninden
// anahtar kelimelerle. Çok etiket döndürebilir (ör. hem elektrik hem mekanik).
// Uydurma değil: yalnızca metinde geçen ipuçlarına göre. Kullanıcı düzeltebilir.

const KURALLAR: { kategori: string; kelimeler: string[] }[] = [
  { kategori: "pnomatik", kelimeler: ["pnömatik", "pnomatik", "silindir", "valf", "ventil", "festo"] },
  { kategori: "hidrolik", kelimeler: ["hidrolik", "hidrolik hortum", "pompa", "hidro"] },
  { kategori: "rulman", kelimeler: ["rulman", "bearing", "kayış", "kasnak", "redüktör", "rulmanlı", "dişli", "aktarma", "zincir"] },
  { kategori: "elektrik", kelimeler: ["elektrik", "motor", "pano", "kablo", "kontaktör", "röle", "trafo", "şalt", "enerji"] },
  { kategori: "elektronik", kelimeler: ["elektronik", "sensör", "sensor", "plc", "kart", "devre", "enkoder"] },
  { kategori: "otomasyon", kelimeler: ["otomasyon", "automation", "scada", "sürücü", "inverter"] },
  { kategori: "kaynak", kelimeler: ["kaynak", "elektrot", "kaynak teli", "taşlama", "aşındırıcı", "zımpara"] },
  { kategori: "kesici_takim", kelimeler: ["kesici", "matkap", "freze", "torna", "panç", "uç", "takım tezgah", "testere"] },
  { kategori: "hirdavat", kelimeler: ["hırdavat", "cıvata", "civata", "somun", "vida", "bağlantı eleman", "pul", "saplama"] },
  { kategori: "mekanik", kelimeler: ["mekanik", "makine", "yedek parça", "imalat", "talaşlı", "conta", "keçe"] },
];

export function kategoriTahmin(metin: string): string[] {
  const m = (metin || "").toLocaleLowerCase("tr");
  const bulunan = new Set<string>();
  for (const k of KURALLAR) {
    if (k.kelimeler.some((kelime) => m.includes(kelime))) bulunan.add(k.kategori);
  }
  if (bulunan.size === 0) bulunan.add("genel");
  return Array.from(bulunan).slice(0, 4);
}
