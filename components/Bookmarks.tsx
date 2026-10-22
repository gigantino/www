import { bookmarks } from "@/lib/data";
import { BentoCard } from "./ui/BentoCard";
import { Bookmark } from "lucide-react";
import { formatDate } from "@/lib/format";

const newBadge = (
  <div className="absolute -top-8 -right-8">
    <div className="w-26 h-26 animate-spin" style={{ animationDuration: "20s" }}>
      <svg viewBox="-3 -3 106 106" className="w-full h-full">
        <path
          d="M50 0 L59.9 19.6 L79.4 9.5 L75.9 31.2 L97.6 34.5 L82 50 L97.6 65.5 L75.9 68.8 L79.4 90.5 L59.9 80.4 L50 100 L40.1 80.4 L20.6 90.5 L24.1 68.8 L2.4 65.5 L18 50 L2.4 34.5 L24.1 31.2 L20.6 9.5 L40.1 19.6 Z"
          className="fill-yellow-100 stroke-gray-800 dark:fill-gray-700 dark:stroke-gray-500"
          strokeWidth="3"
        />
      </svg>
    </div>
    <span className="absolute inset-0 flex items-center justify-center text-lg font-extrabold rotate-[20deg] dark:text-gray-200">
      NEW
    </span>
  </div>
);

export function Bookmarks() {
  return (
    <BentoCard id="bookmarks" className="relative flex flex-col gap-4 bg-pink-200 dark:bg-gray-800">
      {newBadge}
      <h2 className="text-xl font-bold flex items-center gap-2 dark:text-gray-100">
        <Bookmark className="size-5" /> Bookmarks
      </h2>
      <ul className="flex flex-col gap-5">
        {bookmarks.map((bookmark) => (
          <li key={bookmark.url}>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-1"
            >
              <span className="neo-link font-medium group-hover:text-gray-800 dark:text-gray-200 dark:group-hover:text-gray-100">
                {bookmark.title}
              </span>
              <span className="text-base text-gray-600 dark:text-gray-400">
                {bookmark.author}
              </span>
              <time className="text-base text-gray-500 dark:text-gray-500">
                {formatDate(bookmark.date)}
              </time>
            </a>
          </li>
        ))}
      </ul>
    </BentoCard>
  );
}
