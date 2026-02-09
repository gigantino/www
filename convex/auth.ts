import GitHub from "@auth/core/providers/github";
import { convexAuth } from "@convex-dev/auth/server";

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
      const profileData = profile as Record<string, unknown>;
      if (profileData.githubUsername) {
        await ctx.db.patch(userId, {
          githubUsername: profileData.githubUsername as string,
          githubCreatedAt: profileData.githubCreatedAt as string,
        });
      }
    },
  },
});
