// Gmail OAuth 2.0 + gönderim (gmail.send). SADECE SUNUCU.
// Şifre kullanılmaz; yalnızca OAuth. Access/refresh token'lar backend'de kalır.

import type { GidenMail, MailProvider } from "./types";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
const GONDER_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

// gönderme + gelen teklifleri okuma (otomatik toplama için).
const SCOPES = [
  "openid",
  "email",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
];

export function gmailAyarVar(): boolean {
  return !!(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REDIRECT_URI);
}

function ayar() {
  const clientId = process.env.GMAIL_CLIENT_ID!;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET!;
  const redirectUri = process.env.GMAIL_REDIRECT_URI!;
  return { clientId, clientSecret, redirectUri };
}

export function gmailYetkiUrl(state: string): string {
  const { clientId, redirectUri } = ayar();
  const p = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline", // refresh token almak için
    prompt: "consent",
    include_granted_scopes: "true",
    scope: SCOPES.join(" "),
    state,
  });
  return `${AUTH_URL}?${p.toString()}`;
}

export interface TokenYaniti {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type?: string;
  scope?: string;
}

export async function gmailTokenAl(code: string): Promise<TokenYaniti> {
  const { clientId, clientSecret, redirectUri } = ayar();
  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!r.ok) throw new Error(`Token alınamadı (HTTP ${r.status}): ${await r.text()}`);
  return r.json();
}

export async function gmailTokenYenile(refreshToken: string): Promise<TokenYaniti> {
  const { clientId, clientSecret } = ayar();
  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });
  if (!r.ok) throw new Error(`Token yenilenemedi (HTTP ${r.status}): ${await r.text()}`);
  return r.json();
}

export async function gmailKullaniciEposta(accessToken: string): Promise<string | null> {
  try {
    const r = await fetch(USERINFO_URL, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!r.ok) return null;
    const d = await r.json();
    return d?.email ?? null;
  } catch {
    return null;
  }
}

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function mimeKur(mail: GidenMail): string {
  const konuEnc = `=?UTF-8?B?${Buffer.from(mail.konu, "utf8").toString("base64")}?=`;
  const govdeEnc = Buffer.from(mail.govde, "utf8").toString("base64");
  return [
    `To: ${mail.alici}`,
    `Subject: ${konuEnc}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    govdeEnc,
  ].join("\r\n");
}

/** Verilen access token ile gönderim yapan MailProvider. */
export function gmailProvider(accessToken: string): MailProvider {
  return {
    ad: "gmail",
    async gonder(mail) {
      const raw = base64url(Buffer.from(mimeKur(mail), "utf8"));
      const r = await fetch(GONDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ raw }),
      });
      if (!r.ok) throw new Error(`Gmail gönderim hatası (HTTP ${r.status}): ${await r.text()}`);
      const d = await r.json();
      return { messageId: d?.id ?? "", threadId: d?.threadId };
    },
  };
}

// ---------------------------------------------------------------------------
// OKUMA (gmail.readonly) — gelen teklifleri otomatik toplamak için
// ---------------------------------------------------------------------------

export interface GmailEk {
  ekId: string;
  dosyaAd: string;
  mimeType: string;
}
export interface GmailMesaj {
  id: string;
  threadId: string;
  from: string;
  tarih: string;
  konu: string;
  metin: string;
  ekler: GmailEk[];
}

function base64urlCoz(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function basligiBul(headers: { name: string; value: string }[], ad: string): string {
  return headers.find((h) => h.name.toLowerCase() === ad.toLowerCase())?.value ?? "";
}

// payload parçalarını gezerek düz metin gövdesini ve ekleri toplar.
function parcalariGez(part: Record<string, unknown> | undefined, metin: { v: string }, ekler: GmailEk[]) {
  if (!part) return;
  const mimeType = (part.mimeType as string) ?? "";
  const filename = (part.filename as string) ?? "";
  const body = part.body as { data?: string; attachmentId?: string } | undefined;

  if (filename && body?.attachmentId) {
    ekler.push({ ekId: body.attachmentId, dosyaAd: filename, mimeType });
  } else if (mimeType === "text/plain" && body?.data) {
    metin.v += base64urlCoz(body.data).toString("utf8") + "\n";
  }
  const parts = part.parts as Record<string, unknown>[] | undefined;
  if (parts) for (const p of parts) parcalariGez(p, metin, ekler);
}

/** Bir thread'deki tüm mesajları (gövde + ek listesi) döndürür. */
export async function gmailThreadMesajlari(accessToken: string, threadId: string): Promise<GmailMesaj[]> {
  const r = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}?format=full`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!r.ok) throw new Error(`Gmail thread okunamadı (HTTP ${r.status}): ${await r.text()}`);
  const d = await r.json();
  const mesajlar: GmailMesaj[] = [];
  for (const m of d?.messages ?? []) {
    const headers = (m.payload?.headers ?? []) as { name: string; value: string }[];
    const metin = { v: "" };
    const ekler: GmailEk[] = [];
    parcalariGez(m.payload, metin, ekler);
    mesajlar.push({
      id: m.id,
      threadId: m.threadId,
      from: basligiBul(headers, "From"),
      tarih: basligiBul(headers, "Date"),
      konu: basligiBul(headers, "Subject"),
      metin: metin.v.trim(),
      ekler,
    });
  }
  return mesajlar;
}

/** Bir ekin ikili içeriğini indirir. */
export async function gmailEkIndir(accessToken: string, mesajId: string, ekId: string): Promise<Buffer> {
  const r = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${mesajId}/attachments/${ekId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!r.ok) throw new Error(`Ek indirilemedi (HTTP ${r.status})`);
  const d = await r.json();
  return base64urlCoz(d?.data ?? "");
}
