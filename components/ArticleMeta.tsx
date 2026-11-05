import type { BlogPost } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { Tags } from "@/components/Tag";

export function ArticleMeta({ post }: { post: BlogPost }) {
  if (post.tags.length === 0 && post.wip) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <Tags tags={post.tags} />
      {!post.wip && <time className="text-sm text-gray-800/60">{formatDate(post.date)}</time>}
    </div>
  );
}
