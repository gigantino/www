import { Bio } from "@/components/Bio";
import { Writing } from "@/components/Writing";
import { Bookmarks } from "@/components/Bookmarks";
import { Newsletter } from "@/components/Newsletter";
import { HomeShell } from "@/components/HomeShell";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const guestbookCount = await convex.query(api.guestbook.count);

  return (
    <HomeShell>
      <main className="mx-auto grid max-w-2xl gap-4">
        <Bio initialGuestbookCount={guestbookCount} />
        <Writing />
        <Bookmarks />
        <Newsletter />
      </main>
    </HomeShell>
  );
}
