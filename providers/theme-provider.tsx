"use client";

import { ENUMs } from "@/lib/enums";
import { getCookie } from "cookies-next/client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = getCookie(ENUMs.GLOBAL.THEME_COOKIE);
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
