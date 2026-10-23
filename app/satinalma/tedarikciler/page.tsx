import { Suspense } from "react";

import { TedarikciListesi } from "@/components/satinalma/tedarikciler/tedarikci-listesi";

export default function TedarikcilerPage() {
  return (
    <Suspense>
      <TedarikciListesi />
    </Suspense>
  );
}
