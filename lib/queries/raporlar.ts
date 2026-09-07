// Raporlar için TanStack Query hook'u.

"use client";

import { useQuery } from "@tanstack/react-query";

import { raporAnaliziGetir } from "@/lib/data/raporlar";
import { queryKeys } from "@/lib/queries/keys";

export function useRaporAnaliz() {
  return useQuery({
    queryKey: queryKeys.raporlar.analiz,
    queryFn: raporAnaliziGetir,
  });
}
