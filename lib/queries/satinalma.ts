// Satın Alma modülü TanStack Query hook'ları.

"use client";

import { useQuery } from "@tanstack/react-query";

import { taleplerGetir, talepGetir } from "@/lib/data/satinalma/talepler";
import { tedarikcilerGetir } from "@/lib/data/satinalma/tedarikciler";
import { rfqListele } from "@/lib/data/satinalma/rfq";
import { teklifListele } from "@/lib/data/satinalma/teklifler";
import { firmaProfiliGetir } from "@/lib/data/satinalma/ayarlar";
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

export function useTalepRfq(talepId: string) {
  return useQuery({ queryKey: queryKeys.satinalma.talepRfq(talepId), queryFn: () => rfqListele(talepId), enabled: !!talepId });
}

export function useTalepTeklifler(talepId: string) {
  return useQuery({ queryKey: queryKeys.satinalma.talepTeklifler(talepId), queryFn: () => teklifListele(talepId), enabled: !!talepId });
}

export function useFirmaProfili() {
  return useQuery({ queryKey: queryKeys.satinalma.firmaProfili, queryFn: firmaProfiliGetir });
}
