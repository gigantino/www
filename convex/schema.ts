import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.float64()),
    githubUsername: v.optional(v.string()),
    githubCreatedAt: v.optional(v.string()),
  }).index("email", ["email"]),
  guestbookEntries: defineTable({
    userId: v.id("users"),
    message: v.string(),
  }).index("by_user", ["userId"]),
  subscribers: defineTable({
    email: v.string(),
    ip: v.string(),
    subscribedAt: v.float64(),
  })
    .index("by_email", ["email"])
    .index("by_ip", ["ip"]),
});

export default schema;
