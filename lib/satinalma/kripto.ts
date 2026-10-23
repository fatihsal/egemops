// OAuth token'larını DB'de şifrelemek için AES-256-GCM. SADECE SUNUCU.
// Anahtar: SATINALMA_TOKEN_SECRET (64 karakter hex = 32 bayt).

import crypto from "crypto";

const ALG = "aes-256-gcm";

function anahtar(): Buffer {
  const hex = process.env.SATINALMA_TOKEN_SECRET;
  if (!hex || hex.length < 64) {
    throw new Error("SATINALMA_TOKEN_SECRET tanımlı değil veya 64 karakterden kısa (32 bayt hex gerekli).");
  }
  return Buffer.from(hex.slice(0, 64), "hex");
}

/** iv:tag:ciphertext (hepsi base64). */
export function sifrele(acikMetin: string): string {
  const iv = crypto.randomBytes(12);
  const sifreleyici = crypto.createCipheriv(ALG, anahtar(), iv);
  const enc = Buffer.concat([sifreleyici.update(acikMetin, "utf8"), sifreleyici.final()]);
  const tag = sifreleyici.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), enc.toString("base64")].join(":");
}

export function coz(sifreli: string): string {
  const [iv, tag, enc] = sifreli.split(":");
  if (!iv || !tag || !enc) throw new Error("Geçersiz şifreli veri.");
  const cozucu = crypto.createDecipheriv(ALG, anahtar(), Buffer.from(iv, "base64"));
  cozucu.setAuthTag(Buffer.from(tag, "base64"));
  return Buffer.concat([cozucu.update(Buffer.from(enc, "base64")), cozucu.final()]).toString("utf8");
}
