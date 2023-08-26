import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  experimental: {
    assets: true,
  },
  integrations: [tailwind(), mdx()],
  output: "server",
  adapter: vercel(),
});
