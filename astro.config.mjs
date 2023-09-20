import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  server: {
    port: 3000,
  },
  integrations: [tailwind(), mdx()],
  output: "server",
  adapter: vercel(),
});
