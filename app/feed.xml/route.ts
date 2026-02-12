import { blogPosts, personalInfo } from "@/lib/data";

const SITE_URL = process.env.SITE_URL || "https://ggtn.ch";

export function GET() {
  const items = blogPosts
    .reduce<string[]>((acc, post) => {
      if (!post.wip) {
        const url = `${SITE_URL}${post.url}`;
        acc.push(`    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`);
      }
      return acc;
    }, [])
    .join("\n");

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(personalInfo.name)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(personalInfo.bio)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
