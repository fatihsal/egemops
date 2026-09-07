// TEP Analizi için TanStack Query hook'u.

"use client";

import { useQuery } from "@tanstack/react-query";

import { tepAnaliziGetir } from "@/lib/data/tep";
import { queryKeys } from "@/lib/queries/keys";

export function useTepAnaliz() {
  return useQuery({
    queryKey: queryKeys.tep.analiz,
    queryFn: tepAnaliziGetir,
  });
}
