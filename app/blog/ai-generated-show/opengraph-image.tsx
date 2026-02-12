import { createBlogOGImage } from "@/lib/og";

export const alt = "How I made an AI-generated show";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createBlogOGImage("ai-generated-show");
}
