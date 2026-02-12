import { createBlogOGImage } from "@/lib/og";

export const alt = "Automating lighthouse reports with Unlighthouse";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createBlogOGImage("unlighthouse");
}
