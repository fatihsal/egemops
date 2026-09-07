// Enerji Fırsatları için TanStack Query hook'u.

"use client";

import { useQuery } from "@tanstack/react-query";

import { firsatAnaliziGetir } from "@/lib/data/firsatlar";
import { queryKeys } from "@/lib/queries/keys";

export function useFirsatAnaliz() {
  return useQuery({
    queryKey: queryKeys.firsatlar.analiz,
    queryFn: firsatAnaliziGetir,
  });
}
