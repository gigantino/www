import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";
import { z } from "zod";

const githubProfileSchema = z.object({
  githubUsername: z.string().trim().min(1),
  githubCreatedAt: z.iso.datetime(),
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          githubUsername: profile.login,
          githubCreatedAt: profile.created_at,
        };
      },
    }),
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId, profile }) {
      const profileData = githubProfileSchema.safeParse(profile);
      if (profileData.success) {
        await ctx.db.patch(userId, {
          githubUsername: profileData.data.githubUsername,
          githubCreatedAt: profileData.data.githubCreatedAt,
        });
      }
    },
  },
});
