import { z } from "zod";

const env = z
  .object({ CONVEX_SITE_URL: z.url() })
  .parse({ CONVEX_SITE_URL: process.env.CONVEX_SITE_URL });

const authConfig = {
  providers: [
    {
      domain: env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
