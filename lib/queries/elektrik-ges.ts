// Elektrik & GES Analizi için TanStack Query hook'u.
// Ekran veriyi doğrudan lib/data'dan değil bu hook üzerinden alır.

"use client";

import { useQuery } from "@tanstack/react-query";

import { elektrikGesAnaliziGetir } from "@/lib/data/elektrik-ges";
import { queryKeys } from "@/lib/queries/keys";

export function useElektrikGesAnaliz() {
  return useQuery({
    queryKey: queryKeys.elektrikGes.analiz,
    queryFn: elektrikGesAnaliziGetir,
  });
}
