// Akaryakıt Analizi için TanStack Query hook'u.

"use client";

import { useQuery } from "@tanstack/react-query";

import { akaryakitAnaliziGetir } from "@/lib/data/akaryakit";
import { queryKeys } from "@/lib/queries/keys";

export function useAkaryakitAnaliz() {
  return useQuery({
    queryKey: queryKeys.akaryakit.analiz,
    queryFn: akaryakitAnaliziGetir,
  });
}
