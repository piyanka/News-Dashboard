"use client";

import { signOut, useSession } from "next-auth/react";
import useIsAdmin from "@/hooks/useIsAdmin";
import useDarkMode from "@/hooks/useDarkMode";
import Link from "next/link";

type Props = {
  onToggleAnalytics?: () => void;
  onTogglePayout: () => void;
};

export default function Navbar({ onToggleAnalytics, onTogglePayout }: Props) {
  const { data: session } = useSession();
  const isAdmin = useIsAdmin();
  const { isDark, toggleDarkMode } = useDarkMode(); // ✅ good usage

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 border-gray-300 dark:border-gray-600">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-300">News Dashboard</h1>

      <div className="flex gap-3 flex-wrap justify-center mt-2 sm:mt-0">
        {/* ✅ Theme toggle button */}
        {/* <button
          onClick={toggleDarkMode}
          className="px-3 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded border border-gray-300 dark:border-gray-600 hover:shadow"
        >
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button> */}

        {/* Analytics link */}
        <Link
          href="/dashboard/analytics"
          className="text-sm px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700"
        >
          📊 Analytics
        </Link>

        {/* Admin-only Payout */}
        {isAdmin ? (
          <Link
            href="/dashboard/payout"
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            💰 Payout
          </Link>
        ) : (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">
            🔒 Admin Only
          </span>
        )}

        {/* Sign out */}
        {session && (
          <button
            onClick={() => signOut()}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
}
