import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { PostHogProvider } from "./PostHogProvider";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";
import { Suspense } from "react";

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

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ggtn.ch"),
  title: {
    default: "Hello! - ggtn.ch",
    template: "%s - ggtn.ch",
  },
  description:
    "Personal portfolio of gigantino, a full-stack developer based in Geneva, Switzerland.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ggtn.ch",
    url: "https://ggtn.ch",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://ggtn.ch",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function GuestbookLoader() {
  let data = null;
  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    data = await convex.query(api.guestbook.list, {
      page: 1,
      pageSize: 5,
    });
  } catch {
    // Convex may be unreachable during static generation (e.g. /_not-found)
  }
  return <Guestbook initialData={data} />;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${geist.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "gigantino",
              url: "https://ggtn.ch",
              jobTitle: "Full-stack developer",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Geneva",
                addressCountry: "CH",
              },
              sameAs: ["https://github.com/gigantino"],
            }),
          }}
        />
        <PostHogProvider>
          <ConvexClientProvider>
            {children}
            <Suspense fallback={null}>
              <GuestbookLoader />
            </Suspense>
            <Projects />
          </ConvexClientProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
