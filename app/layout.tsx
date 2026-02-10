import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { PostHogProvider } from "./PostHogProvider";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";

const Guestbook = dynamic(() =>
  import("@/components/Guestbook").then((m) => m.Guestbook)
);
const Projects = dynamic(() =>
  import("@/components/Projects").then((m) => m.Projects)
);

const bricolage = Bricolage_Grotesque({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "gigantino - Full-stack developer",
  description:
    "Personal portfolio of gigantino, a full-stack developer based in Geneva, Switzerland.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialGuestbookData = null;
  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    initialGuestbookData = await convex.query(api.guestbook.list, {
      page: 1,
      pageSize: 5,
    });
  } catch {
    // Convex may be unreachable during static generation (e.g. /_not-found)
  }

  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>
          <ConvexClientProvider>
            {children}
            <Guestbook initialData={initialGuestbookData} />
            <Projects />
          </ConvexClientProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
