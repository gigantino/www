import { createBlogOGImage } from "@/lib/og";

export const alt = "Building an LLM trained on Minecraft server chat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return createBlogOGImage("minecraft-llm");
}
