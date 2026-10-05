import { NextResponse } from "next/server";

import { supabaseSunucu } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ROLLER = ["admin", "enerji_yoneticisi", "izleyici"];

/** Çağıranın admin olduğunu doğrular; değilse hata yanıtı döner. */
async function adminDogrula() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { hata: NextResponse.json({ hata: "SUPABASE_SERVICE_ROLE_KEY tanımlı değil." }, { status: 500 }) };
  }
  const sb = await supabaseSunucu();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { hata: NextResponse.json({ hata: "Oturum bulunamadı." }, { status: 401 }) };
  const { data: profil } = await sb.from("profiles").select("rol").eq("id", user.id).single();
  if (profil?.rol !== "admin") {
    return { hata: NextResponse.json({ hata: "Bu işlem için yönetici olmalısınız." }, { status: 403 }) };
  }
  return { user };
}

// Kullanıcı güncelle (ad soyad, kullanıcı adı, rol)
export async function PATCH(req: Request) {
  try {
    const dg = await adminDogrula();
    if ("hata" in dg) return dg.hata;

    const { id, adSoyad, kullaniciAdi, rol } = await req.json();
    if (!id) return NextResponse.json({ hata: "id gerekli." }, { status: 400 });

    const guncelleme: Record<string, string | null> = {};
    if (adSoyad !== undefined) guncelleme.ad_soyad = String(adSoyad).trim() || null;
    if (kullaniciAdi !== undefined) {
      const kadi = String(kullaniciAdi).trim().toLowerCase();
      if (!/^[a-z0-9._-]{3,}$/.test(kadi)) {
        return NextResponse.json({ hata: "Geçersiz kullanıcı adı." }, { status: 400 });
      }
      guncelleme.kullanici_adi = kadi;
    }
    if (rol !== undefined) {
      if (!ROLLER.includes(rol)) return NextResponse.json({ hata: "Geçersiz rol." }, { status: 400 });
      guncelleme.rol = rol;
    }

    const admin = supabaseAdmin();
    const { error } = await admin.from("profiles").update(guncelleme).eq("id", id);
    if (error) {
      const mesaj = /duplicate|unique/i.test(error.message) ? "Bu kullanıcı adı zaten kullanılıyor." : error.message;
      return NextResponse.json({ hata: mesaj }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[kullanici PATCH]", e);
    return NextResponse.json({ hata: e instanceof Error ? e.message : "Sunucu hatası." }, { status: 500 });
  }
}

// Kullanıcı sil (profil soft-delete → giriş yapamaz, listede görünmez)
export async function DELETE(req: Request) {
  try {
    const dg = await adminDogrula();
    if ("hata" in dg) return dg.hata;

    const { id } = await req.json();
    if (!id) return NextResponse.json({ hata: "id gerekli." }, { status: 400 });
    if (id === dg.user.id) {
      return NextResponse.json({ hata: "Kendi hesabınızı silemezsiniz." }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const { error } = await admin
      .from("profiles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return NextResponse.json({ hata: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[kullanici DELETE]", e);
    return NextResponse.json({ hata: e instanceof Error ? e.message : "Sunucu hatası." }, { status: 500 });
  }
}
