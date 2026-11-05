"use client";

import { useQuery } from "convex/react";
import { HeartDoodle } from "@/components/icons";
import { api } from "@/convex/_generated/api";

export function GuestbookButton({ initialCount }: { initialCount: number }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-guestbook"));
  };

  const count = useQuery(api.guestbook.count) ?? initialCount;

  return (
    <button
      onClick={handleClick}
      className={`neo-button relative flex items-center gap-2 bg-amber-100 px-4 py-2 font-medium`}
    >
      <span className="hand-tag absolute -right-2 -top-3 [--hf-fill-opacity:1] whitespace-nowrap rounded-full bg-lime-300 px-2 py-0.5 text-[10px] font-bold leading-none shadow-[2px_2px_0_#1a1a1a] border-2 border-gray-800">
        {count} have signed!
      </span>
      <HeartDoodle size={16} />
      Guestbook
    </button>
  );
}
