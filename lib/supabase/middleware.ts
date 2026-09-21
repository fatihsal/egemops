// Her istekte Supabase oturumunu tazeler ve rota korumasını uygular.
// Girişi olmayan kullanıcı /login'e, girişi olan kullanıcı /login'den panele yönlendirilir.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Girişsiz erişilebilen rotalar (login ekranı).
const ACIK_ROTALAR = ["/login"];

export async function oturumuGuncelle(request: NextRequest) {
  let yanit = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(ayarlanacaklar) {
          ayarlanacaklar.forEach(({ name, value }) => request.cookies.set(name, value));
          yanit = NextResponse.next({ request });
          ayarlanacaklar.forEach(({ name, value, options }) =>
            yanit.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ÖNEMLİ: getUser() ile oturumu doğrula (getSession'a güvenme).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const yol = request.nextUrl.pathname;
  const acikRota = ACIK_ROTALAR.some((r) => yol === r || yol.startsWith(r + "/"));

  // Girişsiz + korumalı rota → login'e gönder.
  if (!user && !acikRota) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Girişli + login sayfası → panele gönder.
  if (user && acikRota) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return yanit;
}
