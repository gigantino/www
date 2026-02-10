import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--neo-cream)] px-4">
      <h1 className="text-9xl font-black tracking-tighter text-gray-800">
        404
      </h1>
      <p className="text-lg font-medium text-gray-800">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="neo-link flex items-center gap-1.5 text-sm text-gray-800"
      >
        <Home size={16} />
        Go home
      </Link>
    </div>
  );
}
