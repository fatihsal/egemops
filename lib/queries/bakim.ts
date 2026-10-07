// Bakım modülü TanStack Query hook'ları.

"use client";

import { useQuery } from "@tanstack/react-query";

import { makineGetir, makineleriGetir } from "@/lib/data/bakim/makineler";
import { bakimDashboardGetir } from "@/lib/data/bakim/dashboard";
import { queryKeys } from "@/lib/queries/keys";

export function useBakimDashboard() {
  return useQuery({ queryKey: queryKeys.bakim.dashboard, queryFn: bakimDashboardGetir });
}

export function useMakineler() {
  return useQuery({ queryKey: queryKeys.bakim.makineler, queryFn: makineleriGetir });
}

export function useMakine(id: string) {
  return useQuery({ queryKey: queryKeys.bakim.makine(id), queryFn: () => makineGetir(id) });
}
