import { MdArrowOutward } from "react-icons/md";

export interface ProjectCardProps {
  title: string;
  description: string;
  links: {
    href: string;
    label: string;
  }[];
}

export default function ProjectCard({
  title,
  description,
  links,
}: ProjectCardProps) {
  return (
    <div className="flex w-full flex-col justify-between gap-1 border bg-zinc-50 px-3 py-4 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white">
      <p className="flex items-center gap-1 font-bold text-lg">{title}</p>
      <p className="text-zinc-600 dark:text-zinc-300">{description}</p>
      <div className="not-prose flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center gap-1 text-sm font-bold hover:underline"
          >
            <MdArrowOutward />
            <span>{link.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
