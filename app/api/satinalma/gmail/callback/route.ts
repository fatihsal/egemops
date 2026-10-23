import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { supabaseSunucu } from "@/lib/supabase/server";
import { gmailTokenAl, gmailKullaniciEposta } from "@/lib/satinalma/mail/gmail";
import { hesapKaydet } from "@/lib/satinalma/mail/mail-hesabi";

// Google'dan dönüş — kodu token'a çevirir, şifreli kaydeder.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const ayarlar = `${origin}/satinalma/ayarlar`;

  const hata = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (hata) return NextResponse.redirect(`${ayarlar}?gmail=iptal`);

  const cerez = await cookies();
  const beklenenState = cerez.get("sa_gmail_state")?.value;
  if (!code || !state || !beklenenState || state !== beklenenState) {
    return NextResponse.redirect(`${ayarlar}?gmail=hata`);
  }

  const sb = await supabaseSunucu();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login`);

  try {
    const token = await gmailTokenAl(code);
    const eposta = await gmailKullaniciEposta(token.access_token);
    const expiry = new Date(Date.now() + token.expires_in * 1000).toISOString();
    await hesapKaydet(user.id, {
      eposta,
      accessToken: token.access_token,
      refreshToken: token.refresh_token ?? null,
      tokenTipi: token.token_type ?? null,
      scope: token.scope ?? null,
      expiry,
    });
  } catch (e) {
    console.error("[gmail/callback] hata:", e);
    return NextResponse.redirect(`${ayarlar}?gmail=hata`);
  }

  const res = NextResponse.redirect(`${ayarlar}?gmail=baglandi`);
  res.cookies.delete("sa_gmail_state");
  return res;
}
