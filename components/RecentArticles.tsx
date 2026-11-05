import { blogPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { HandText } from "@/components/HandText";

export function RecentArticles({ currentUrl }: { currentUrl: string }) {
  const articles = blogPosts.filter((post) => !post.wip && post.url !== currentUrl).slice(0, 3);

  if (articles.length === 0) return null;

  return (
    <div className="mt-10 pb-10">
      <h3 className="text-lg font-bold text-gray-800">
        <HandText text="Other articles" />
      </h3>
      <ul className="mt-3 flex flex-col gap-3">
        {articles.map((post) => (
          <li key={post.url}>
            <a href={post.url} className="group flex flex-col gap-0.5">
              <span className="font-medium text-gray-800">
                <span className="neo-link">{post.title}</span>
              </span>
              <time className="text-sm text-gray-500">{formatDate(post.date)}</time>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
