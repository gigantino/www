import Image from "next/image";
import { personalInfo, socialLinks } from "@/lib/data";
import { BentoCard } from "./ui/BentoCard";
import { GuestbookButton } from "./GuestbookButton";
import { ProjectsButton } from "./ProjectsButton";
import { Github, Mail } from "lucide-react";

function ProfilePicture() {
  const hasImage = false; // Set to true when you have a profile picture

  // Flower shape with 12 petals
  const flowerPath = (() => {
    const cx = 50,
      cy = 50;
    const innerR = 36,
      outerR = 46;
    const petals = 12;
    let d = "";

    for (let i = 0; i < petals; i++) {
      const angle1 = (i / petals) * Math.PI * 2;
      const angle2 = ((i + 0.5) / petals) * Math.PI * 2;
      const angle3 = ((i + 1) / petals) * Math.PI * 2;

      const x1 = cx + Math.cos(angle1) * innerR;
      const y1 = cy + Math.sin(angle1) * innerR;
      const x2 = cx + Math.cos(angle2) * outerR;
      const y2 = cy + Math.sin(angle2) * outerR;
      const x3 = cx + Math.cos(angle3) * innerR;
      const y3 = cy + Math.sin(angle3) * innerR;

      if (i === 0) {
        d += `M ${x1} ${y1}`;
      }
      d += ` Q ${x2} ${y2} ${x3} ${y3}`;
    }
    d += " Z";
    return d;
  })();

  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 100 100" className="absolute -inset-[10%] h-[120%] w-[120%]">
        <path
          d={flowerPath}
          className="fill-violet-200 stroke-gray-800"
          strokeWidth="3"
        />
      </svg>
      {/* Profile content - circular inside */}
      <div className="absolute inset-[8%] overflow-hidden rounded-full">
        {hasImage ? (
          <Image
            src="/profile.jpg"
            alt={personalInfo.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-violet-200 text-2xl font-bold text-gray-800">
            {personalInfo.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}

export function Bio({ initialGuestbookCount }: { initialGuestbookCount: number }) {
  return (
    <BentoCard id="bio" className="flex flex-col gap-3 bg-yellow-100">
      <div className="flex flex-col items-start gap-2">
        <ProfilePicture />
        <h1 className="text-3xl font-bold tracking-tight">Hello! I&apos;m Giovanni</h1>
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target={link.icon === "email" ? undefined : "_blank"}
              rel={link.icon === "email" ? undefined : "noopener noreferrer"}
              aria-label={link.name}
              className="neo-link flex items-center gap-1.5 text-gray-800"
            >
              {link.icon === "github" ? <Github size={20} /> : <Mail size={20} />}
              <span>{link.name}</span>
            </a>
          ))}
        </div>
      </div>
      <p className="text-base leading-relaxed">{personalInfo.bio}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <ProjectsButton />
        <GuestbookButton initialCount={initialGuestbookCount} />
      </div>
    </BentoCard>
  );
}
