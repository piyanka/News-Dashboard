"use client";
import { Article } from "@/types";
import useIsAdmin from "@/hooks/useIsAdmin";

interface Props {
  articles: Article[];
  totalPayout: number;
}

export default function OverviewCards({ articles, totalPayout }: Props) {
  const isAdmin = useIsAdmin();

  const totalArticles = articles.filter((a) => a.type === "news").length;
  const totalBlogs = articles.filter((a) => a.type === "blog").length;
  const totalAuthors = new Set(articles.map((a) => a.author || "Unknown")).size;

  const cardStyle =
    "bg-white dark:bg-gray-800 shadow rounded-md px-4 py-3 text-center w-40 sm:w-48 md:w-44 lg:w-40";

  const labelStyle = "text-sm text-gray-500 dark:text-gray-300";
  const valueStyle = "text-xl font-semibold dark:text-white";

  return (
    <div className="flex flex-wrap justify-center gap-6 mt-4">
      <div className={cardStyle}>
        <h3 className={labelStyle}>📰 Articles</h3>
        <p className={valueStyle}>{totalArticles}</p>
      </div>
      <div className={cardStyle}>
        <h3 className={labelStyle}>✍️ Blogs</h3>
        <p className={valueStyle}>{totalBlogs}</p>
      </div>
      <div className={cardStyle}>
        <h3 className={labelStyle}>👤 Authors</h3>
        <p className={valueStyle}>{totalAuthors}</p>
      </div>
      {isAdmin && (
        <div className={cardStyle}>
          <h3 className={labelStyle}>💸 Total Payout</h3>
          <p className={valueStyle}>₹{totalPayout}</p>
        </div>
      )}
    </div>
  );
}
