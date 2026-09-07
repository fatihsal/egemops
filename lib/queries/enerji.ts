// Enerji yönetimi için TanStack Query hook'ları.
// Ekranlar veriyi doğrudan `lib/data`'dan değil bu hook'lar üzerinden alır.
// Hook'lar seçili dönemi alır; dönem değişince otomatik yeniden sorgulanır.

"use client";

import { useQuery } from "@tanstack/react-query";

import {
  aylikMaliyetGetir,
  enerjiKaynakDagilimiGetir,
  enerjiKpiGetir,
  gesPerformansGetir,
  karbonOzetGetir,
  enerjiFirsatGetir,
  enerjiHedefGetir,
  enerjiYogunlukGetir,
  guncellemelerGetir,
  kaynakDagilimiGetir,
  sebekeGesGetir,
  tuketimSerisiGetir,
  turTuketimGetir,
  veriDurumGetir,
  yillikTepGetir,
} from "@/lib/data/enerji";
import { queryKeys } from "@/lib/queries/keys";
import type { Donem } from "@/lib/donem";

export function useEnerjiKpi() {
  return useQuery({
    queryKey: queryKeys.enerji.kpi,
    queryFn: enerjiKpiGetir,
  });
}

export function useTurTuketim(donem: Donem) {
  return useQuery({
    queryKey: queryKeys.enerji.turTuketim(donem),
    queryFn: () => turTuketimGetir(donem),
  });
}

export function useKaynakDagilimi(donem: Donem) {
  return useQuery({
    queryKey: queryKeys.enerji.kaynakDagilimi(donem),
    queryFn: () => kaynakDagilimiGetir(donem),
  });
}

export function useKarbonOzet(donem: Donem) {
  return useQuery({
    queryKey: queryKeys.enerji.karbon(donem),
    queryFn: () => karbonOzetGetir(donem),
  });
}

export function useTuketimSerisi(donem: Donem) {
  return useQuery({
    queryKey: queryKeys.enerji.tuketimSerisi(donem),
    queryFn: () => tuketimSerisiGetir(donem),
  });
}

export function useAylikMaliyet() {
  return useQuery({
    queryKey: queryKeys.enerji.aylikMaliyet,
    queryFn: aylikMaliyetGetir,
  });
}

export function useYillikTep() {
  return useQuery({
    queryKey: queryKeys.enerji.yillikTep,
    queryFn: yillikTepGetir,
  });
}

export function useEnerjiKaynakDagilimi() {
  return useQuery({
    queryKey: queryKeys.enerji.kaynakDagilim,
    queryFn: enerjiKaynakDagilimiGetir,
  });
}

export function useGesPerformans() {
  return useQuery({
    queryKey: queryKeys.enerji.gesPerformans,
    queryFn: gesPerformansGetir,
  });
}

export function useSebekeGes() {
  return useQuery({
    queryKey: queryKeys.enerji.sebekeGes,
    queryFn: sebekeGesGetir,
  });
}

export function useEnerjiYogunluk() {
  return useQuery({
    queryKey: queryKeys.enerji.yogunluk,
    queryFn: enerjiYogunlukGetir,
  });
}

export function useEnerjiHedef() {
  return useQuery({ queryKey: queryKeys.enerji.hedef, queryFn: enerjiHedefGetir });
}

export function useEnerjiFirsat() {
  return useQuery({ queryKey: queryKeys.enerji.firsat, queryFn: enerjiFirsatGetir });
}

export function useVeriDurum() {
  return useQuery({
    queryKey: queryKeys.enerji.veriDurum,
    queryFn: veriDurumGetir,
  });
}

export function useGuncellemeler() {
  return useQuery({
    queryKey: queryKeys.enerji.guncellemeler,
    queryFn: guncellemelerGetir,
  });
}
