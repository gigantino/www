import { ImageResponse } from "next/og";
import { blogPosts } from "@/lib/data";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Security: { bg: "#fecaca", text: "#991b1b" },
  "Reverse Engineering": { bg: "#e9d5ff", text: "#6b21a8" },
  AI: { bg: "#bbf7d0", text: "#166534" },
  "Case Study": { bg: "#fef08a", text: "#854d0e" },
  "CI/CD": { bg: "#bfdbfe", text: "#1e40af" },
  Performance: { bg: "#fed7aa", text: "#9a3412" },
  "Dynamic article": { bg: "#d1d5db", text: "#374151" },
};

const DEFAULT_TAG = { bg: "#e5e7eb", text: "#374151" };

async function loadFonts() {
  const [bricolage, geist] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/BricolageGrotesque-Bold.ttf")),
    readFile(join(process.cwd(), "public/fonts/Geist-Regular.ttf")),
  ]);
  return { bricolage, geist };
}

export async function generateOGImage({
  title,
  description,
  tags = [],
}: {
  title: string;
  description: string;
  tags?: string[];
}) {
  const { bricolage, geist } = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fefce8",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            backgroundColor: "#e0f2fe",
            borderRadius: "24px",
            border: "3px solid #1a1a1a",
            boxShadow: "6px 6px 0 #1a1a1a",
            padding: "48px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {tags.length > 0 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {tags.map((tag) => {
                  const color = TAG_COLORS[tag] ?? DEFAULT_TAG;
                  return (
                    <div
                      key={tag}
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                        padding: "6px 16px",
                        borderRadius: "9999px",
                        fontSize: "18px",
                        fontFamily: "Geist",
                        border: "2px solid #1a1a1a",
                      }}
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
            )}
            <div
              style={{
                fontSize: "52px",
                fontFamily: "Bricolage Grotesque",
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: "24px",
                fontFamily: "Geist",
                color: "#4b5563",
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              fontSize: "24px",
              fontFamily: "Bricolage Grotesque",
              fontWeight: 700,
              color: "#1a1a1a",
            }}
          >
            ggtn.ch
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Bricolage Grotesque", data: bricolage, weight: 700 },
        { name: "Geist", data: geist, weight: 400 },
      ],
    },
  );
}

export function createBlogOGImage(slug: string) {
  const post = blogPosts.find((p) => p.url === `/blog/${slug}`);
  if (!post) throw new Error(`Blog post not found: ${slug}`);

  return generateOGImage({
    title: post.title,
    description: post.description,
    tags: post.tags,
  });
}
