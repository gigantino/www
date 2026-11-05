"use client";

import { ChevronLeftDoodle, ChevronRightDoodle } from "@/components/icons";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex size-10 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-800/5 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Previous page"
      >
        <ChevronLeftDoodle size={16} />
      </button>

      <span className="text-sm text-gray-500">
        {page} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex size-10 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-800/5 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Next page"
      >
        <ChevronRightDoodle size={16} />
      </button>
    </div>
  );
}
