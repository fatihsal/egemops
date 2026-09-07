import Link from "next/link";
import { Icon } from "@iconify/react";

import { AyarlarIcerik } from "@/components/ayarlar/ayarlar-icerik";

export default function AyarlarPage() {
  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="space-y-1">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">Enerji Yönetimi</Link>
          <Icon icon="solar:alt-arrow-right-linear" className="size-3.5" />
          <span className="text-foreground">Ayarlar</span>
        </nav>
        <h1 className="text-2xl font-semibold tracking-tight">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">
          Profil, kurum bilgileri, bildirimler, görünüm ve entegrasyon tercihlerinizi yönetin.
        </p>
      </div>

      <div className="max-w-4xl">
        <AyarlarIcerik />
      </div>
    </div>
  );
}
