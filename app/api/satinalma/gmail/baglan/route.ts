import crypto from "crypto";
import { NextResponse } from "next/server";

import { supabaseSunucu } from "@/lib/supabase/server";
import { gmailAyarVar, gmailYetkiUrl } from "@/lib/satinalma/mail/gmail";

// Gmail OAuth başlat — Google onay ekranına yönlendirir (yalnızca gmail.send).
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const sb = await supabaseSunucu();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login`);

  if (!gmailAyarVar()) {
    return NextResponse.redirect(`${origin}/satinalma/ayarlar?gmail=yapilandirilmamis`);
  }

  const state = crypto.randomBytes(16).toString("hex");
  const res = NextResponse.redirect(gmailYetkiUrl(state));
  res.cookies.set("sa_gmail_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
