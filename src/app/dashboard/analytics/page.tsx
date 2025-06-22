"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AnalyticsChart from "@/components/AnalyticsChart";

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  if (status === "loading") return <p className="text-center mt-10">Loading...</p>;

  if (!session) return null;

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">📊 Analytics</h1>
      <AnalyticsChart />
    </div>
  );
}
