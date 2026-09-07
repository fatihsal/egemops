// Yönetim Özeti için TanStack Query hook'u.

"use client";

import { useQuery } from "@tanstack/react-query";

import { yonetimOzetiGetir } from "@/lib/data/yonetim-ozeti";
import { queryKeys } from "@/lib/queries/keys";

export function useYonetimOzeti() {
  return useQuery({
    queryKey: queryKeys.yonetimOzeti.analiz,
    queryFn: yonetimOzetiGetir,
  });
}
