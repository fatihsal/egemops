// Bakım modülü TanStack Query hook'ları.

"use client";

import { useQuery } from "@tanstack/react-query";

import { makineGetir, makineleriGetir } from "@/lib/data/bakim/makineler";
import { queryKeys } from "@/lib/queries/keys";

export function useMakineler() {
  return useQuery({ queryKey: queryKeys.bakim.makineler, queryFn: makineleriGetir });
}

export function useMakine(id: string) {
  return useQuery({ queryKey: queryKeys.bakim.makine(id), queryFn: () => makineGetir(id) });
}
