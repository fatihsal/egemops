import { NextResponse } from "next/server";

import { supabaseSunucu } from "@/lib/supabase/server";
import { gmailAyarVar } from "@/lib/satinalma/mail/gmail";
import { hesapDurumGetir } from "@/lib/satinalma/mail/mail-hesabi";

function izinliAlicilar(): string[] {
  return (process.env.SATINALMA_IZINLI_ALICILAR || "").split(",").map((s) => s.trim()).filter(Boolean);
}

export async function GET() {
  const sb = await supabaseSunucu();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Oturum bulunamadı." }, { status: 401 });

  const durum = await hesapDurumGetir(user.id);
  return NextResponse.json({
    bagli: durum.bagli,
    eposta: durum.eposta,
    ayarVar: gmailAyarVar(),
    izinliAlicilar: izinliAlicilar(),
  });
}
