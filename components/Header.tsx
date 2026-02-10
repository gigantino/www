"use client";

import Link from "next/link";
import { personalInfo } from "@/lib/data";
import { User, PenLine, Mail, Code } from "lucide-react";

const navItems = [
  { id: "bio", label: "About", icon: User },
  { id: "writing", label: "Writing", icon: PenLine },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "projects", label: "Projects", icon: Code },
];

export function Header() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="neo-card flex items-center justify-between bg-white p-4">
      <Link href="/" className="text-lg font-bold">
        {personalInfo.name}
      </Link>
      <div className="flex gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="neo-button flex items-center gap-1.5 bg-white px-3 py-1.5 text-sm"
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
