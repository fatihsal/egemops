import { NextResponse } from "next/server";

import { supabaseSunucu } from "@/lib/supabase/server";
import { hesapSil } from "@/lib/satinalma/mail/mail-hesabi";

export async function POST() {
  const sb = await supabaseSunucu();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Oturum bulunamadı." }, { status: 401 });

  try {
    await hesapSil(user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ hata: e instanceof Error ? e.message : "Hata." }, { status: 500 });
  }
}
