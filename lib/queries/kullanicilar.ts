// Kullanıcılar için TanStack Query hook'u.

"use client";

import { useQuery } from "@tanstack/react-query";

import { kullaniciAnaliziGetir } from "@/lib/data/kullanicilar";
import { queryKeys } from "@/lib/queries/keys";

export function useKullaniciAnaliz() {
  return useQuery({
    queryKey: queryKeys.kullanicilar.analiz,
    queryFn: kullaniciAnaliziGetir,
  });
}
