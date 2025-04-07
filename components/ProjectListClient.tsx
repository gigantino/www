"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";

const ITEMS_PER_PAGE = 3;

export type Project = {
  title: string;
  description: string;
  links: { href: string; label: string }[];
};

interface ProjectListClientProps {
  projects: Project[];
}

export default function ProjectListClient({
  projects,
}: ProjectListClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const paginatedProjects = projects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="py-4 flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold dark:text-white">
        Side Projects™
      </h1>

      <div className="grid gap-4">
        {paginatedProjects.map((project, idx) => (
          <ProjectCard
            key={idx}
            title={project.title}
            description={project.description}
            links={project.links}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border text-sm font-bold dark:text-white dark:border-zinc-700 dark:bg-zinc-900 bg-zinc-100 text-zinc-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Prev
        </button>

        <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border text-sm font-bold dark:text-white dark:border-zinc-700 dark:bg-zinc-900 bg-zinc-100 text-zinc-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
