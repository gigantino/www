import { v } from "convex/values";
import { mutation } from "./_generated/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5;

export const subscribe = mutation({
  args: {
    email: v.string(),
    ip: v.string(),
  },
  handler: async (ctx, { email, ip }) => {
    const normalizedEmail = email.toLowerCase().trim();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return { success: false, message: "Invalid email address." };
    }

    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existing) {
      return { success: false, message: "You're already subscribed!" };
    }

    const oneHourAgo = Date.now() - RATE_LIMIT_WINDOW_MS;
    const recentFromIp = await ctx.db
      .query("subscribers")
      .withIndex("by_ip", (q) => q.eq("ip", ip))
      .collect();

    const recentCount = recentFromIp.filter(
      (s) => s.subscribedAt > oneHourAgo
    ).length;

    if (recentCount >= RATE_LIMIT_MAX) {
      return { success: false, message: "Too many requests. Please try again later." };
    }

    await ctx.db.insert("subscribers", {
      email: normalizedEmail,
      ip,
      subscribedAt: Date.now(),
    });

    return { success: true, message: "Successfully subscribed!" };
  },
});
