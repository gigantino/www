import { spawnSync } from "node:child_process";
import { loadPublicCloudflareEnvironment } from "./cloudflare-environment.mjs";

const publicVariables = loadPublicCloudflareEnvironment();
const developmentEnvironment = {
  ...process.env,
  ...publicVariables,
  NEXT_TELEMETRY_DISABLED: "1",
};

const result = spawnSync("bunx", ["next", "dev", ...process.argv.slice(2)], {
  env: developmentEnvironment,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
