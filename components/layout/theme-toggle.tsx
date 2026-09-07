"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Tema yalnızca istemcide bilindiği için hydration uyumsuzluğunu önle.
  React.useEffect(() => setMounted(true), []);

  const koyu = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Temayı değiştir"
      onClick={() => setTheme(koyu ? "light" : "dark")}
    >
      {mounted && koyu ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
