import { cookies } from "next/headers";
import { BlogShell } from "@/components/BlogShell";

export type Theme = "light" | "dark" | "device";

// Inline script that resolves "device" theme before React hydrates to prevent
// a flash of incorrect theme. Runs synchronously before first paint.
// See: rendering-hydration-no-flicker best practice.
const themeScript = `
(function(){
  try {
    var t = document.cookie.match(/blog-theme=(light|dark)/);
    var theme = t ? t[1] : null;
    var dark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var el = document.getElementById('blog-root');
    if (dark && el) {
      el.classList.add('dark');
      el.classList.replace('bg-white','bg-neutral-950');
    }
  } catch(e){}
})();
`;

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialTheme = (cookieStore.get("blog-theme")?.value as Theme) || "device";

  return (
    <>
      <BlogShell initialTheme={initialTheme}>{children}</BlogShell>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    </>
  );
}
