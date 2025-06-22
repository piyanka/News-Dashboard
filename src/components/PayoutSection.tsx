"use client";

import { useEffect, useState } from "react";

interface Article {
  title: string;
  author: string;
  publishedAt: string;
  type: "news" | "blog";
  source: { name: string };
}

interface AuthorStats {
  name: string;
  newsCount: number;
  blogCount: number;
  totalPayout: number;
}

export default function PayoutPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [authorStats, setAuthorStats] = useState<AuthorStats[]>([]);
  const [newsRate, setNewsRate] = useState<number>(() => Number(localStorage.getItem("newsRate")) || 10);
  const [blogRate, setBlogRate] = useState<number>(() => Number(localStorage.getItem("blogRate")) || 15);

  const [currentPage, setCurrentPage] = useState(1);
  const authorsPerPage = 5;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();

        const enriched: Article[] = (data.articles || []).map((a: any) => ({
          title: a.title || "Untitled",
          author: a.author || "Unknown",
          publishedAt: a.publishedAt || new Date().toISOString(),
          type: a.type,
          source: a.source || { name: "Unknown" },
        }));

        setArticles(enriched);
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const stats: Record<string, { news: number; blog: number }> = {};
    articles.forEach((a) => {
      if (!stats[a.author]) stats[a.author] = { news: 0, blog: 0 };
      if (a.type === "news") stats[a.author].news++;
      else stats[a.author].blog++;
    });

    const result: AuthorStats[] = Object.entries(stats).map(([author, counts]) => ({
      name: author,
      newsCount: counts.news,
      blogCount: counts.blog,
      totalPayout: counts.news * newsRate + counts.blog * blogRate,
    }));

    setAuthorStats(result);
  }, [articles, newsRate, blogRate]);

  const handleRateChange = (type: "news" | "blog", value: number) => {
    if (type === "news") {
      setNewsRate(value);
      localStorage.setItem("newsRate", String(value));
    } else {
      setBlogRate(value);
      localStorage.setItem("blogRate", String(value));
    }
  };

  const totalNews = authorStats.reduce((sum, a) => sum + a.newsCount, 0);
  const totalBlogs = authorStats.reduce((sum, a) => sum + a.blogCount, 0);
  const totalPayout = authorStats.reduce((sum, a) => sum + a.totalPayout, 0);

  useEffect(() => {
    localStorage.setItem("totalPayoutAmount", String(totalPayout));
  }, [totalPayout]);

  const totalPages = Math.ceil(authorStats.length / authorsPerPage);
  const indexOfLast = currentPage * authorsPerPage;
  const indexOfFirst = indexOfLast - authorsPerPage;
  const currentAuthors = authorStats.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">
          💸 Payout Summary
        </h1>

        <div className="flex gap-4 flex-wrap justify-center mb-6">
          <div className="flex items-center gap-2">
            <label className="font-medium">News Rate:</label>
            <input
              type="number"
              value={newsRate}
              onChange={(e) => handleRateChange("news", +e.target.value)}
              className="border px-2 py-1 rounded w-24 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-medium">Blog Rate:</label>
            <input
              type="number"
              value={blogRate}
              onChange={(e) => handleRateChange("blog", +e.target.value)}
              className="border px-2 py-1 rounded w-24 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border dark:border-gray-600 rounded">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">News Articles</th>
                <th className="px-4 py-2 text-left">Blogs</th>
                <th className="px-4 py-2 text-left">Total Payout (₹)</th>
              </tr>
            </thead>
            <tbody>
              {currentAuthors.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2">{a.name}</td>
                  <td className="px-4 py-2">{a.newsCount}</td>
                  <td className="px-4 py-2">{a.blogCount}</td>
                  <td className="px-4 py-2">₹ {a.totalPayout}</td>
                </tr>
              ))}
              {currentPage === totalPages && (
                <tr className="bg-blue-50 dark:bg-blue-900 font-semibold">
                  <td className="px-4 py-2">Total</td>
                  <td className="px-4 py-2">{totalNews}</td>
                  <td className="px-4 py-2">{totalBlogs}</td>
                  <td className="px-4 py-2">₹ {totalPayout}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"
          >
            ⬅ Prev
          </button>

          <span className="px-3 py-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
}
