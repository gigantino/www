import { BentoCard } from "@/components/ui/BentoCard";
import { GuestbookButton } from "@/components/GuestbookButton";
import { ProfilePicture } from "@/components/ProfilePicture";
import { ProjectsButton } from "@/components/ProjectsButton";
import { SocialLinks } from "@/components/SocialLinks";
import { HandText } from "@/components/HandText";

export function Bio({ initialGuestbookCount }: { initialGuestbookCount: number }) {
  return (
    <BentoCard id="bio" className="relative flex flex-col gap-3 bg-yellow-100">
      <div className="flex flex-col items-start gap-2">
        <ProfilePicture />
        <h1 className="text-3xl font-bold tracking-tight"><HandText text="Hello! I'm Giovanni" /></h1>
        <div className="flex items-center gap-4">
          <SocialLinks showLabels />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <ProjectsButton />
        <GuestbookButton initialCount={initialGuestbookCount} />
      </div>
    </BentoCard>
  );
}
