import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { PostHogProvider } from "./PostHogProvider";
import { ThemeProvider, type Theme } from "@/components/ThemeProvider";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const themeScript = `
(function(){
  try {
    var t = document.cookie.match(/(?:blog-)?theme=(light|dark)/);
    var dark = (t && t[1]==='dark') || (!t && matchMedia('(prefers-color-scheme:dark)').matches);
    if(dark) document.documentElement.classList.add('dark');
  } catch(e){}
})();
`;

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialTheme =
    (cookieStore.get("theme")?.value as Theme) ||
    (cookieStore.get("blog-theme")?.value as Theme) ||
    "device";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
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
            <ThemeProvider initialTheme={initialTheme}>
              {children}
              <Suspense fallback={null}>
                <GuestbookLoader />
              </Suspense>
              <Projects />
            </ThemeProvider>
          </ConvexClientProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
