import { generateOGImage } from "@/lib/og";

export const alt = "Hello! I'm gigantino";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return generateOGImage({
    title: "Hello! I'm gigantino",
    description:
      "Full-stack developer based in Geneva, Switzerland.",
  });
}
