import { WarningDoodle } from "@/components/icons";

export function WipBanner() {
  return (
    <div className="hand-tag mb-8 flex items-center gap-2 border-2 border-gray-800 bg-amber-100 px-4 py-3 text-sm font-medium text-gray-800 shadow-[4px_4px_0_theme(colors.gray.800)]">
      <WarningDoodle size={16} className="shrink-0" />
      This post is a work in progress. Content may be incomplete or change.
    </div>
  );
}
