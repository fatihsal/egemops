// Enerji Performansı için TanStack Query hook'u.

"use client";

import { useQuery } from "@tanstack/react-query";

import { performansAnaliziGetir } from "@/lib/data/performans";
import { queryKeys } from "@/lib/queries/keys";

export function usePerformansAnaliz() {
  return useQuery({
    queryKey: queryKeys.performans.analiz,
    queryFn: performansAnaliziGetir,
  });
}
