"use client";

import { usePathname } from "next/navigation";
import { blogPosts } from "@/lib/data";

export function RecentArticles() {
  const pathname = usePathname();
  const articles = blogPosts
    .filter((post) => !post.wip && post.url !== pathname)
    .slice(0, 3);

  if (articles.length === 0) return null;

  return (
    <div className="mt-10 pb-10">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Other articles</h3>
      <ul className="mt-3 flex flex-col gap-3">
        {articles.map((post) => (
          <li key={post.url}>
            <a href={post.url} className="group flex flex-col gap-0.5">
              <span className="font-medium text-gray-800 underline decoration-gray-300 underline-offset-2 group-hover:decoration-gray-800 dark:text-gray-200 dark:decoration-gray-600 dark:group-hover:decoration-gray-400">
                {post.title}
              </span>
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
