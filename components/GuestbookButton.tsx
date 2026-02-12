"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { BookOpen } from "lucide-react";

interface GuestbookButtonProps {
  className?: string;
  initialCount: number;
}

export function GuestbookButton({ className = "", initialCount }: GuestbookButtonProps) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-guestbook"));
  };

  const count = useQuery(api.guestbook.count) ?? initialCount;

  return (
    <button
      onClick={handleClick}
      className={`neo-button relative flex items-center gap-2 bg-amber-100 dark:bg-amber-900/40 px-4 py-2 font-medium ${className}`}
    >
      <span className="absolute -right-2 -top-3 whitespace-nowrap rounded-full bg-lime-300 dark:bg-lime-800 dark:text-lime-200 px-2 py-0.5 text-[10px] font-bold leading-none shadow-[2px_2px_0_#1a1a1a] border-2 border-gray-800 dark:border-gray-600 dark:shadow-[2px_2px_0_theme(colors.gray.700)]">
        {count} have signed!
      </span>
      <BookOpen size={18} />
      Guestbook
    </button>
  );
}
