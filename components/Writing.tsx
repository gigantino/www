"use client";

import { useState } from "react";
import { blogPosts, type BlogPost } from "@/lib/data";
import { BentoCard } from "@/components/ui/BentoCard";
import { Check, X } from "lucide-react";
import { RssDoodle, PencilDoodle } from "@/components/icons";
import { formatDate } from "@/lib/format";
import { HandText } from "@/components/HandText";
import { Tag, Tags } from "@/components/Tag";

const publishedPosts = blogPosts.filter((post) => !post.wip);
const wipPosts = blogPosts.filter((post) => post.wip);

function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <ul className="flex flex-col gap-5">
      {posts.map((post) => (
        <li key={post.url}>
          <a href={post.url} className="group flex flex-col gap-1">
            <span className="font-medium group-hover:text-gray-800">
              <span className="neo-link">{post.title}</span>
              {post.wip && <Tag className="ml-2 bg-amber-100 align-middle">WIP</Tag>}
            </span>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <Tags tags={post.tags} />
              </div>
            )}
            {post.description && <p className="line-clamp-2 text-base text-gray-600">{post.description}</p>}
            {!post.wip && <time className="text-base text-gray-500">{formatDate(post.date)}</time>}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Writing() {
  const [showWip, setShowWip] = useState(true);

  return (
    <BentoCard id="writing" className="flex flex-col gap-4 bg-sky-100">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <PencilDoodle size={20} /> <HandText text="Writing" />
      </h2>
      <PostList posts={publishedPosts} />
      {showWip && wipPosts.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <div className="h-0.5 flex-1 bg-gray-800/20" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              <HandText text="Work in Progress" />
            </span>
            <div className="h-0.5 flex-1 bg-gray-800/20" />
          </div>
          <PostList posts={wipPosts} />
        </>
      )}
      <div className="flex items-center gap-4">
        <a href="/feed.xml" className="text-base text-gray-600 flex items-center gap-1">
          <RssDoodle size={14} />
          <span className="neo-link">RSS Feed</span>
        </a>
        {wipPosts.length > 0 && (
          <label className="flex items-center gap-1.5 text-sm text-gray-500 cursor-pointer select-none">
            <span className="relative inline-flex items-center justify-center">
              <input type="checkbox" checked={showWip} onChange={(e) => setShowWip(e.target.checked)} className="peer sr-only" />
              <span className="flex h-4 w-4 items-center justify-center border-2 border-gray-800 bg-white shadow-[2px_2px_0_0_theme(colors.gray.800)] transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-gray-800 peer-focus-visible:ring-offset-2 peer-active:translate-x-[1px] peer-active:translate-y-[1px] peer-active:shadow-[1px_1px_0_0_theme(colors.gray.800)]">
                {showWip ? <Check className="h-3 w-3 text-gray-800" strokeWidth={3} /> : <X className="h-3 w-3 text-gray-800" strokeWidth={3} />}
              </span>
            </span>
            Show WIP
          </label>
        )}
      </div>
    </BentoCard>
  );
}
