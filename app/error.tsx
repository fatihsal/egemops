"use client";

import * as React from "react";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300">
        <Icon icon="solar:danger-triangle-bold-duotone" className="size-9" />
      </span>
      <div className="space-y-1.5">
        <h1 className="text-lg font-semibold">Bir şeyler ters gitti</h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Beklenmeyen bir hata oluştu. Tekrar deneyebilir veya panele dönebilirsiniz.
        </p>
        {error?.digest ? (
          <p className="text-xs text-muted-foreground/70">Hata kodu: {error.digest}</p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          onClick={reset}
          className="gap-1.5 bg-teal-600 text-white hover:bg-teal-700"
        >
          <Icon icon="solar:refresh-circle-bold-duotone" className="size-4" />
          Tekrar dene
        </Button>
        <Button
          variant="outline"
          className="gap-1.5"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <Icon icon="solar:home-smile-bold-duotone" className="size-4" />
          Dashboard&apos;a dön
        </Button>
      </div>
    </div>
  );
}
