"use client";

import { useQuery } from "@tanstack/react-query";

import {
  enerjiKayitlariGetir,
  kayitGetir,
  kayitOzetiGetir,
  yillikOzetGetir,
} from "@/lib/data/kayitlar";
import { queryKeys } from "@/lib/queries/keys";

export function useKayit(id: string) {
  return useQuery({
    queryKey: queryKeys.kayitlar.kayit(id),
    queryFn: () => kayitGetir(id),
  });
}

export function useEnerjiKayitlari() {
  return useQuery({
    queryKey: queryKeys.kayitlar.liste,
    queryFn: enerjiKayitlariGetir,
  });
}

export function useKayitOzeti() {
  return useQuery({
    queryKey: queryKeys.kayitlar.ozet,
    queryFn: kayitOzetiGetir,
  });
}

export function useYillikOzet() {
  return useQuery({
    queryKey: queryKeys.kayitlar.yillik,
    queryFn: yillikOzetGetir,
  });
}
