"use client";

import { useState } from "react";

interface Props {
  onFilter: (filters: {
    search: string;
    author: string;
    type: string;
    fromDate: string;
    toDate: string;
  }) => void;
}

export default function Filters({ onFilter }: Props) {
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFilterChange = () => {
    onFilter({ search, author, type, fromDate, toDate });
  };

  return (
    <div className="mb-6 space-y-4">
      {/* 🔍 Search Bar - Top Centered */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="🔍 Search by title, author, or source..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleFilterChange();
          }}
          className="w-full sm:w-2/3 md:w-1/2 border px-4 py-2 rounded shadow-sm bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* 🎯 Filter Bar - Horizontal */}
      <div className="w-full flex flex-wrap md:flex-nowrap gap-4 items-end bg-white dark:bg-gray-900 border dark:border-gray-700 p-4 rounded shadow">
        {/* Author Filter */}
        <div className="flex flex-col flex-1 min-w-[180px]">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            👤 Author
          </label>
          <select
            value={author}
            onChange={(e) => {
              setAuthor(e.target.value);
              handleFilterChange();
            }}
            className="border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="">All</option>
            <option value="John">John</option>
            <option value="Priya">Priya</option>
            <option value="Alex">Alex</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex flex-col flex-1 min-w-[160px]">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            📄 Type
          </label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              handleFilterChange();
            }}
            className="border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="">All</option>
            <option value="news">📰 News</option>
            <option value="blog">✍️ Blog</option>
          </select>
        </div>

        {/* From Date */}
        <div className="flex flex-col flex-1 min-w-[160px]">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            📅 From
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              handleFilterChange();
            }}
            className="border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* To Date */}
        <div className="flex flex-col flex-1 min-w-[160px]">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            📅 To
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              handleFilterChange();
            }}
            className="border px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
      </div>

    </div>
  );
}
