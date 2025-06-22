"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Filters from "@/components/Filters";
import ArticlesTable from "@/components/ArticlesTable";
import AnalyticsChart from "@/components/AnalyticsChart";
import OverviewCards from "@/components/OverviewCards";
import PayoutSection from "@/components/PayoutSection";
import useIsAdmin from "@/hooks/useIsAdmin";
import {
  exportToCSV,
  exportToPDF,
  exportToGoogleSheets,
} from "@/utils/exportUtils";
import { Article } from "@/types";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAdmin = useIsAdmin();

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPayout, setShowPayout] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [totalPayoutAmount, setTotalPayoutAmount] = useState<number>(0);

  const [filters, setFilters] = useState({
    search: "",
    author: "",
    type: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  useEffect(() => {
    const payout = Number(localStorage.getItem("totalPayoutAmount")) || 0;
    setTotalPayoutAmount(payout);
  }, [showPayout]);

  if (status === "loading") return <p className="text-center mt-10">Loading...</p>;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 p-4 space-y-6">
      <Navbar
        onToggleAnalytics={() => setShowAnalytics((p) => !p)}
        onTogglePayout={() => setShowPayout((p) => !p)}
      />

      <OverviewCards articles={filteredArticles} totalPayout={totalPayoutAmount} />
      <Filters onFilter={setFilters} />
      <ArticlesTable filters={filters} onDataChange={setFilteredArticles} />

      {/* Export Button */}

      <div className="flex justify-end mt-4">
        <div className="relative inline-block text-left">
          <button
            onClick={() => setShowExportMenu((prev) => !prev)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow inline-flex items-center"
          >
            📤 Export Payout Report
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700">
              <div className="py-1 text-gray-800 dark:text-gray-100">
                <button
                  onClick={() => {
                    exportToPDF(filteredArticles);
                    setShowExportMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  📄 Export as PDF
                </button>
                <button
                  onClick={() => {
                    exportToCSV(filteredArticles);
                    setShowExportMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  📁 Export as CSV
                </button>
                <button
                  onClick={() => {
                    exportToGoogleSheets(filteredArticles);
                    setShowExportMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  📊 Export to Google Sheets
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      {showAnalytics && <AnalyticsChart />}
      {isAdmin && showPayout && <PayoutSection />}
    </div>
  );
}
