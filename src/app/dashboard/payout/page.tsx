// app/dashboard/payout/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PayoutSection from "@/components/PayoutSection";
import useIsAdmin from "@/hooks/useIsAdmin";
import { useEffect } from "react";

export default function PayoutPage() {
  const { data: session, status } = useSession();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-red-600 text-xl font-semibold dark:bg-gray-900 dark:text-red-300">
        ⛔ You are not authorized to view this page
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">💸 Payout</h1>
      <PayoutSection />
    </div>
  );
}
