import { createBlogOGImage } from "@/lib/og";

export const alt = "How We Broke McDonald's Italy From the Inside Out";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createBlogOGImage("mcdonalds-hack");
}
