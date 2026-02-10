import Link from "next/link";
import { Newsletter } from "@/components/Newsletter";
import { ProfilePicture } from "@/components/ProfilePicture";
import { SocialLinks } from "@/components/SocialLinks";
import { ArrowLeft } from "lucide-react";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <nav className="neo-card sticky top-4 z-10 flex items-center justify-between rounded-xl bg-sky-100 px-4 py-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-800"
          >
            <ProfilePicture size="sm" />
            ggtn.ch
          </Link>
          <div className="flex items-center gap-3">
            <SocialLinks />
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
