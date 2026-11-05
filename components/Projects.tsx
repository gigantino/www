"use client";

import { useState, useEffect } from "react";
import { FolderDoodle, GithubDoodle } from "@/components/icons";
import { projects } from "@/lib/data";
import { Modal } from "@/components/ui/Modal";
import { Pin, Globe } from "lucide-react";

function ProjectLinks({
  website,
  github,
}: {
  website?: string;
  github?: string;
}) {
  if (!website && !github) return null;

  return (
    <div className="flex items-center gap-3 text-sm">
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
        >
          <Globe size={14} />
          <span className="neo-link">Website</span>
        </a>
      )}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
        >
          <GithubDoodle size={14} />
          <span className="neo-link">GitHub</span>
        </a>
      )}
    </div>
  );
}

function BuiltWithBrother({ github }: { github?: string }) {
  if (!github) return null;

  return (
    <p className="text-sm text-gray-600">
      Working on it with my brother{" "}
      <a
        href={`https://github.com/${github}`}
        target="_blank"
        rel="noopener noreferrer"
        className="neo-link font-medium text-gray-800"
      >
        @{github}
      </a>
    </p>
  );
}

function DeprecatedBadge() {
  return (
    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
      Deprecated
    </span>
  );
}

export function Projects() {
  const [isOpen, setIsOpen] = useState(false);

  const pinnedProjects = projects.filter((p) => p.pinned);
  const nonPinnedProjects = projects.filter((p) => !p.pinned);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-projects", handleOpen);
    return () => window.removeEventListener("open-projects", handleOpen);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Projects"
      icon={<FolderDoodle size={18} />}
      className="bg-green-100"
    >
      <ul className="flex flex-col gap-4">
        {pinnedProjects.map((project) => (
          <li
            key={project.name}
            className="neo-card flex flex-col gap-1 bg-white p-4"
          >
            <div className="flex items-center gap-2">
              {project.icon && (
                <img
                  src={project.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 rounded-full"
                />
              )}
              <h3 className="font-bold">{project.name}</h3>
              {project.deprecated && <DeprecatedBadge />}
              <Pin size={14} className="inline-block text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">{project.description}</p>
            <BuiltWithBrother github={project.brother} />
            <ProjectLinks website={project.website} github={project.github} />
          </li>
        ))}
      </ul>

      {nonPinnedProjects.length > 0 && (
        <ul className="mt-6 flex flex-col gap-4">
          {nonPinnedProjects.map((project) => (
            <li key={project.name} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{project.name}</h3>
                {project.deprecated && <DeprecatedBadge />}
              </div>
              <p className="text-sm text-gray-600">{project.description}</p>
              <BuiltWithBrother github={project.brother} />
              <ProjectLinks
                website={project.website}
                github={project.github}
              />
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
