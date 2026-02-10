import { Bio } from "@/components/Bio";
import { Writing } from "@/components/Writing";
import { Newsletter } from "@/components/Newsletter";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const guestbookCount = await convex.query(api.guestbook.count);

  return (
    <div className="min-h-screen bg-[var(--neo-cream)] px-4 py-8 font-sans sm:px-6 overflow-x-hidden">
      <main className="mx-auto grid max-w-prose gap-4">
        <Bio initialGuestbookCount={guestbookCount} />
        <Writing />
        <Newsletter />
      </main>
    </div>
  );
}
