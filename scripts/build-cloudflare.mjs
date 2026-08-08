import { spawnSync } from "node:child_process";
import { loadPublicCloudflareEnvironment } from "./cloudflare-environment.mjs";

const publicBuildVariables = loadPublicCloudflareEnvironment();
const buildEnvironment = {
  ...process.env,
  ...publicBuildVariables,
  NEXT_TELEMETRY_DISABLED: "1",
};

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
