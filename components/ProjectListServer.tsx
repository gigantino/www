import { ofetch } from "ofetch";
import ProjectListClient from "./ProjectListClient";

export type Project = {
  title: string;
  description: string;
  links: { href: string; label: string }[];
};

interface ProjectListProps {
  projects: Project[];
}

export default async function ProjectListServer() {
  const projects = await ofetch<Project[]>(
    "https://cdn.ggtn.ch/blog/projects.json"
  );

  return <ProjectListClient projects={projects} />;
}
