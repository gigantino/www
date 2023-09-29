import rss, { pagesGlobToRssItems } from "@astrojs/rss";
import type { APIRoute } from "astro";

export const get: APIRoute = async function get({ site }) {
  return rss({
    title: "gg's blog",
    description: "In depth posts about technical challenges I've had the chance to delve into.",
    site: site ? site.toString() : "",
    items: await pagesGlobToRssItems(import.meta.glob("./blog/*.{md,mdx}")),
  });
};
