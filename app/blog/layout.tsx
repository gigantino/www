import Link from "next/link";
import { Newsletter } from "@/components/Newsletter";
import { ArrowLeft, Rss } from "lucide-react";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <nav className="neo-card flex items-center justify-between rounded-xl bg-white px-4 py-2">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-gray-800"
          >
            gigantino
          </Link>
          <div className="flex gap-2">
            <Link
              href="/"
              className="neo-button flex items-center gap-1.5 bg-white px-3 py-1.5 text-sm"
            >
              <ArrowLeft size={16} />
              <span>Home</span>
            </Link>
            <Link
              href="/rss.xml"
              className="neo-button flex items-center gap-1.5 bg-white px-3 py-1.5 text-sm"
            >
              <Rss size={16} />
              <span>RSS</span>
            </Link>
          </div>
        </nav>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
        <article>{children}</article>
        <footer className="mt-16 border-t border-gray-200 pt-10">
          <Newsletter />
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to homepage
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
