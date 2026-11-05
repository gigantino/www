import { socialLinks } from "@/lib/data";
import { GithubDoodle, MailDoodle, XDoodle } from "@/components/icons";

const icons = {
  github: GithubDoodle,
  email: MailDoodle,
  x: XDoodle,
} as const;

export function SocialLinks({ showLabels = false }: { showLabels?: boolean }) {
  return (
    <>
      {socialLinks.map((link) => {
        const Icon = icons[link.icon];
        return (
          <a
            key={link.name}
            href={link.url}
            target={link.icon === "email" ? undefined : "_blank"}
            rel={link.icon === "email" ? undefined : "noopener noreferrer"}
            aria-label={link.name}
            className={
              showLabels
                ? "flex items-center gap-1.5 text-gray-800"
                : "text-gray-800 transition-colors hover:text-gray-600"
            }
          >
            <Icon size={20} />
            {showLabels && <span className="neo-link">{link.name}</span>}
          </a>
        );
      })}
    </>
  );
}
