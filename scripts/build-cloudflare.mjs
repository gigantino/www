import { spawnSync } from "node:child_process";
import { unstable_readConfig } from "wrangler";
import { z } from "zod";

const publicBuildVariablesSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z.url(),
  NEXT_PUBLIC_CONVEX_SITE_URL: z.url(),
  SITE_URL: z.url(),
});

const config = unstable_readConfig(
  { config: "wrangler.jsonc" },
  { hideWarnings: true },
);
const publicBuildVariables = publicBuildVariablesSchema.parse(config.vars);
const buildEnvironment = { ...process.env };

Object.assign(buildEnvironment, publicBuildVariables);

console.log(
  `Loaded public build variables from wrangler.jsonc: ${Object.keys(publicBuildVariables).join(", ")}`,
);

const result = spawnSync("bunx", ["opennextjs-cloudflare", "build"], {
  env: buildEnvironment,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
