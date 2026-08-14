import { db } from "@/lib/db";
import { ProjectsClient } from "@/components/projects/projects-client";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    include: {
      mentor: true,
      applications: {
        where: { status: "ACCEPTED" },
        include: { team: { select: { id: true, name: true, nameFa: true } } },
        take: 1,
      },
    },
  });

  // هر پروژه حداکثر یک درخواست پذیرفته‌شده دارد (چون هر پروژه فقط به یک تیم اختصاص می‌یابد)
  const projectsWithTeam = projects.map(({ applications, ...project }) => ({
    ...project,
    assignedTeam: applications[0]?.team || null,
  }));

  return <ProjectsClient initialProjects={projectsWithTeam} />;
}
