"use client";

import { Hammer } from "lucide-react";

interface ProjectsButtonProps {
  className?: string;
}

export function ProjectsButton({ className = "" }: ProjectsButtonProps) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-projects"));
  };

  return (
    <button
      onClick={handleClick}
      className={`neo-button flex items-center gap-2 bg-green-100 px-4 py-2 font-medium ${className}`}
    >
      <Hammer size={18} />
      Projects
    </button>
  );
}
