"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Newsletter } from "@/components/Newsletter";
import { ProfilePicture } from "@/components/ProfilePicture";
import { SocialLinks } from "@/components/SocialLinks";
import { WipBanner } from "@/components/WipBanner";
import { ArticleMeta } from "@/components/ArticleMeta";
import { RecentArticles } from "@/components/RecentArticles";
import { ArrowLeft, Sun, Moon, Monitor } from "lucide-react";
import { BlogJsonLd } from "@/components/BlogJsonLd";
import type { Theme } from "@/app/blog/layout";

function useSystemDark() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => false,
  );
}

function setThemeCookie(theme: Theme) {
  if (theme === "device") {
    document.cookie = "blog-theme=; path=/; max-age=0";
  } else {
    document.cookie = `blog-theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }
}

const themeIcons = {
  device: Monitor,
  light: Sun,
  dark: Moon,
} as const;

const themeLabels = {
  device: "System theme",
  light: "Light mode",
  dark: "Dark mode",
} as const;

export function BlogShell({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const systemDark = useSystemDark();

  const isDark = theme === "dark" || (theme === "device" && systemDark);

  useEffect(() => {
    document.body.classList.toggle("blog-dark", isDark);
    document.body.classList.toggle("blog-light", !isDark);
    return () => {
      document.body.classList.remove("blog-dark", "blog-light");
    };
  }, [isDark]);

  // Cycle order adapts to system preference so the first click always
  // produces a visible change: device → opposite → same → device
  const cycleOrder: Theme[] = systemDark
    ? ["device", "light", "dark"]
    : ["device", "dark", "light"];

  const cycleTheme = () => {
    const currentIndex = cycleOrder.indexOf(theme);
    const next = cycleOrder[(currentIndex + 1) % cycleOrder.length];
    setTheme(next);
    setThemeCookie(next);
  };

  const Icon = themeIcons[theme];

  return (
    <div
      id="blog-root"
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        isDark ? "dark bg-neutral-950" : "bg-white"
      }`}
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
            <button
              onClick={cycleTheme}
              aria-label={themeLabels[theme]}
              title={themeLabels[theme]}
              className="cursor-pointer rounded-xl border-2 border-gray-800 p-1.5 shadow-[2px_2px_0_theme(colors.gray.800)] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_theme(colors.gray.800)] dark:border-gray-500 dark:shadow-[2px_2px_0_theme(colors.gray.600)] dark:bg-gray-700 dark:text-gray-100"
            >
              <Icon size={18} />
            </button>
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
