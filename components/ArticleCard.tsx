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
      className="group flex w-full flex-col justify-between gap-2 rounded border bg-zinc-50 px-3 py-4 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
      href={href}
    >
      <div className="flex flex-col">
        <p className="flex items-center gap-1 font-bold group-hover:underline">
          {title}
        </p>
        <p className="text-zinc-600 dark:text-zinc-300">{description}</p>
      </div>
      {tags && (
        <div className="inline-flex gap-1">
          {tags.map((t, index) => (
            <span
              key={index}
              className="rounded-full border bg-white px-2 text-sm dark:border-zinc-700 dark:bg-transparent dark:text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {pubDate && (
        <span className="text-xs dark:text-zinc-300">
          {formatDate(pubDate)}
        </span>
      )}
    </a>
  );
}
