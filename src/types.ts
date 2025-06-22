// src/types.ts
export interface Article {
  title: string;
  author: string; // enforce string (not null)
  publishedAt: string;
  type: "news" | "blog";
  source: {
    name: string;
  };
}
