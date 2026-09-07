"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// İkonları çevrimdışı kaydet (API'ye ihtiyaç kalmaz).
import "@/lib/register-icons";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // İstemci örneğini bir kez oluştur; her render'da yeniden kurulmasın.
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 dk boyunca veriyi taze say
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}
