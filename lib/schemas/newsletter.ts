import { z } from "zod";

export const subscribeRequestSchema = z.object({
  email: z
    .string({ error: "Email is required." })
    .trim()
    .min(1, "Email is required.")
    .email("Invalid email address."),
});

export const subscribeResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
