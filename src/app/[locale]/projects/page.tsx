import { db } from "@/lib/db";
import { ProjectsClient } from "@/components/projects/projects-client";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    include: { mentor: true }
  });

  return <ProjectsClient initialProjects={projects} />;
}
