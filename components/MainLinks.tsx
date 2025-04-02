"use server";
import { ofetch } from "ofetch";
import { MdArrowOutward } from "react-icons/md";

type Link = {
  href: string;
  label: string;
};

export default async function MainLinks() {
  const links = await ofetch<Link[]>("https://cdn.ggtn.ch/blog/links.json");
  return (
    <div className="not-prose flex gap-3 dark:text-white">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="flex items-center gap-1 hover:underline"
        >
          <MdArrowOutward />
          <span className="font-bold">{link.label}</span>
        </a>
      ))}
    </div>
  );
}
