// Enerji Projeleri için TanStack Query hook'u.

"use client";

import { useQuery } from "@tanstack/react-query";

import { projeAnaliziGetir } from "@/lib/data/projeler";
import { queryKeys } from "@/lib/queries/keys";

export function useProjeAnaliz() {
  return useQuery({
    queryKey: queryKeys.projeler.analiz,
    queryFn: projeAnaliziGetir,
  });
}
