// Gmail OAuth 2.0 + gönderim (gmail.send). SADECE SUNUCU.
// Şifre kullanılmaz; yalnızca OAuth. Access/refresh token'lar backend'de kalır.

import type { GidenMail, MailProvider } from "./types";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";
const GONDER_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

// Faz 6: yalnızca gönderme. (gmail.readonly Faz 9'da eklenecek.)
const SCOPES = ["openid", "email", "https://www.googleapis.com/auth/gmail.send"];

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
      return { messageId: d?.id ?? "" };
    },
  };
}
