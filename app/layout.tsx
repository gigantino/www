import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { PostHogProvider } from "./PostHogProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { publicEnv } from "@/lib/env.public";
import { isTheme } from "@/lib/theme";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const themeScript = `
(function(){
  try {
    var t = document.cookie.match(/(?:^|; )theme=(light|dark)/);
    var dark = (t && t[1]==='dark') || (!t && matchMedia('(prefers-color-scheme:dark)').matches);
    var el = document.documentElement;
    el.classList.toggle('dark', dark);
    el.style.colorScheme = dark ? 'dark' : 'light';
  } catch(e){}
})();
`;

const Guestbook = dynamic(() =>
  import("@/components/Guestbook").then((m) => m.Guestbook)
);
const Projects = dynamic(() =>
  import("@/components/Projects").then((m) => m.Projects)
);

const fixelText = localFont({
  variable: "--font-sans",
  src: [
    { path: "./fonts/FixelText-Medium.woff2", weight: "500" },
    { path: "./fonts/FixelText-SemiBold.woff2", weight: "600" },
    { path: "./fonts/FixelText-Bold.woff2", weight: "700" },
  ],
});

const fixelDisplay = localFont({
  variable: "--font-display",
  src: [
    { path: "./fonts/FixelDisplay-SemiBold.woff2", weight: "600" },
    { path: "./fonts/FixelDisplay-Bold.woff2", weight: "700" },
    { path: "./fonts/FixelDisplay-ExtraBold.woff2", weight: "800" },
  ],
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
    const convex = new ConvexHttpClient(publicEnv.NEXT_PUBLIC_CONVEX_URL);
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
  const themeCookie = cookieStore.get("theme")?.value;
  const initialTheme = isTheme(themeCookie) ? themeCookie : "device";

  return (
    <html lang="en" className={initialTheme === "dark" ? "dark" : undefined} style={{ colorScheme: initialTheme === "dark" ? "dark" : "light" }} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${fixelText.variable} ${fixelDisplay.variable} ${geistMono.variable} antialiased`}
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
