import { Suspense } from "react";

import { GmailAyar } from "@/components/satinalma/ayarlar/gmail-ayar";
import { FirmaProfil } from "@/components/satinalma/ayarlar/firma-profil";

export default function SatinalmaAyarlarPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <FirmaProfil />
      <Suspense>
        <GmailAyar />
      </Suspense>
    </div>
  );
}
