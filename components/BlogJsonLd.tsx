"use client";

import { usePathname } from "next/navigation";
import { blogPosts } from "@/lib/data";

export function BlogJsonLd() {
  const pathname = usePathname();
  const post = blogPosts.find((p) => p.url === pathname);
  if (!post) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "gigantino",
      url: "https://ggtn.ch",
    },
    url: `https://ggtn.ch${post.url}`,
    keywords: post.tags?.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
