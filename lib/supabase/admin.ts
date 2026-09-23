// SADECE SUNUCU. service_role anahtarı kullanır — asla istemciye sızmamalı.
// Yalnızca server route / server action içinden çağır.

import { createClient } from "@supabase/supabase-js";

export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
