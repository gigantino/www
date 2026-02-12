import { BlogShell } from "@/components/BlogShell";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlogShell>{children}</BlogShell>;
}
