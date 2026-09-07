"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Her route değişiminde sayfa içeriğini yumuşak bir giriş animasyonuyla getirir.
 * `key={pathname}` sayesinde yeni sayfa mount olunca animasyon yeniden oynar.
 * Hareket azaltma tercihinde (prefers-reduced-motion) animasyon devre dışı kalır.
 */
export function SayfaGecis({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div
      key={pathname}
      className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-3 motion-safe:duration-500 motion-safe:ease-out"
    >
      {children}
    </div>
  );
}
