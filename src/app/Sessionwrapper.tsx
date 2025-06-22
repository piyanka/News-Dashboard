"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const enableDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDark(enableDark);
    document.documentElement.classList.toggle("dark", enableDark);
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
