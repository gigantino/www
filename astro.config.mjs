import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel/serverless";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://gigantino.dev",
  server: {
    port: 3000,
  },
  integrations: [tailwind(), mdx(), sitemap()],
  output: "server",
  adapter: vercel(),
});
