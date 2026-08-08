import { unstable_readConfig } from "wrangler";
import { z } from "zod";

const publicVariablesSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z.url(),
  NEXT_PUBLIC_CONVEX_SITE_URL: z.url(),
  SITE_URL: z.url(),
});

export function loadPublicCloudflareEnvironment() {
  const config = unstable_readConfig(
    { config: "wrangler.jsonc" },
    { hideWarnings: true },
  );

  return publicVariablesSchema.parse(config.vars);
}
