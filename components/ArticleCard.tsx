interface ArticleCardProps {
  href?: string;
  title?: string;
  description?: string;
  tags?: string[];
  pubDate?: string;
}

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", options).format(date);
}

export default function ArticleCard({
  href,
  title,
  description,
  tags,
  pubDate,
}: ArticleCardProps) {
  return (
    <a
      className="group flex w-full flex-col justify-between gap-2 border bg-zinc-50 px-3 py-4 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
      href={href}
    >
      <div className="flex flex-col">
        <p className="flex items-center gap-1 font-bold group-hover:underline">
          {title}
        </p>
        <p className="text-zinc-600 dark:text-zinc-300">{description}</p>
      </div>
      {tags && (
        <span className="text-xs font-mono uppercase">
          {tags
            .map((t, i) => `${t}${i + 1 !== tags.length ? " |" : ""}`)
            .join(" ")}
        </span>
      )}
      {pubDate && (
        <span className="text-xs dark:text-zinc-300">
          {formatDate(pubDate)}
        </span>
      )}
    </a>
  );
}
