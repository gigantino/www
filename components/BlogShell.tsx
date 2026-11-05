"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { blogPosts } from "@/lib/data";
import { ArrowLeftDoodle } from "@/components/icons";
import { Newsletter } from "@/components/Newsletter";
import { ProfilePicture } from "@/components/ProfilePicture";
import { SocialLinks } from "@/components/SocialLinks";
import { WipBanner } from "@/components/WipBanner";
import { ArticleMeta } from "@/components/ArticleMeta";
import { RecentArticles } from "@/components/RecentArticles";
import { HandText } from "@/components/HandText";
import { BlogJsonLd } from "@/components/BlogJsonLd";

export function BlogShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const post = blogPosts.find((p) => p.url === pathname);

  useEffect(() => {
    document.body.classList.add("blog-light");
    return () => {
      document.body.classList.remove("blog-light");
    };
  }, []);

  return (
    <div
      id="blog-root"
      className="min-h-screen overflow-x-hidden bg-white"
    >
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <nav className="neo-card sticky top-4 z-10 flex items-center justify-between rounded-xl px-4 py-2 bg-sky-100">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-800"
          >
            <ProfilePicture size="sm" />
            <HandText text="ggtn.ch" />
          </Link>
          <div className="flex items-center gap-3">
            <SocialLinks />
          </div>
        </nav>
      </div>
      {post && <BlogJsonLd post={post} />}
      <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
        <article>
          {post?.wip && <WipBanner />}
          {post && <ArticleMeta post={post} />}
          {children}
        </article>
        <footer className="mt-16 border-t border-gray-200 pt-10">
          <RecentArticles currentUrl={pathname} />
          <Newsletter />
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
            >
              <ArrowLeftDoodle size={10} />
              <HandText text="Back to homepage" />
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
