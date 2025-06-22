// hooks/useDarkMode.ts
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function useDarkMode() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return {
    isDark: isMounted && resolvedTheme === "dark",
    toggleDarkMode,
  };
}
