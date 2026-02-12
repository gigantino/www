"use client";

import { useState } from "react";
import { blogPosts } from "@/lib/data";
import { BentoCard } from "./ui/BentoCard";
import { Rss, PenLine, Check, X } from "lucide-react";

const tagColors = [
  "bg-yellow-100",
  "bg-pink-100",
  "bg-green-100",
  "bg-orange-100",
  "bg-violet-100",
  "bg-emerald-100",
];

const hasWipPosts = blogPosts.some((post) => post.wip);

export function Writing() {
  const [showWip, setShowWip] = useState(true);

  const publishedPosts = blogPosts.filter((post) => !post.wip);
  const wipPosts = blogPosts.filter((post) => post.wip);

  return (
    <BentoCard id="writing" className="flex flex-col gap-4 bg-sky-100">
      <h2 className="text-xl font-bold flex items-center gap-2"><PenLine className="size-5" /> Writing</h2>
      <ul className="flex flex-col gap-5">
        {publishedPosts.map((post) => (
          <li key={post.url}>
            <a href={post.url} className="group flex flex-col gap-1">
                <span className="neo-link font-medium group-hover:text-gray-800">
                  {post.title}
                </span>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.map((tag, index) => (
                      <span
                        key={tag}
                        className={`inline-block border-2 border-gray-800 px-2 py-0.5 text-xs font-medium ${tagColors[index % tagColors.length]}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {post.description && (
                  <p className="line-clamp-2 text-base text-gray-600">
                    {post.description}
                  </p>
                )}
                <time className="text-base text-gray-500">
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
      {showWip && wipPosts.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <div className="h-0.5 flex-1 bg-gray-800/20" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Work in Progress</span>
            <div className="h-0.5 flex-1 bg-gray-800/20" />
          </div>
          <ul className="flex flex-col gap-5">
            {wipPosts.map((post) => (
              <li key={post.url}>
                <a href={post.url} className="group flex flex-col gap-1">
                    <span className="neo-link font-medium group-hover:text-gray-800">
                      {post.title}
                      <span className="ml-2 inline-block border-2 border-gray-800 bg-amber-100 px-2 py-0.5 text-xs font-medium align-middle">
                        WIP
                      </span>
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <span
                            key={tag}
                            className={`inline-block border-2 border-gray-800 px-2 py-0.5 text-xs font-medium ${tagColors[index % tagColors.length]}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {post.description && (
                      <p className="line-clamp-2 text-base text-gray-600">
                        {post.description}
                      </p>
                    )}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="flex items-center gap-4">
        <a href="/feed.xml" className="neo-link text-base text-gray-600 flex items-center gap-1">
          <Rss size={14} />
          RSS Feed
        </a>
        {hasWipPosts && (
          <label className="flex items-center gap-1.5 text-sm text-gray-500 cursor-pointer select-none">
            <span className="relative inline-flex items-center justify-center">
              <input
                type="checkbox"
                checked={showWip}
                onChange={(e) => setShowWip(e.target.checked)}
                className="peer sr-only"
              />
              <span className="flex h-4 w-4 items-center justify-center border-2 border-gray-800 bg-white shadow-[2px_2px_0_0_theme(colors.gray.800)] transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-gray-800 peer-focus-visible:ring-offset-2 peer-active:translate-x-[1px] peer-active:translate-y-[1px] peer-active:shadow-[1px_1px_0_0_theme(colors.gray.800)]">
                {showWip ? (
                  <Check className="h-3 w-3 text-gray-800" strokeWidth={3} />
                ) : (
                  <X className="h-3 w-3 text-gray-800" strokeWidth={3} />
                )}
              </span>
            </span>
            Show WIP
          </label>
        )}
      </div>
    </BentoCard>
  );
}
