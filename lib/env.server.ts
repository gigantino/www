import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  SITE_URL: z.url(),
});

export const serverEnv = serverEnvSchema.parse({
  SITE_URL: process.env.SITE_URL ?? "https://ggtn.ch",
});
