import { NextResponse } from "next/server";

// --- In-memory rate limiter (per-process) ---
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 min
const MAX_REQUESTS_PER_WINDOW = 10;
let requestCount = 0;
let lastResetTime = Date.now();

export async function GET() {
  const now = Date.now();

  // Reset counter every window
  if (now - lastResetTime > RATE_LIMIT_WINDOW_MS) {
    requestCount = 0;
    lastResetTime = now;
  }

  requestCount++;
  if (requestCount > MAX_REQUESTS_PER_WINDOW) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const apiKey = process.env.NEWS_API_KEY;
  const newsUrl = `https://newsapi.org/v2/everything?q=technology&language=en&pageSize=10&sortBy=publishedAt&apiKey=${apiKey}`;
  const blogUrl = `https://dev.to/api/articles?per_page=10`;

  try {
    const [newsRes, blogRes] = await Promise.all([
      fetch(newsUrl).catch((err) => {
        console.error("Error fetching news:", err);
        throw new Error("News API fetch failed");
      }),
      fetch(blogUrl).catch((err) => {
        console.error("Error fetching blog:", err);
        throw new Error("Blog API fetch failed");
      }),
    ]);

    if (!newsRes.ok) {
      const errText = await newsRes.text();
      console.error("News API error response:", errText);
      throw new Error("Failed to fetch news");
    }

    if (!blogRes.ok) {
      const errText = await blogRes.text();
      console.error("Blog API error response:", errText);
      throw new Error("Failed to fetch blogs");
    }

    const newsJson = await newsRes.json();
    const blogJson = await blogRes.json();

    const newsArticles = (newsJson.articles || []).map((item: any) => ({
      title: item.title ?? "Untitled",
      author: item.author ?? "Unknown",
      publishedAt: item.publishedAt ?? new Date().toISOString(),
      source: item.source ?? { name: "Unknown" },
      type: "news",
    }));

    const blogArticles = (Array.isArray(blogJson) ? blogJson : []).map((item: any) => ({
      title: item.title ?? "Untitled",
      author: item.user?.name ?? "Unknown",
      publishedAt: item.published_at ?? new Date().toISOString(),
      source: { name: "dev.to" },
      type: "blog",
    }));

    const enriched = [...newsArticles, ...blogArticles];

    return new NextResponse(
      JSON.stringify({ articles: enriched }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("API Error:", error.message);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Unexpected error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
