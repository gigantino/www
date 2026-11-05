import type { ReactNode } from "react";

const TAG_COLORS = ["bg-yellow-100", "bg-pink-100", "bg-green-100", "bg-orange-100", "bg-violet-100", "bg-emerald-100"];

export function Tag({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`hand-tag inline-block border-2 border-gray-800 px-2 py-0.5 text-xs font-medium ${className}`}>{children}</span>;
}

export function Tags({ tags }: { tags: string[] }) {
  return tags.map((tag, index) => (
    <Tag key={tag} className={TAG_COLORS[index % TAG_COLORS.length]}>
      {tag}
    </Tag>
  ));
}
