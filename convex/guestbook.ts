import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { page: v.number(), pageSize: v.number() },
  handler: async (ctx, args) => {
    const allEntries = await ctx.db
      .query("guestbookEntries")
      .order("desc")
      .collect();

    const totalEntries = allEntries.length;
    const totalPages = Math.max(1, Math.ceil(totalEntries / args.pageSize));
    const page = Math.max(1, Math.min(args.page, totalPages));
    const start = (page - 1) * args.pageSize;
    const sliced = allEntries.slice(start, start + args.pageSize);

    const entries = await Promise.all(
      sliced.map(async (entry) => {
        const user = await ctx.db.get(entry.userId);
        return {
          _id: entry._id,
          _creationTime: entry._creationTime,
          message: entry.message,
          name: user?.name ?? "Anonymous",
          image: user?.image,
          githubUsername: user?.githubUsername,
        };
      })
    );

    return { entries, page, totalPages, totalEntries };
  },
});

export const myEntry = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const entry = await ctx.db
      .query("guestbookEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return entry;
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    if (!user) return null;

    return {
      _id: user._id,
      name: user.name,
      image: user.image,
      githubUsername: user.githubUsername,
      githubCreatedAt: user.githubCreatedAt,
    };
  },
});

export const sign = mutation({
  args: {
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const message = args.message.trim();
    if (message.length === 0) throw new Error("Message cannot be empty");
    if (message.length > 200)
      throw new Error("Message must be 200 characters or less");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    if (user.githubCreatedAt) {
      const createdAt = new Date(user.githubCreatedAt);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      if (createdAt > sixMonthsAgo) {
        throw new Error(
          "Your GitHub account must be at least 6 months old to sign the guestbook"
        );
      }
    }

    const existing = await ctx.db
      .query("guestbookEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { message });
    } else {
      await ctx.db.insert("guestbookEntries", { userId, message });
    }
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("guestbookEntries").collect();
    return entries.length;
  },
});

export const seedTestEntries = internalMutation({
  args: {},
  handler: async (ctx) => {
    const testNames = [
      "Alice Chen",
      "Bob Smith",
      "Carlos Rivera",
      "Diana Park",
      "Ethan Nguyen",
      "Fiona O'Brien",
      "George Kim",
      "Hannah Lee",
      "Isaac Patel",
      "Julia Wagner",
      "Kevin Tanaka",
      "Luna Flores",
      "Marcus Johnson",
      "Nina Kowalski",
      "Oscar Müller",
    ];

    const messages = [
      "Love this site! Great design.",
      "Keep up the amazing work!",
      "Found your blog really helpful, thanks!",
      "Cool guestbook feature!",
      "Hello from Tokyo!",
      "First time visitor, won't be the last.",
      "Your CSS skills are incredible.",
      "Minimalist and beautiful. Well done.",
      "Bookmarked! Will come back often.",
      "The neobrutalism style is so clean.",
      "Inspiring portfolio, love the vibe.",
      "Greetings from Berlin!",
      "This is exactly how a personal site should look.",
      "Just discovered your work. Impressed!",
      "Simple, elegant, and functional. A+",
    ];

    for (let i = 0; i < testNames.length; i++) {
      const userId = await ctx.db.insert("users", {
        name: testNames[i],
      });
      await ctx.db.insert("guestbookEntries", {
        userId,
        message: messages[i],
      });
    }
  },
});
