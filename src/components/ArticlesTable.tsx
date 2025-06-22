"use client";

import { useEffect, useState } from "react";
import { Article as RawArticle } from "@/types";

interface Props {
  filters?: {
    search: string;
    author: string;
    type: string;
    fromDate: string;
    toDate: string;
  };
  onDataChange?: (articles: ExportReadyArticle[]) => void;
}

type ExportReadyArticle = Omit<RawArticle, "author"> & { author: string };

export default function ArticleTable({ filters, onDataChange }: Props) {
  const [articles, setArticles] = useState<RawArticle[]>([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const safeFilters = {
    search: "",
    author: "",
    type: "",
    fromDate: "",
    toDate: "",
    ...filters,
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/news", { cache: "no-store" });
      if (!res.ok) throw new Error("News API error");
      const data = await res.json();

      const enrichedArticles = (data.articles || []).map((item: any) => ({
        title: item.title,
        author: item.author,
        publishedAt: item.publishedAt,
        source: item.source,
        type: item.type,
      }));

      setArticles(enrichedArticles);
      setCurrentPage(1);
      setError("");
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("❌ News API is currently unavailable. Please try again later.");
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [
    safeFilters.search,
    safeFilters.author,
    safeFilters.type,
    safeFilters.fromDate,
    safeFilters.toDate,
  ]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      safeFilters.search === "" ||
      article.title.toLowerCase().includes(safeFilters.search.toLowerCase());
    const matchesAuthor =
      safeFilters.author === "" ||
      (article.author &&
        article.author.toLowerCase().includes(safeFilters.author.toLowerCase()));
    const matchesType =
      safeFilters.type === "" || article.type === safeFilters.type;
    const matchesDate =
      (!safeFilters.fromDate ||
        new Date(article.publishedAt) >= new Date(safeFilters.fromDate)) &&
      (!safeFilters.toDate ||
        new Date(article.publishedAt) <= new Date(safeFilters.toDate));

    return matchesSearch && matchesAuthor && matchesType && matchesDate;
  });

  useEffect(() => {
    if (onDataChange) {
      onDataChange(
        articles.map((a) => ({
          ...a,
          author: a.author || "Unknown",
        }))
      );
    }
  }, [articles]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirst, indexOfLast);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="bg-red-100 text-red-800 p-3 mb-4 rounded border border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700 text-sm">
          {error}
        </div>
      )}

      <table className="min-w-full border rounded dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">S.No</th>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Author</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Type</th>
          </tr>
        </thead>
        <tbody>
          {currentArticles.map((a, i) => (
            <tr
              key={i}
              className="hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-100"
            >
              <td className="px-4 py-2">{indexOfFirst + i + 1}</td>
              <td className="px-4 py-2">{a.title}</td>
              <td className="px-4 py-2">{a.author || "Unknown"}</td>
              <td className="px-4 py-2">
                {new Date(a.publishedAt).toLocaleString()}
              </td>
              <td className="px-4 py-2">{a.type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"
        >
          ⬅ Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded border dark:border-gray-600 ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 dark:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}
