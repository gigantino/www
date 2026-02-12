"use client";

import { usePathname } from "next/navigation";
import { blogPosts } from "@/lib/data";
import { TriangleAlert } from "lucide-react";

export function WipBanner() {
  const pathname = usePathname();
  const post = blogPosts.find((p) => p.url === pathname);

  if (!post?.wip) return null;

  return (
    <div className="mb-8 flex items-center gap-2 border-2 border-gray-800 bg-amber-100 px-4 py-3 text-sm font-medium text-gray-800 shadow-[4px_4px_0_theme(colors.gray.800)] dark:border-gray-600 dark:bg-amber-900/50 dark:text-amber-200 dark:shadow-[4px_4px_0_theme(colors.gray.600)]">
      <TriangleAlert className="size-4 shrink-0" />
      This post is a work in progress. Content may be incomplete or change.
    </div>
  );
}
