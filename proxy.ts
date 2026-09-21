import { type NextRequest } from "next/server";

import { oturumuGuncelle } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await oturumuGuncelle(request);
}

export const config = {
  matcher: [
    // Statik dosyalar, görseller ve favicon hariç tüm rotalarda çalış.
    "/((?!_next/static|_next/image|favicon.ico|icon.png|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
