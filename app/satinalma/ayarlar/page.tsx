import { Suspense } from "react";

import { GmailAyar } from "@/components/satinalma/ayarlar/gmail-ayar";

export default function SatinalmaAyarlarPage() {
  return (
    <Suspense>
      <GmailAyar />
    </Suspense>
  );
}
