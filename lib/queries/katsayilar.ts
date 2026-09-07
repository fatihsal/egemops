// Katsayılar için TanStack Query hook'u.

"use client";

import { useQuery } from "@tanstack/react-query";

import { katsayiAnaliziGetir } from "@/lib/data/katsayilar";
import { queryKeys } from "@/lib/queries/keys";

export function useKatsayiAnaliz() {
  return useQuery({
    queryKey: queryKeys.katsayilar.analiz,
    queryFn: katsayiAnaliziGetir,
  });
}
