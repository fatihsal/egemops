// Sunucu (server component / route handler / server action) tarafında Supabase.
// Next.js 16'da cookies() async olduğundan bu fonksiyon da async'tir.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function supabaseSunucu() {
  const cerezDepo = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cerezDepo.getAll();
        },
        setAll(ayarlanacaklar) {
          try {
            ayarlanacaklar.forEach(({ name, value, options }) =>
              cerezDepo.set(name, value, options),
            );
          } catch {
            // Server Component içinden çağrıldıysa cookie yazılamaz; sorun değil,
            // oturum yenileme middleware tarafından yapılır.
          }
        },
      },
    },
  );
}
