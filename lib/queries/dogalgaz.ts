// Doğalgaz Analizi için TanStack Query hook'u.

"use client";

import { useQuery } from "@tanstack/react-query";

import { dogalgazAnaliziGetir } from "@/lib/data/dogalgaz";
import { queryKeys } from "@/lib/queries/keys";

export function useDogalgazAnaliz() {
  return useQuery({
    queryKey: queryKeys.dogalgaz.analiz,
    queryFn: dogalgazAnaliziGetir,
  });
}
