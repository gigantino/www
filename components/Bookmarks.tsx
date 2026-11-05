import { bookmarks } from "@/lib/data";
import { BookmarkDoodle } from "@/components/icons";
import { BentoCard } from "@/components/ui/BentoCard";
import { formatDate } from "@/lib/format";
import { HandText } from "@/components/HandText";
import { NewBadge } from "@/components/NewBadge";

export function Bookmarks() {
  return (
    <BentoCard id="bookmarks" className="relative flex flex-col gap-4 bg-pink-200">
      <NewBadge />
      <h2 className="text-xl font-bold flex items-center gap-2">
        <BookmarkDoodle size={20} /> <HandText text="Bookmarks" />
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
              <span className="font-medium group-hover:text-gray-800">
                <span className="neo-link">{bookmark.title}</span>
              </span>
              <span className="text-base text-gray-600">
                {bookmark.author}
              </span>
              <time className="text-base text-gray-500">
                {formatDate(bookmark.date)}
              </time>
            </a>
          </li>
        ))}
      </ul>
    </BentoCard>
  );
}
