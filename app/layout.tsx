import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { DilProvider } from "@/components/providers/dil-provider";
import type { Dil } from "@/lib/i18n/sozluk";
import { AppShell } from "@/components/layout/app-shell";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EgemOps",
  description: "Operasyon yönetim paneli",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const dil: Dil = (await cookies()).get("egemops-dil")?.value === "en" ? "en" : "tr";

  return (
    <html
      lang={dil}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <DilProvider baslangic={dil}>
              <AppShell>{children}</AppShell>
              <Toaster position="bottom-right" />
            </DilProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
