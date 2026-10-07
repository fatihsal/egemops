// Bakım modülü TanStack Query hook'ları.

"use client";

import { useQuery } from "@tanstack/react-query";

import { makineGetir, makineleriGetir } from "@/lib/data/bakim/makineler";
import { bakimDashboardGetir } from "@/lib/data/bakim/dashboard";
import { planlariGetir, planGetir, makinePlanlariGetir } from "@/lib/data/bakim/planlar";
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

export function usePlanlar() {
  return useQuery({ queryKey: queryKeys.bakim.planlar, queryFn: planlariGetir });
}

export function usePlan(id: string) {
  return useQuery({ queryKey: queryKeys.bakim.plan(id), queryFn: () => planGetir(id) });
}

export function useMakinePlanlar(makineId: string) {
  return useQuery({
    queryKey: queryKeys.bakim.makinePlanlar(makineId),
    queryFn: () => makinePlanlariGetir(makineId),
    enabled: !!makineId,
  });
}
