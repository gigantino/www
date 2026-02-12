"use client";

import { usePathname } from "next/navigation";
import { blogPosts } from "@/lib/data";

const tagColors = [
  "bg-yellow-100 dark:bg-yellow-900/50",
  "bg-pink-100 dark:bg-pink-900/50",
  "bg-green-100 dark:bg-green-900/50",
  "bg-orange-100 dark:bg-orange-900/50",
  "bg-violet-100 dark:bg-violet-900/50",
  "bg-emerald-100 dark:bg-emerald-900/50",
];

export function ArticleMeta() {
  const pathname = usePathname();
  const post = blogPosts.find((p) => p.url === pathname);

  if (!post) return null;

  const hasTags = post.tags && post.tags.length > 0;
  const showDate = !post.wip;

  if (!hasTags && !showDate) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {post.tags?.map((tag, index) => (
        <span
          key={tag}
          className={`inline-block border-2 border-gray-800 px-2 py-0.5 text-xs font-medium dark:border-gray-600 dark:text-gray-200 ${tagColors[index % tagColors.length]}`}
        >
          {tag}
        </span>
      ))}
      {showDate && (
        <time className="text-sm text-gray-800/60 dark:text-gray-400">
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      )}
    </div>
  );
}
