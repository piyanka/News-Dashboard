"use client";

import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, ChartDataLabels);

interface Article {
  title: string;
  author: string | null;
  publishedAt: string;
  type: string;
  source: { name: string };
}

export default function AnalyticsChartPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [chartType, setChartType] = useState<"author" | "type">("author");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        const data = await res.json();

        const enriched = (data.articles || []).map((item: any) => ({
          title: item.title || "Untitled",
          author: item.author || "Unknown",
          publishedAt: item.publishedAt || new Date().toISOString(),
          source: item.source || { name: "Unknown" },
          type: item.type || "news",
        }));

        setArticles(enriched);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      }
    };

    fetchArticles();
  }, []);

  const authorCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};

  articles.forEach((a) => {
    const author = a.author || "Unknown";
    authorCounts[author] = (authorCounts[author] || 0) + 1;
    typeCounts[a.type] = (typeCounts[a.type] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(authorCounts),
    datasets: [
      {
        label: "Articles per Author",
        data: Object.values(authorCounts),
        backgroundColor: "#60a5fa", // Tailwind blue-400
      },
    ],
  };

  const pieData = {
    labels: Object.keys(typeCounts),
    datasets: [
      {
        label: "Article Type",
        data: Object.values(typeCounts),
        backgroundColor: ["#facc15", "#4ade80", "#3b82f6", "#f87171"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions: ChartOptions<"pie"> = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          color: "#000", // overridden below based on theme
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
            const percent = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percent}%)`;
          },
        },
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold" as const,
        },
        formatter: (value: number, context: any) => {
          const total = context.chart.data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
          const percent = ((value / total) * 100).toFixed(0);
          return `${percent}%`;
        },
      },
    },
  };

  // Optional: Dark mode label adjustment
  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    pieOptions.plugins!.legend!.labels!.color = dark ? "#fff" : "#000";
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 px-4 py-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6">📊 News Analytics</h1>

        <div className="mb-6 flex justify-center gap-4">
          <button
            onClick={() => setChartType("author")}
            className={`px-4 py-2 rounded font-medium border ${
              chartType === "author"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-300 border-blue-600"
            }`}
          >
            Articles by Author
          </button>

          <button
            onClick={() => setChartType("type")}
            className={`px-4 py-2 rounded font-medium border ${
              chartType === "type"
                ? "bg-green-600 text-white"
                : "bg-white text-green-600 dark:bg-gray-800 dark:text-green-300 border-green-600"
            }`}
          >
            Type Breakdown
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 shadow-md">
          {chartType === "author" ? (
            <>
              <h2 className="text-lg font-semibold mb-3 text-blue-700 dark:text-blue-300">
                Bar Chart: Articles per Author
              </h2>
              <Bar data={barData} />
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">
                Pie Chart: Article Type Distribution
              </h2>
              <div className="flex justify-center">
                <div className="w-[300px] md:w-[400px] lg:w-[450px]">
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
