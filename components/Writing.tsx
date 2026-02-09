import { blogPosts } from "@/lib/data";
import { BentoCard } from "./ui/BentoCard";
import { Rss } from "lucide-react";

const tagColors = [
  "bg-yellow-100",
  "bg-pink-100",
  "bg-green-100",
  "bg-orange-100",
  "bg-violet-100",
  "bg-emerald-100",
];

export function Writing() {
  return (
    <BentoCard id="writing" className="flex flex-col gap-4 bg-sky-100">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Writing</h2>
        <a
          href="/feed.xml"
          className="neo-button flex items-center gap-1 bg-orange-100 px-3 py-1 text-sm"
          aria-label="RSS Feed"
        >
          <Rss size={16} />
          <span>RSS</span>
        </a>
      </div>
      <ul className="flex flex-col gap-5">
        {blogPosts.map((post) => (
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
                  <p className="line-clamp-2 text-sm text-gray-600">
                    {post.description}
                  </p>
                )}
                <time className="text-sm text-gray-500">
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
    </BentoCard>
  );
}
