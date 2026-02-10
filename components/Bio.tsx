import { personalInfo } from "@/lib/data";
import { BentoCard } from "./ui/BentoCard";
import { GuestbookButton } from "./GuestbookButton";
import { ProfilePicture } from "./ProfilePicture";
import { ProjectsButton } from "./ProjectsButton";
import { SocialLinks } from "./SocialLinks";

export function Bio({ initialGuestbookCount }: { initialGuestbookCount: number }) {
  return (
    <BentoCard id="bio" className="flex flex-col gap-3 bg-yellow-100">
      <div className="flex flex-col items-start gap-2">
        <ProfilePicture />
        <h1 className="text-3xl font-bold tracking-tight">Hello! I&apos;m Giovanni</h1>
        <div className="flex items-center gap-4">
          <SocialLinks showLabels />
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
