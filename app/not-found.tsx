"use client";

import Link from "next/link";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import { useDil } from "@/components/providers/dil-provider";

export default function NotFound() {
  const { t } = useDil();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon icon="solar:question-circle-bold-duotone" className="size-9" />
      </span>
      <div className="space-y-1.5">
        <p className="font-heading text-3xl font-bold tracking-tight">404</p>
        <h1 className="text-lg font-semibold">{t("Sayfa bulunamadı")}</h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {t("Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.")}
        </p>
      </div>
      <Button
        render={<Link href="/" />}
        nativeButton={false}
        className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700"
      >
        <Icon icon="solar:home-smile-bold-duotone" className="size-4" />
        {t("Dashboard'a dön")}
      </Button>
    </div>
  );
}
