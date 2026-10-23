// Satın Alma modülü TanStack Query hook'ları.

"use client";

import { useQuery } from "@tanstack/react-query";

import { taleplerGetir, talepGetir } from "@/lib/data/satinalma/talepler";
import { tedarikcilerGetir } from "@/lib/data/satinalma/tedarikciler";
import { queryKeys } from "@/lib/queries/keys";

export function useTalepler() {
  return useQuery({ queryKey: queryKeys.satinalma.talepler, queryFn: taleplerGetir });
}

export function useTalep(id: string) {
  return useQuery({ queryKey: queryKeys.satinalma.talep(id), queryFn: () => talepGetir(id), enabled: !!id });
}

export function useTedarikciler() {
  return useQuery({ queryKey: queryKeys.satinalma.tedarikciler, queryFn: tedarikcilerGetir });
}
