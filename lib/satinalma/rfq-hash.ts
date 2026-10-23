// RFQ içerik parmak izi — onayı belirli içerik sürümüne + alıcıya bağlamak için.
// Hem istemci hem sunucuda çalışır (saf fonksiyon). Alıcı/konu/gövde değişirse
// hash değişir; eski onay yeni gönderimi kapsamaz (brifing §6).

export function rfqIcerikHash(alici: string | null, konu: string | null, govde: string | null): string {
  const s = `${(alici ?? "").trim().toLowerCase()}\u0001${(konu ?? "").trim()}\u0001${(govde ?? "").trim()}`;
  let h = 0x811c9dc5; // FNV-1a 32-bit
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}
