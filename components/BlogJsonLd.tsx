import type { BlogPost } from "@/lib/data";

export function BlogJsonLd({ post }: { post: BlogPost }) {
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
    keywords: post.tags.join(", "),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
