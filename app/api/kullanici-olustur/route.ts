import { NextResponse } from "next/server";

import { supabaseSunucu } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const EPOSTA_DOMAIN = "egemops.local";
const ROLLER = ["admin", "enerji_yoneticisi", "izleyici"];

export async function POST(req: Request) {
  try {
    return await olustur(req);
  } catch (e) {
    console.error("[kullanici-olustur] beklenmeyen hata:", e);
    return NextResponse.json(
      { hata: e instanceof Error ? e.message : "Sunucu hatası." },
      { status: 500 },
    );
  }
}

async function olustur(req: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { hata: "SUPABASE_SERVICE_ROLE_KEY tanımlı değil. .env.local'e ekleyip dev sunucusunu yeniden başlatın." },
      { status: 500 },
    );
  }

  let govde: { adSoyad?: string; kullaniciAdi?: string; sifre?: string; rol?: string };
  try {
    govde = await req.json();
  } catch {
    return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
  }

  const kullaniciAdi = (govde.kullaniciAdi ?? "").trim().toLowerCase();
  const sifre = govde.sifre ?? "";
  const adSoyad = (govde.adSoyad ?? "").trim() || null;
  const rol = ROLLER.includes(govde.rol ?? "") ? govde.rol! : "izleyici";

  if (!/^[a-z0-9._-]{3,}$/.test(kullaniciAdi)) {
    return NextResponse.json(
      { hata: "Kullanıcı adı en az 3 karakter; harf, rakam, . _ - içerebilir." },
      { status: 400 },
    );
  }
  if (sifre.length < 6) {
    return NextResponse.json({ hata: "Şifre en az 6 karakter olmalı." }, { status: 400 });
  }

  // Çağıran gerçekten admin mi? (oturumdan doğrula)
  const sb = await supabaseSunucu();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ hata: "Oturum bulunamadı." }, { status: 401 });

  const { data: profil } = await sb.from("profiles").select("rol").eq("id", user.id).single();
  if (profil?.rol !== "admin") {
    return NextResponse.json({ hata: "Bu işlem için yönetici olmalısınız." }, { status: 403 });
  }

  // service_role ile kullanıcı oluştur
  const admin = supabaseAdmin();
  const eposta = `${kullaniciAdi}@${EPOSTA_DOMAIN}`;
  const { data: olusan, error } = await admin.auth.admin.createUser({
    email: eposta,
    password: sifre,
    email_confirm: true,
    user_metadata: { ad_soyad: adSoyad },
  });
  if (error) {
    const mesaj = /already/i.test(error.message)
      ? "Bu kullanıcı adı zaten kullanılıyor."
      : error.message;
    return NextResponse.json({ hata: mesaj }, { status: 400 });
  }

  // Profil trigger ile açıldı; kullanıcı adı + rol'ü ayarla.
  const { error: upErr } = await admin
    .from("profiles")
    .update({ kullanici_adi: kullaniciAdi, ad_soyad: adSoyad, rol })
    .eq("id", olusan.user.id);
  if (upErr) return NextResponse.json({ hata: upErr.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
