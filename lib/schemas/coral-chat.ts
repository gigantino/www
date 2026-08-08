import { z } from "zod";

const coralMessageSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1)
    .max(16)
    .regex(/^[a-zA-Z0-9_]+$/, "Username contains invalid characters."),
  message: z.string().trim().min(1).max(100),
});

export const coralChatRequestSchema = z
  .object({
    history: z.array(coralMessageSchema).max(100),
    last_message: coralMessageSchema,
    seed: z.number().int().min(0).max(99_999),
  })
  .strict();
