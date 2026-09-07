// Belgeler için TanStack Query hook'u.

"use client";

import { useQuery } from "@tanstack/react-query";

import { belgeAnaliziGetir } from "@/lib/data/belgeler";
import { queryKeys } from "@/lib/queries/keys";

export function useBelgeAnaliz() {
  return useQuery({
    queryKey: queryKeys.belgeler.analiz,
    queryFn: belgeAnaliziGetir,
  });
}
