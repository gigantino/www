import { socialLinks } from "@/lib/data";
import { Github, Mail } from "lucide-react";

const icons = {
  github: Github,
  email: Mail,
} as const;

export function SocialLinks({ showLabels = false }: { showLabels?: boolean }) {
  return (
    <>
      {socialLinks.map((link) => {
        const Icon = icons[link.icon as keyof typeof icons];
        return (
          <a
            key={link.name}
            href={link.url}
            target={link.icon === "email" ? undefined : "_blank"}
            rel={link.icon === "email" ? undefined : "noopener noreferrer"}
            aria-label={link.name}
            className={
              showLabels
                ? "neo-link flex items-center gap-1.5 text-gray-800"
                : "text-gray-800 transition-colors hover:text-gray-600"
            }
          >
            <Icon size={20} />
            {showLabels && <span>{link.name}</span>}
          </a>
        );
      })}
    </>
  );
}
