"use server";

import { ofetch } from "ofetch";
import type { Articles } from "@/types/articles";
import ArticleCard from "./ArticleCard";

export default async function ArticleList() {
  const articles = await ofetch<Articles>(
    "https://cdn.ggtn.ch/blog/articles.json"
  );

  return (
    <div className="grid gap-4">
      {articles.map((a) => (
        <ArticleCard
          key={a.id}
          href={`https://legacy.ggtn.ch/blog/${a.id}`}
          title={a.title}
          description={a.description}
          tags={a.tags}
          pubDate={a.pubDate}
        />
      ))}
    </div>
  );
}
