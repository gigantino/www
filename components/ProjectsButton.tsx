"use client";

import { FolderDoodle } from "@/components/icons";

export function ProjectsButton() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-projects"));
  };

  return (
    <button
      onClick={handleClick}
      className={`neo-button flex items-center gap-2 bg-green-100 px-4 py-2 font-medium`}
    >
      <FolderDoodle size={16} />
      Projects
    </button>
  );
}
