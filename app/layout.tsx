import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Guestbook } from "@/components/Guestbook";
import { Projects } from "@/components/Projects";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

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
  const initialGuestbookData = await convex.query(api.guestbook.list, {
    page: 1,
    pageSize: 5,
  });

  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          {children}
          <Guestbook initialData={initialGuestbookData} />
          <Projects />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
