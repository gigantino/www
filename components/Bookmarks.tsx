import { bookmarks } from "@/lib/data";
import { BentoCard } from "./ui/BentoCard";
import { Bookmark } from "lucide-react";

export function Bookmarks() {
  return (
    <BentoCard id="bookmarks" className="flex flex-col gap-4 bg-amber-100 dark:bg-gray-800">
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
                {new Date(bookmark.date).toLocaleDateString("en-US", {
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
