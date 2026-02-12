"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Newsletter } from "@/components/Newsletter";
import { ProfilePicture } from "@/components/ProfilePicture";
import { SocialLinks } from "@/components/SocialLinks";
import { WipBanner } from "@/components/WipBanner";
import { ArticleMeta } from "@/components/ArticleMeta";
import { RecentArticles } from "@/components/RecentArticles";
import { ArrowLeft } from "lucide-react";
import { BlogJsonLd } from "@/components/BlogJsonLd";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export function BlogShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDark } = useTheme();

  useEffect(() => {
    document.body.classList.toggle("blog-dark", isDark);
    document.body.classList.toggle("blog-light", !isDark);
    return () => {
      document.body.classList.remove("blog-dark", "blog-light");
    };
  }, [isDark]);

  return (
    <div
      id="blog-root"
      className="min-h-screen overflow-x-hidden transition-colors duration-300 bg-white dark:bg-neutral-950"
    >
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <nav className="neo-card sticky top-4 z-10 flex items-center justify-between rounded-xl px-4 py-2 bg-sky-100 dark:bg-gray-800 dark:border-gray-600 dark:shadow-[4px_4px_0_theme(colors.gray.700)]">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100"
          >
            <ProfilePicture size="sm" />
            ggtn.ch
          </Link>
          <div className="flex items-center gap-3">
            <SocialLinks />
            <ThemeToggle />
          </div>
        </nav>
      </div>
      <BlogJsonLd />
      <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
        <article>
          <WipBanner />
          <ArticleMeta />
          {children}
        </article>
        <footer className="mt-16 border-t border-gray-200 dark:border-neutral-800 pt-10">
          <RecentArticles />
          <Newsletter />
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-gray-200"
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
